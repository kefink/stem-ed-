import time
from collections import defaultdict
from typing import Optional

from app.core.config import settings

try:
    import redis.asyncio as redis
    REDIS_AVAILABLE = True
except ImportError:
    REDIS_AVAILABLE = False


class RateLimiter:
    """Rate limiter with Redis backend (if available) or in-memory fallback."""
    
    def __init__(self):
        self.redis_client: Optional[redis.Redis] = None
        self.memory_store: dict = defaultdict(list)  # {key: [(timestamp, count), ...]}
        
        # Try to connect to Redis if URL is provided
        if REDIS_AVAILABLE and settings.REDIS_URL:
            try:
                self.redis_client = redis.from_url(
                    settings.REDIS_URL,
                    encoding="utf-8",
                    decode_responses=True
                )
            except Exception as e:
                # Avoid non-ASCII characters to prevent Windows console encoding issues
                print(f"Warning: Redis connection failed: {e}. Using in-memory rate limiting.")
                self.redis_client = None
        
        self.use_redis = self.redis_client is not None
        print(
            "Rate limiter initialized: {}".format(
                "Redis" if self.use_redis else "In-Memory"
            )
        )
    
    async def is_rate_limited(self, key: str, max_attempts: int, window_seconds: int) -> tuple[bool, int]:
        """
        Check if a key is rate limited.
        
        Returns:
            (is_limited, remaining_attempts)
        """
        if not settings.RATE_LIMIT_ENABLED:
            return False, max_attempts
        
        if self.use_redis:
            return await self._check_redis(key, max_attempts, window_seconds)
        else:
            return await self._check_memory(key, max_attempts, window_seconds)
    
    async def _check_redis(self, key: str, max_attempts: int, window_seconds: int) -> tuple[bool, int]:
        """Check rate limit using Redis."""
        try:
            current_time = int(time.time())
            window_start = current_time - window_seconds
            
            # Remove old entries
            await self.redis_client.zremrangebyscore(key, 0, window_start)
            
            # Count attempts in current window
            attempt_count = await self.redis_client.zcard(key)
            
            if attempt_count >= max_attempts:
                remaining = 0
                return True, remaining
            
            # Add current attempt
            await self.redis_client.zadd(key, {str(current_time): current_time})
            
            # Set expiry on key
            await self.redis_client.expire(key, window_seconds)
            
            remaining = max_attempts - attempt_count - 1
            return False, remaining
        
        except Exception as e:
            print(f"Warning: Redis error: {e}. Allowing request.")
            return False, max_attempts
    
    async def _check_memory(self, key: str, max_attempts: int, window_seconds: int) -> tuple[bool, int]:
        """Check rate limit using in-memory store."""
        current_time = time.time()
        window_start = current_time - window_seconds
        
        # Clean up old attempts
        self.memory_store[key] = [
            timestamp for timestamp in self.memory_store[key]
            if timestamp > window_start
        ]
        
        attempt_count = len(self.memory_store[key])
        
        if attempt_count >= max_attempts:
            remaining = 0
            return True, remaining
        
        # Record this attempt
        self.memory_store[key].append(current_time)
        
        remaining = max_attempts - attempt_count - 1
        return False, remaining
    
    async def reset(self, key: str):
        """Reset rate limit for a key (useful for testing or after successful auth)."""
        if self.use_redis and self.redis_client:
            try:
                await self.redis_client.delete(key)
            except Exception:
                pass
        else:
            if key in self.memory_store:
                del self.memory_store[key]
    
    async def cleanup_memory(self):
        """Periodic cleanup of expired entries in memory store (call from background task if needed)."""
        if not self.use_redis:
            current_time = time.time()
            keys_to_delete = []
            
            for key, timestamps in self.memory_store.items():
                # Remove entries older than max window
                self.memory_store[key] = [
                    ts for ts in timestamps
                    if current_time - ts < settings.RATE_LIMIT_LOGIN_WINDOW_SECONDS
                ]
                
                # Mark empty keys for deletion
                if not self.memory_store[key]:
                    keys_to_delete.append(key)
            
            for key in keys_to_delete:
                del self.memory_store[key]


# Global rate limiter instance
rate_limiter = RateLimiter()

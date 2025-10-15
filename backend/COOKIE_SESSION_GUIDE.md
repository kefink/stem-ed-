# Cookie Session Implementation Guide

## Overview

The backend now supports **optional httpOnly cookie-based sessions** alongside the default JWT bearer token approach.

## Modes

### Mode 1: JWT Bearer (Default - Current)

- Client receives tokens in JSON response
- Client stores tokens (localStorage, sessionStorage, or memory)
- Client sends `Authorization: Bearer <token>` header
- **Pros:** Simple, stateless, works with mobile apps
- **Cons:** Vulnerable to XSS if stored in localStorage

### Mode 2: httpOnly Cookies (Optional)

- Server sets secure cookies on login
- Browser automatically sends cookies with requests
- Tokens not accessible to JavaScript (XSS protection)
- **Pros:** Better security, automatic handling
- **Cons:** Requires CSRF protection, same-origin/CORS setup

## Enabling Cookie Mode

### 1. Update `.env`:

```bash
COOKIE_SESSION_ENABLED=true
COOKIE_SECURE=true  # Production only (requires HTTPS)
COOKIE_DOMAIN=.yourdomain.com  # For cross-subdomain (optional)
```

### 2. Restart the server

### 3. Login flow changes:

**Request (same):**

```bash
POST /api/v1/auth/login
Content-Type: application/x-www-form-urlencoded

username=user@example.com&password=SecurePass123!
```

**Response:**

- **JSON:** Still returns access_token + refresh_token (for compatibility)
- **Cookies:** Also sets `stemed_session`, `stemed_session_refresh`, `csrf_token`

**Subsequent requests:**

- Browser automatically sends cookies
- No need to manually add Authorization header
- **Must include CSRF token** in header for POST/PUT/DELETE:
  ```
  X-CSRF-Token: <value-from-csrf_token-cookie>
  ```

## CSRF Protection

When `COOKIE_SESSION_ENABLED=true`, implement CSRF validation:

### Frontend (JavaScript):

```javascript
// Read CSRF token from cookie
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

// Include in requests
fetch('/api/v1/users/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-CSRF-Token': getCookie('csrf_token')
  },
  body: JSON.stringify({...}),
  credentials: 'include'  // Important: send cookies
})
```

### Backend (FastAPI):

```python
from app.core.cookie_session import validate_csrf

@router.post("/protected")
async def protected_route(
    data: SomeSchema,
    csrf: None = Depends(validate_csrf),  # CSRF check
    user: User = Depends(get_current_user)
):
    # Route logic
    pass
```

## CORS Configuration

For cookie sessions with a separate frontend domain:

### Backend `.env`:

```bash
CORS_ORIGINS=http://localhost:3000,https://yourdomain.com
COOKIE_DOMAIN=.yourdomain.com  # Cross-subdomain
COOKIE_SAMESITE=none  # Required for cross-origin
COOKIE_SECURE=true  # Required for SameSite=none
```

### Frontend:

```javascript
fetch("https://api.yourdomain.com/api/v1/auth/login", {
  method: "POST",
  credentials: "include", // Critical for cookies
  // ...
});
```

## Hybrid Approach (Recommended)

Support both modes simultaneously:

- Mobile apps / SPAs: Use JWT bearer tokens
- SSR / Same-origin apps: Use cookies
- Check for cookie first, fallback to Authorization header

Example dependency:

```python
from fastapi import Cookie, Header

async def get_current_user_flexible(
    cookie_token: str | None = Cookie(None, alias="stemed_session"),
    bearer_token: str | None = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_session)
):
    token = cookie_token or bearer_token
    if not token:
        raise HTTPException(401, "Not authenticated")
    # ... validate token and return user
```

## Security Checklist

- [ ] Set `COOKIE_SECURE=true` in production
- [ ] Use HTTPS in production
- [ ] Implement CSRF validation for state-changing operations
- [ ] Set appropriate `COOKIE_DOMAIN` (don't use wildcard unless needed)
- [ ] Use `SameSite=strict` or `lax` unless cross-origin is required
- [ ] Rotate SECRET_KEY regularly
- [ ] Monitor for suspicious login patterns
- [ ] Implement rate limiting (already done ✅)
- [ ] Log security events (login attempts, token refreshes)

## Testing Cookie Mode

### 1. Enable in `.env`:

```bash
COOKIE_SESSION_ENABLED=true
```

### 2. Login via curl:

```bash
curl -c cookies.txt -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=user@example.com&password=SecurePass123!"
```

### 3. Use cookies in subsequent requests:

```bash
curl -b cookies.txt http://localhost:8000/api/v1/users/me
```

### 4. Inspect cookies:

```bash
cat cookies.txt
```

Should show: `stemed_session`, `stemed_session_refresh`, `csrf_token`

## Production Deployment Notes

### Environment:

```bash
COOKIE_SESSION_ENABLED=true
COOKIE_SECURE=true
COOKIE_DOMAIN=.yourdomain.com
COOKIE_SAMESITE=strict
APP_ENV=production
APP_DEBUG=false
```

### Nginx/Reverse Proxy:

Ensure proxy passes cookies and headers correctly:

```nginx
location /api/ {
    proxy_pass http://backend:8000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cookie_domain localhost yourdomain.com;
}
```

## References

- [OWASP CSRF Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)
- [MDN HTTP Cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies)
- [FastAPI Response Cookies](https://fastapi.tiangolo.com/advanced/response-cookies/)

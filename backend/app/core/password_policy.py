import re
from app.core.config import settings


class PasswordValidationError(Exception):
    """Raised when password doesn't meet policy requirements."""
    pass


def validate_password(password: str) -> None:
    """
    Validate password against configured policy.
    
    Raises PasswordValidationError with descriptive message if invalid.
    """
    errors = []
    
    # Check minimum length
    if len(password) < settings.PASSWORD_MIN_LENGTH:
        errors.append(f"at least {settings.PASSWORD_MIN_LENGTH} characters")
    
    # Check uppercase requirement
    if settings.PASSWORD_REQUIRE_UPPERCASE and not re.search(r'[A-Z]', password):
        errors.append("at least one uppercase letter")
    
    # Check lowercase requirement
    if settings.PASSWORD_REQUIRE_LOWERCASE and not re.search(r'[a-z]', password):
        errors.append("at least one lowercase letter")
    
    # Check digit requirement
    if settings.PASSWORD_REQUIRE_DIGIT and not re.search(r'\d', password):
        errors.append("at least one digit")
    
    # Check special character requirement
    if settings.PASSWORD_REQUIRE_SPECIAL and not re.search(r'[!@#$%^&*()_+\-=\[\]{};\':"\\|,.<>\/?]', password):
        errors.append("at least one special character (!@#$%^&*...)")
    
    if errors:
        msg = "Password must contain: " + ", ".join(errors)
        raise PasswordValidationError(msg)


# Common weak passwords (optional blacklist - can extend)
WEAK_PASSWORDS = {
    "password", "password123", "12345678", "qwerty", "abc123", 
    "letmein", "welcome", "monkey", "admin", "admin123"
}


def is_common_password(password: str) -> bool:
    """Check if password is in common/weak password list."""
    return password.lower() in WEAK_PASSWORDS

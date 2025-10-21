# Two-Factor Authentication (2FA)

## 🔐 Overview

This update introduces Time-based One-Time Password (TOTP) two-factor authentication to give every account an extra layer of protection. After enabling the feature, users must provide their password and a 6-digit code (or a backup recovery code) to complete sign-in.

## ✅ Key Capabilities

- Optional TOTP setup from the profile page
- Secure QR/secret provisioning for authenticator apps (Authy, Google Authenticator, etc.)
- One-time backup codes presented during setup and on regeneration
- Two-step login: password → 2FA code challenge
- Backup-code and password confirmation required to disable 2FA
- Regenerate backup codes on demand
- Detailed status (confirmed, last verified, codes remaining)

## 🗄️ Database Changes

Alembic revision `0006_add_two_factor_auth` adds the following columns to `users`:

- `two_factor_enabled` (bool)
- `two_factor_secret` (encrypted)
- `two_factor_backup_codes` (hashed JSON list)
- `two_factor_confirmed_at` (datetime)
- `two_factor_last_verified_at` (datetime)

## 🧠 Backend Implementation

- **Endpoints** (all under `/api/v1/auth`):
  - `POST /login` → returns a 202 challenge when 2FA is enabled
  - `POST /login/two-factor` → verifies code/backup code and issues tokens
  - `GET /2fa/status` → current 2FA state
  - `POST /2fa/setup` → generates secret + backup codes
  - `POST /2fa/enable` → confirms code and enables 2FA
  - `POST /2fa/disable` → password + code required to disable
  - `POST /2fa/backup-codes/regenerate` → produces a new code set
- **Services**: `app/services/two_factor.py` handles encryption, code verification, and backup-code rotation.
- **Security**: challenge tokens are short-lived JWTs with a dedicated scope. Access tokens now carry `scope="access"` to keep cookie/csrf flows safe.

## 💻 Frontend Experience

- **Login Page** (`src/app/login/page.tsx`):
  - Password step now detects 202 responses and transitions into a dedicated two-factor form with backup-code fallback.
- **Profile Page** (`src/app/profile/page.tsx`):
  - New management panel for enabling/disabling 2FA, viewing status, regenerating codes, and capturing setup secrets.
- **Auth Adapter** (`src/auth.ts`):
  - Prevents NextAuth from treating 2FA challenges as successful logins without pre-auth data.

## 🔍 Testing Checklist

1. Start setup → scan secret → confirm code → login now prompts for TOTP.
2. Fail 2FA code 5 times to observe rate limiting.
3. Use a backup code – code count decreases and login succeeds.
4. Regenerate backup codes – new set appears and previous codes are invalidated.
5. Disable 2FA with password + backup/ TOTP code.

The authentication stack now offers strong, layered protection suitable for production environments.

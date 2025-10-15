# STEM-ED-ARCHITECTS Backend (FastAPI)

Phase 2: Backend Integration

Stack

- FastAPI + Uvicorn
- SQLAlchemy 2 + Alembic
- MySQL (dev can start on SQLite)
- Redis (optional)
- S3/R2 (optional)

## Quick start (local)

1. Create and fill env file:

   - Copy `.env.example` to `.env` and update values.

2. Create a virtualenv and install deps:

```bash
python -m venv .venv
. .venv/Scripts/activate  # Windows Git Bash
pip install -U pip
pip install -r requirements.txt
```

3. Run the API:

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

4. Open docs:

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

Auth endpoints:

- POST /api/v1/auth/login (OAuth2 password flow) → returns JSON Token: { "access_token", "token_type" }
- GET /api/v1/users/me (requires Bearer token)

## Database

- For first run, SQLite is used by default for speed.
- To use MySQL, set `DATABASE_URL` in `.env` for example:
  `mysql+pymysql://stemed:stemed123@LAMPEIN:3306/stemeddb?charset=utf8mb4`
  (Replace credentials/host if different.)

### Create MySQL database & user

Run inside MySQL shell (after `mysql -u root -p`):

```sql
CREATE DATABASE stemeddb CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
CREATE USER 'stemed'@'localhost' IDENTIFIED BY 'stemed123';
GRANT ALL PRIVILEGES ON stemeddb.* TO 'stemed'@'localhost';
FLUSH PRIVILEGES;
```

### Test connection

```bash
mysql -u stemed -p stemeddb
```

Run Alembic migrations:

```bash
alembic upgrade head
```

## Docker (optional)

Use docker compose to boot MySQL, Redis, and API:

```bash
docker compose up -d
```

## Project layout

```
backend/
  app/
    api/
    core/
    db/
    models/
    schemas/
    services/
    main.py
  alembic/
  requirements.txt
  docker-compose.yml
```

## Next.js Auth.js integration (plan)

Two viable approaches:

1. JWT handoff (simplest)

- Next.js calls FastAPI `/auth/login` with credentials, receives JWT.
- Store JWT client-side (httpOnly cookie via Next.js API route preferred) and attach as `Authorization: Bearer` to API calls.
- Implement a Next.js middleware to read/refresh JWT and protect routes.

2. Cookie session (shared domain)

- FastAPI sets an httpOnly, secure cookie session on successful login (same-site or shared subdomain).
- Next.js requests include cookie automatically; FastAPI validates session from Redis.
- Requires domain coordination and CORS/cookie settings (allowedDevOrigins, credentials).

We’ll start with JWT handoff to move fast, then can evolve to cookie sessions if needed for SSO/security posture.

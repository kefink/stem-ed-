# 📋 QUICK REFERENCE - GOOGLE OAUTH SETUP

## 🎯 THE EXACT STEPS (Short Version)

### 1️⃣ Go to Google Cloud Console

**Link:** https://console.cloud.google.com/

### 2️⃣ Create Project

- Name: `STEM-ED-Architects`

### 3️⃣ Setup OAuth Consent Screen

- Go to: **APIs & Services** → **OAuth consent screen**
- Type: **External**
- App name: `STEM-ED Architects`
- Your email in all fields
- Add yourself as test user

### 4️⃣ Create Credentials

- Go to: **APIs & Services** → **Credentials**
- Click: **+ CREATE CREDENTIALS** → **OAuth client ID**
- Type: **Web application**
- Name: `STEM-ED Web Client`

### 5️⃣ Add URIs

**JavaScript origins:**

```
http://localhost:3000
```

**Redirect URIs (EXACT - no trailing slash!):**

```
http://localhost:3000/api/auth/callback/google
```

### 6️⃣ Copy Credentials

You'll get:

- Client ID: `123456-abc.apps.googleusercontent.com`
- Client Secret: `GOCSPX-xxxxx`

### 7️⃣ Update .env.local

File location: `c:\Users\MKT\desktop\kb\stem-ed-architects\.env.local`

Replace these lines with your actual values:

```env
GOOGLE_CLIENT_ID=paste-your-client-id-here
GOOGLE_CLIENT_SECRET=paste-your-client-secret-here
```

### 8️⃣ Restart Server

```bash
# Stop server: Ctrl + C
npm run dev:all
```

### 9️⃣ Test It!

Go to: http://localhost:3000/login
Click the Google button!

---

## ⚠️ COMMON MISTAKES TO AVOID

❌ **DON'T** add trailing slash to redirect URI
❌ **DON'T** forget to restart server after updating .env.local
❌ **DON'T** skip the OAuth consent screen setup
❌ **DON'T** commit .env.local to Git

✅ **DO** use exact redirect URI: `http://localhost:3000/api/auth/callback/google`
✅ **DO** add yourself as a test user
✅ **DO** restart server after changes
✅ **DO** keep client secret private

---

## 🔍 IMPORTANT URLs TO REMEMBER

| What                 | URL                                     |
| -------------------- | --------------------------------------- |
| Google Cloud Console | https://console.cloud.google.com/       |
| Your Login Page      | http://localhost:3000/login             |
| Your Register Page   | http://localhost:3000/register          |
| OAuth Credentials    | Console → APIs & Services → Credentials |

---

## 📞 NEED HELP?

Check the detailed guide:

- File: `GOOGLE_OAUTH_STEP_BY_STEP.md`
- Location: Same folder as this file

---

**Estimated Time:** 10-15 minutes for first-time setup

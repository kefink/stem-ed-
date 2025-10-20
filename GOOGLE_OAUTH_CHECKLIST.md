# ✅ GOOGLE OAUTH SETUP CHECKLIST

Print this out or keep it open while you work!

---

## PHASE 1: PREPARATION (Already Done!)

- [x] `.env.local` file created
- [x] AUTH_SECRET generated
- [x] Google login code added to website
- [x] Ready to configure Google!

---

## PHASE 2: GOOGLE CLOUD CONSOLE

### A. Create Project

- [ ] Open https://console.cloud.google.com/
- [ ] Sign in with Google account
- [ ] Click "Create Project" or dropdown → "New Project"
- [ ] Name: `STEM-ED-Architects`
- [ ] Click "CREATE"
- [ ] Wait for project to be created (15 seconds)

### B. Configure OAuth Consent Screen

- [ ] Click ☰ menu → "APIs & Services" → "OAuth consent screen"
- [ ] Select "External"
- [ ] Click "CREATE"
- [ ] App name: `STEM-ED Architects`
- [ ] User support email: Select your email
- [ ] Developer email: Enter your email
- [ ] Click "SAVE AND CONTINUE"
- [ ] On Scopes page: Click "SAVE AND CONTINUE" (skip)
- [ ] On Test users: Click "ADD USERS"
- [ ] Add your email address
- [ ] Click "ADD" then "SAVE AND CONTINUE"
- [ ] On Summary: Click "BACK TO DASHBOARD"

### C. Create OAuth Client ID

- [ ] Click "Credentials" in left sidebar
- [ ] Click "+ CREATE CREDENTIALS" button at top
- [ ] Select "OAuth client ID"
- [ ] Application type: Select "Web application"
- [ ] Name: `STEM-ED Web Client`

### D. Add Authorized URIs

- [ ] Under "Authorized JavaScript origins":

  - [ ] Click "+ ADD URI"
  - [ ] Enter: `http://localhost:3000`

- [ ] Under "Authorized redirect URIs":

  - [ ] Click "+ ADD URI"
  - [ ] Enter EXACTLY: `http://localhost:3000/api/auth/callback/google`
  - [ ] ⚠️ Check: No trailing slash!
  - [ ] ⚠️ Check: Spelling is exact!

- [ ] Click "CREATE" button

### E. Save Credentials

- [ ] Popup appears with credentials
- [ ] Click "DOWNLOAD JSON" button (saves backup)
- [ ] Copy Client ID (looks like: `123456-abc.apps.googleusercontent.com`)
- [ ] Copy Client Secret (looks like: `GOCSPX-xxxxx`)
- [ ] Keep popup open or save to notepad

---

## PHASE 3: UPDATE YOUR PROJECT

### A. Edit .env.local File

- [ ] Open file: `c:\Users\MKT\desktop\kb\stem-ed-architects\.env.local`
- [ ] Find line: `GOOGLE_CLIENT_ID=your-google-client-id-goes-here...`
- [ ] Replace with your actual Client ID
- [ ] Find line: `GOOGLE_CLIENT_SECRET=your-google-client-secret-goes-here`
- [ ] Replace with your actual Client Secret
- [ ] Save file (Ctrl + S)

### B. Verify .env.local Format

Your file should look like this:

```
AUTH_SECRET=dGhpc19pc19h...
NEXTAUTH_SECRET=dGhpc19pc19h...
NEXTAUTH_URL=http://localhost:3000

GOOGLE_CLIENT_ID=123456789-abcdef.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abcdefghijk
```

Verify:

- [ ] No spaces around `=` signs
- [ ] No quotes around values
- [ ] Client ID ends with `.apps.googleusercontent.com`
- [ ] Client Secret starts with `GOCSPX-`

---

## PHASE 4: START THE SERVER

### A. Stop Current Server (if running)

- [ ] Go to terminal
- [ ] Press `Ctrl + C`
- [ ] Wait for server to stop

### B. Start Server Again

- [ ] In terminal, run: `npm run dev:all`
- [ ] Wait 10-15 seconds
- [ ] Look for: "Local: http://localhost:3000"
- [ ] No errors displayed

---

## PHASE 5: TEST IT!

### A. Open Login Page

- [ ] Open browser
- [ ] Go to: `http://localhost:3000/login`
- [ ] Page loads successfully

### B. Find Google Button

- [ ] Look for button with Google logo
- [ ] Button says "Google"
- [ ] Button is below the "OR continue with" text

### C. Click Google Button

- [ ] Click the Google button
- [ ] You're redirected to Google sign-in page
- [ ] You see your app name: "STEM-ED Architects"

### D. Sign In

- [ ] Select your Google account
- [ ] Click "Continue" or "Allow" on permission screen
- [ ] You're redirected back to your website

### E. Verify Success

- [ ] You land on home page (`/`)
- [ ] You see logout or profile option in navbar
- [ ] You're logged in! 🎉

---

## TROUBLESHOOTING CHECKLIST

If something doesn't work, check:

- [ ] `.env.local` has correct Client ID and Secret
- [ ] No extra spaces in `.env.local`
- [ ] Redirect URI in Google Console is EXACTLY: `http://localhost:3000/api/auth/callback/google`
- [ ] Server was restarted after updating `.env.local`
- [ ] You added yourself as a test user in OAuth consent screen
- [ ] Browser console (F12) for error messages
- [ ] No typos in the redirect URI (common mistake!)

---

## 🎊 WHEN COMPLETE

You should be able to:

- ✅ Click Google button on `/login` page
- ✅ Click Google button on `/register` page
- ✅ Sign in with any Google account
- ✅ Be automatically logged in
- ✅ See your profile/logout in navbar

---

**Estimated Time:** 10-15 minutes  
**Difficulty:** Easy (just follow the steps!)

---

## WHAT TO DO NEXT

After Google sign-in works:

1. Test with different Google accounts
2. Test the register page (`/register`)
3. Test logout and login again
4. Show off to your team! 😎

---

**Questions? Check GOOGLE_OAUTH_STEP_BY_STEP.md for detailed explanations!**

# 🚀 STEP-BY-STEP GOOGLE OAUTH SETUP GUIDE

## ✅ STEP 1: PREPARE YOUR ENVIRONMENT FILE (DONE!)

Your `.env.local` file is ready! It has placeholders for Google credentials.

---

## 🌐 STEP 2: CREATE GOOGLE OAUTH CREDENTIALS

### **2.1 - Go to Google Cloud Console**

1. Open your browser
2. Go to: **https://console.cloud.google.com/**
3. Sign in with your Google account (any Gmail account works)

---

### **2.2 - Create or Select a Project**

When the page loads:

**Option A - If you have NO projects:**

- Click **"Create Project"** button
- Project name: `STEM-ED-Architects` (or any name you like)
- Click **"CREATE"**
- Wait 10-15 seconds for project creation

**Option B - If you already have projects:**

- Click the project dropdown at the top (next to "Google Cloud")
- Click **"NEW PROJECT"**
- Project name: `STEM-ED-Architects`
- Click **"CREATE"**

---

### **2.3 - Configure OAuth Consent Screen (REQUIRED FIRST)**

1. In the left sidebar, click **"APIs & Services"**
   - If you don't see it, click the ☰ hamburger menu first
2. Click **"OAuth consent screen"**

3. Choose user type:

   - Select **"External"** (allows anyone with a Google account)
   - Click **"CREATE"**

4. Fill in the OAuth consent screen form:

   **App information:**

   - App name: `STEM-ED Architects`
   - User support email: `your-email@gmail.com` (select from dropdown)
   - App logo: (SKIP for now - optional)

   **App domain (SKIP ALL - Optional):**

   - Leave blank for development

   **Developer contact information:**

   - Email: `your-email@gmail.com`

   **Click "SAVE AND CONTINUE"**

5. **Scopes page:**

   - Click **"SAVE AND CONTINUE"** (no changes needed)

6. **Test users page:**

   - Click **"ADD USERS"**
   - Add your email: `your-email@gmail.com`
   - Click **"ADD"**
   - Click **"SAVE AND CONTINUE"**

7. **Summary page:**
   - Review everything
   - Click **"BACK TO DASHBOARD"**

✅ **OAuth consent screen is now configured!**

---

### **2.4 - Create OAuth Client ID**

1. In the left sidebar, click **"Credentials"**

2. Click the **"+ CREATE CREDENTIALS"** button at the top

3. Select **"OAuth client ID"** from dropdown

4. Configure your OAuth client:

   **Application type:**

   - Select **"Web application"** from dropdown

   **Name:**

   - Enter: `STEM-ED Web Client`

   **Authorized JavaScript origins:**

   - Click **"+ ADD URI"**
   - Enter: `http://localhost:3000`
   - Click **"+ ADD URI"** again (for production later)
   - Enter your production URL if you have one (e.g., `https://stem-ed.com`)

   **Authorized redirect URIs:**

   - Click **"+ ADD URI"**
   - Enter EXACTLY: `http://localhost:3000/api/auth/callback/google`
   - ⚠️ **IMPORTANT:** No trailing slash! Must be EXACT!
   - Click **"+ ADD URI"** again (for production later)
   - Enter: `https://your-domain.com/api/auth/callback/google` (if you have production URL)

   **Click "CREATE"**

5. **SAVE YOUR CREDENTIALS!** 🎉

   A popup will appear with your credentials:

   ```
   Your Client ID:
   123456789-abcdefghijk.apps.googleusercontent.com

   Your Client Secret:
   GOCSPX-AbCdEfGhIjKlMnOpQrStUvWxYz
   ```

   **⚠️ IMPORTANT:**

   - Click the **DOWNLOAD JSON** button (saves a backup)
   - Click the **COPY** button next to Client ID
   - Click the **COPY** button next to Client Secret
   - **DON'T CLOSE THIS POPUP YET!**

---

## 📝 STEP 3: UPDATE YOUR .env.local FILE

Now we need to put those credentials in your `.env.local` file:

### **3.1 - Open the file**

The file is located at:

```
c:\Users\MKT\desktop\kb\stem-ed-architects\.env.local
```

### **3.2 - Replace the placeholders**

Find these two lines:

```
GOOGLE_CLIENT_ID=your-google-client-id-goes-here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret-goes-here
```

Replace them with YOUR actual values from Google:

```
GOOGLE_CLIENT_ID=123456789-abcdefghijk.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-AbCdEfGhIjKlMnOpQrStUvWxYz
```

### **3.3 - Save the file**

Press `Ctrl + S` to save!

---

## 🎯 STEP 4: RESTART YOUR DEVELOPMENT SERVER

### **4.1 - Stop the current server**

In your terminal, press: `Ctrl + C` (twice if needed)

### **4.2 - Start the server again**

Run the command:

```bash
npm run dev:all
```

Wait for the server to start (usually 10-15 seconds)

---

## 🧪 STEP 5: TEST GOOGLE SIGN-IN

### **5.1 - Open your browser**

Go to: **http://localhost:3000/login**

### **5.2 - Click the Google button**

You should see a button with the Google logo that says "Google"

### **5.3 - Sign in with Google**

1. Click the Google button
2. You'll be redirected to Google's sign-in page
3. Sign in with your Google account
4. Google will ask for permission (consent screen)
5. Click **"Continue"** or **"Allow"**
6. You'll be redirected back to your app
7. **You should be logged in!** 🎉

### **5.4 - Verify you're logged in**

- Check the navbar - you should see your profile/logout options
- You should be on the home page (`/`)

---

## ❓ TROUBLESHOOTING

### **Problem: "Redirect URI mismatch" error**

**Solution:**

- Go back to Google Cloud Console > Credentials
- Click on your OAuth Client ID
- Check the redirect URI is EXACTLY:
  ```
  http://localhost:3000/api/auth/callback/google
  ```
- No trailing slash!
- Save and try again

### **Problem: "Invalid client" error**

**Solution:**

- Check your `.env.local` file
- Make sure GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are correct
- No extra spaces or quotes
- Restart dev server

### **Problem: Google button doesn't do anything**

**Solution:**

- Open browser console (F12)
- Check for error messages
- Make sure `.env.local` has the Google credentials
- Restart dev server

### **Problem: "This app isn't verified"**

**Solution:**

- This is normal for development!
- Click **"Advanced"**
- Click **"Go to STEM-ED Architects (unsafe)"**
- This only appears in development mode

---

## 🎊 SUCCESS!

If everything worked, you should now be able to:

✅ Click "Continue with Google" on the login page
✅ Click "Continue with Google" on the register page  
✅ Sign in instantly with your Google account
✅ No password needed!

---

## 📍 WHERE TO FIND THINGS

**Google Cloud Console:**

- URL: https://console.cloud.google.com/
- Credentials: APIs & Services > Credentials

**Your .env.local file:**

- Path: `c:\Users\MKT\desktop\kb\stem-ed-architects\.env.local`
- ⚠️ Never commit this file to Git!

**Login page to test:**

- URL: http://localhost:3000/login

**Register page to test:**

- URL: http://localhost:3000/register

---

## 🔐 SECURITY REMINDERS

- ✅ `.env.local` is already in `.gitignore` - good!
- ⚠️ NEVER share your Client Secret publicly
- ⚠️ NEVER commit `.env.local` to GitHub
- ✅ Keep the downloaded JSON file safe (backup)

---

## 🚀 NEXT: PRODUCTION DEPLOYMENT

When you're ready to deploy:

1. Add your production domain to:
   - Google Cloud Console > Authorized JavaScript origins
   - Google Cloud Console > Authorized redirect URIs
2. Update production environment variables:
   - `NEXTAUTH_URL=https://your-domain.com`
   - Keep same GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET
3. Update OAuth consent screen:
   - Add your production domain
   - Submit for verification (optional, but recommended)

---

**Good luck! Let me know if you get stuck on any step!** 🎉

# 🚀 CLOUDFLARE R2 SETUP GUIDE - STEP BY STEP

## Complete Beginner-Friendly Guide for STEM-ED-ARCHITECTS

**Time Required:** 15-20 minutes  
**Cost:** $0 (Free tier - 10GB storage)  
**Difficulty:** ⭐⭐☆☆☆ (Easy)

---

## 📋 WHAT YOU'LL NEED

- ✅ Email address
- ✅ Credit card (for verification only - won't be charged on free tier)
- ✅ Internet connection
- ✅ This guide

---

## STEP 1: CREATE CLOUDFLARE ACCOUNT

### 1.1 Go to Cloudflare Website

1. Open your browser
2. Go to: **https://dash.cloudflare.com/sign-up**
3. You'll see a sign-up page

### 1.2 Fill in Sign-Up Form

```
Full Name:     [Your name]
Email:         [Your email - you'll use this to log in]
Password:      [Create a strong password - write it down!]
```

4. Click **"Sign Up"** button
5. Check your email inbox
6. Click the verification link in the email from Cloudflare
7. You'll be redirected to Cloudflare Dashboard

### ✅ Checkpoint: You should now see Cloudflare Dashboard homepage

---

## STEP 2: NAVIGATE TO R2 STORAGE

### 2.1 Find R2 in Dashboard

1. On the left sidebar, look for **"R2"** icon (looks like a database/storage icon)
2. **If you can't see it:** Click the hamburger menu (☰) at top-left
3. Scroll down to find **"R2 Object Storage"**
4. Click on **"R2"**

### 2.2 Enable R2 (First Time Only)

- You'll see a welcome screen: **"Welcome to R2"**
- Click **"Get Started"** or **"Enable R2"** button
- Read the pricing (confirm it says **10 GB free per month**)
- Click **"Agree"** or **"Continue"**

### 2.3 Payment Method (Verification Only)

**⚠️ IMPORTANT: You will NOT be charged on free tier!**

1. Click **"Add Payment Method"**
2. Enter your credit card details:
   ```
   Card Number:    [Your card number]
   Expiry Date:    MM/YY
   CVV:            [3-digit code]
   Billing Address: [Your address]
   ```
3. Click **"Add Payment Method"**
4. You might see a $0.00 or $1.00 temporary authorization (will be refunded)

### ✅ Checkpoint: R2 is now enabled! You should see "Create Bucket" button

---

## STEP 3: CREATE YOUR FIRST R2 BUCKET

### 3.1 Click "Create Bucket"

1. You'll see **"Create bucket"** button - click it
2. A form will appear

### 3.2 Fill in Bucket Details

**Bucket Name:**

```
stemed-media-production
```

**⚠️ Important Rules:**

- Must be lowercase
- No spaces (use hyphens -)
- Must be unique globally
- Between 3-63 characters

**Location:**

- Select **"Automatic"** (Cloudflare chooses best location)
- OR select **"EEUR"** (Eastern Europe - closest to Africa)

**Storage Class:**

- Leave as **"Standard"** (default)

### 3.3 Configure Bucket Settings

**Public Access:**

- For now, leave as **"Allow public access"** (we'll use this for product images)
- You can change this later for private files

**CORS Policy:**

- Click **"Add CORS policy"** (optional, but recommended)
- Or skip for now - we'll add it later if needed

### 3.4 Create the Bucket

1. Click **"Create bucket"** button at the bottom
2. Wait 2-3 seconds...
3. ✅ Success! Your bucket is created!

### ✅ Checkpoint: You should see your bucket "stemed-media-production" in the list

---

## STEP 4: GET YOUR R2 CREDENTIALS (IMPORTANT!)

### 4.1 Create API Token

1. Click on your bucket name **"stemed-media-production"**
2. Look for **"Settings"** tab at the top - click it
3. Scroll down to find **"R2 API Tokens"** section
4. Click **"Create API Token"** or **"Manage R2 API Tokens"**

### 4.2 Generate New Token

1. Click **"Create API Token"** button
2. Fill in the form:

   **Token Name:**

   ```
   stemed-backend-access
   ```

   **Permissions:**

   - Select **"Object Read & Write"** (allows upload and download)

   **Bucket Selection:**

   - Choose **"Apply to specific buckets only"**
   - Select your bucket: **stemed-media-production**

   **TTL (Time to Live):**

   - Leave as **"Forever"** (doesn't expire)

3. Click **"Create API Token"**

### 4.3 COPY AND SAVE CREDENTIALS (CRITICAL!)

**⚠️ YOU'LL ONLY SEE THIS ONCE! COPY NOW!**

You'll see a screen with credentials. **Copy these and save them securely:**

```
Access Key ID:     xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
Secret Access Key: yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy
```

**Create a temporary text file to save these:**

1. Open Notepad (Windows) or TextEdit (Mac)
2. Paste the credentials like this:

```
CLOUDFLARE R2 CREDENTIALS - STEM-ED-ARCHITECTS
================================================
Access Key ID:     [paste here]
Secret Access Key: [paste here]
Date Created:      October 24, 2025
Bucket Name:       stemed-media-production
```

3. Save this file somewhere safe (e.g., Desktop > note)
4. **⚠️ DO NOT share these with anyone!**
5. **⚠️ DO NOT commit to GitHub!**

### ✅ Checkpoint: You have copied both Access Key ID and Secret Access Key

---

## STEP 5: GET YOUR R2 ENDPOINT URL

### 5.1 Find Your Account ID

1. Still in Cloudflare Dashboard
2. Look at the URL in your browser - it should look like:
   ```
   https://dash.cloudflare.com/ACCOUNT_ID_HERE/r2/...
   ```
3. The **ACCOUNT_ID** is a 32-character string (letters and numbers)
4. Copy this Account ID

**OR:**

1. Click your profile icon (top right)
2. Find your **Account ID** in the account dropdown
3. Copy it

### 5.2 Construct Your R2 Endpoint

Your endpoint URL follows this pattern:

```
https://ACCOUNT_ID.r2.cloudflarestorage.com
```

**Example:**

```
If your Account ID is: abc123def456ghi789
Your endpoint is: https://abc123def456ghi789.r2.cloudflarestorage.com
```

### 5.3 Add to Your Credentials File

Open your `r2-credentials.txt` file and add:

```
R2 Endpoint:       https://[YOUR_ACCOUNT_ID].r2.cloudflarestorage.com
Account ID:        [YOUR_ACCOUNT_ID]
```

### ✅ Checkpoint: You have your endpoint URL with your account ID

---

## STEP 6: GET YOUR PUBLIC BUCKET URL

### 6.1 Find Public URL

1. Go back to your bucket: **stemed-media-production**
2. Click **"Settings"** tab
3. Look for **"Public URL"** or **"Bucket URL"** section
4. You should see something like:

```
https://pub-xxxxxxxxxxxxxxxx.r2.dev
```

This is your **public URL** - this is what users will access to download files.

### 6.2 Enable Public Access (If Not Already)

If you don't see a public URL:

1. In **Settings** tab
2. Find **"Public Access"** section
3. Click **"Allow Access"** or **"Enable Public Access"**
4. Confirm the action
5. Your public URL will appear

### 6.3 Add to Credentials File

```
Public Bucket URL: https://pub-xxxxxxxxxxxxxxxx.r2.dev
```

### ✅ Checkpoint: You have your public bucket URL

---

## STEP 7: SUMMARY OF WHAT YOU HAVE

Open your `r2-credentials.txt` file. You should have:

```
CLOUDFLARE R2 CREDENTIALS - STEM-ED-ARCHITECTS
================================================

Bucket Name:       stemed-media-production
Account ID:        abc123def456ghi789
R2 Endpoint:       https://abc123def456ghi789.r2.cloudflarestorage.com
Access Key ID:     xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
Secret Access Key: yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy
Public Bucket URL: https://pub-xxxxxxxxxxxxxxxx.r2.dev

Created: October 24, 2025
Status: Active
Free Tier: 10 GB storage, Unlimited egress
```

### ✅ CHECKLIST - VERIFY YOU HAVE ALL:

- [ ] Cloudflare account created ✅
- [ ] R2 enabled ✅
- [ ] Bucket created: `stemed-media-production` ✅
- [ ] API Token created ✅
- [ ] Access Key ID (32 characters) ✅
- [ ] Secret Access Key (43-64 characters) ✅
- [ ] R2 Endpoint URL (with account ID) ✅
- [ ] Public Bucket URL (pub-xxxxx.r2.dev) ✅

---

## 📝 NEXT STEPS

Now that you have your R2 credentials, we'll:

1. ✅ Add these credentials to your backend `.env` file
2. ✅ Install `boto3` package
3. ✅ Update `file_storage.py` to use R2
4. ✅ Test file upload to R2
5. ✅ Verify files are publicly accessible

**Tell me when you're ready, and I'll help you add these credentials to your project!**

---

## 🆘 TROUBLESHOOTING

### Problem: Can't find R2 in sidebar

**Solution:**

- Click hamburger menu (☰) at top-left
- Scroll to "Storage & Databases" section
- Click "R2"

### Problem: Asked for payment but worried about charges

**Solution:**

- Free tier gives you 10 GB storage per month FREE
- You'll only be charged if you exceed 10 GB
- You can set up billing alerts in Cloudflare
- First $0 for 10GB, then $0.015 per GB after that

### Problem: Bucket name already taken

**Solution:**

- Try: `stemed-media-prod-2024`
- Or: `stemed-your-initials-media`
- Or: `stem-ed-architects-media`

### Problem: Don't see Public URL

**Solution:**

1. Go to bucket **Settings**
2. Find **"Public Access"** or **"R2.dev subdomain"**
3. Click **"Allow Access"** or **"Enable"**
4. Public URL will be generated

### Problem: Lost API credentials

**Solution:**

- You'll need to create a new API token
- Go to R2 → API Tokens → Delete old token
- Create new token following Step 4 again
- Old token will stop working once deleted

---

## 📞 NEED HELP?

- Cloudflare R2 Docs: https://developers.cloudflare.com/r2/get-started/
- Cloudflare Support: https://support.cloudflare.com/

---

**Status:** ⏸️ Waiting for you to complete R2 setup  
**Next:** Add credentials to backend and test upload

**Tell me when you're done with the setup, and paste "READY" - then we'll move to the next step!**

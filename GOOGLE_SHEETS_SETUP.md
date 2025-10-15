# Google Sheets Integration Setup Guide

This guide explains how to configure the application to automatically save contact messages and newsletter subscriptions to Google Sheets while still displaying them in the admin dashboard.

## Prerequisites

- Gmail/Google account
- Access to Google Cloud Console
- Two Google Sheets created and shared with your service account

## Step 1: Google Cloud Project Setup

### 1.1 Create a New Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" dropdown → "New Project"
3. Enter project name: `STEM-ED-Data` (or your choice)
4. Click "Create"
5. Wait for project creation to complete

### 1.2 Enable Required APIs

1. In the search bar at the top, search for "Google Sheets API"
2. Click on it, then click "Enable"
3. Go back and search for "Google Drive API"
4. Click on it, then click "Enable"

## Step 2: Create Service Account

### 2.1 Create the Service Account

1. In Google Cloud Console, go to **"IAM & Admin"** → **"Service Accounts"**
2. Click **"Create Service Account"**
3. Fill in:
   - **Service account name**: `stemed-sheets-writer`
   - **Service account ID**: (auto-generated, usually `stemed-sheets-writer@your-project.iam.gserviceaccount.com`)
   - **Description**: "Service account for writing contact messages and newsletter subs to Google Sheets"
4. Click **"Create and Continue"**
5. Skip role assignment (click "Continue")
6. Click **"Done"**

### 2.2 Generate JSON Key

1. Find your service account in the list and click on it
2. Go to the **"Keys"** tab
3. Click **"Add Key"** → **"Create new key"**
4. Select **"JSON"** format
5. Click **"Create"**
6. **Important**: A JSON file will download automatically - **SAVE IT SECURELY!**
7. Rename the file to something simple like `google-sheets-credentials.json`

### 2.3 Copy the Service Account Email

From the downloaded JSON file, copy the `client_email` value. It looks like:

```
stemed-sheets-writer@stem-ed-data-123456.iam.gserviceaccount.com
```

You'll need this in the next step.

## Step 3: Create and Share Google Sheets

### 3.1 Create Two Google Sheets

1. Go to [Google Sheets](https://docs.google.com/spreadsheets/)
2. Create **Sheet 1**:

   - Click **"Blank"** to create a new sheet
   - Name it: **"STEM-ED Contact Messages"**
   - Leave it empty (headers will be auto-created)

3. Create **Sheet 2**:
   - Click **"Blank"** to create another sheet
   - Name it: **"STEM-ED Newsletter Subscribers"**
   - Leave it empty (headers will be auto-created)

### 3.2 Share Sheets with Service Account

For **EACH** of the two sheets:

1. Click the **"Share"** button (top right)
2. In the "Add people and groups" field, paste the service account email from Step 2.3
3. Set permission to **"Editor"**
4. **IMPORTANT**: Uncheck "Notify people" (service accounts can't receive emails)
5. Click **"Share"**

### 3.3 Copy Sheet IDs

For **EACH** sheet, copy the Sheet ID from the URL:

The URL looks like:

```
https://docs.google.com/spreadsheets/d/1ABC123XYZ_SHEET_ID_HERE/edit
                                      ^^^^^^^^^^^^^^^^^^^^
                                      This is the Sheet ID
```

Save both Sheet IDs:

- Contact Messages Sheet ID: `__________________`
- Newsletter Subscribers Sheet ID: `__________________`

## Step 4: Configure Backend

### 4.1 Place Credentials File

1. Copy the `google-sheets-credentials.json` file you downloaded in Step 2.2
2. Place it in the `backend/` directory (same level as `main.py`, `.env`, etc.)

**Security Note**: This file contains sensitive credentials. Make sure it's listed in `.gitignore` so it's never committed to Git!

### 4.2 Update `.env` File

Open `backend/.env` and add these three lines:

```env
# Google Sheets Integration
GOOGLE_SHEETS_CREDENTIALS_FILE=google-sheets-credentials.json
GOOGLE_SHEETS_CONTACT_SHEET_ID=YOUR_CONTACT_SHEET_ID_HERE
GOOGLE_SHEETS_NEWSLETTER_SHEET_ID=YOUR_NEWSLETTER_SHEET_ID_HERE
```

Replace:

- `YOUR_CONTACT_SHEET_ID_HERE` with the Sheet ID from Step 3.3 (Contact Messages sheet)
- `YOUR_NEWSLETTER_SHEET_ID_HERE` with the Sheet ID from Step 3.3 (Newsletter Subscribers sheet)

### 4.3 Restart the Backend

Stop and restart your dev servers:

```bash
# Press Ctrl+C to stop
npm run dev:all
```

## Step 5: Test the Integration

### 5.1 Test Contact Form

1. Go to your website's contact page: http://localhost:3000/contact
2. Fill out the form and submit
3. Check your Google Sheet "STEM-ED Contact Messages"
4. You should see a new row with the contact details!

### 5.2 Test Newsletter Subscription

1. Go to your website's newsletter page: http://localhost:3000/newsletter
2. Fill out the form and subscribe
3. Check your Google Sheet "STEM-ED Newsletter Subscribers"
4. You should see a new row with the subscriber details!

### 5.3 Verify Admin Dashboard Still Works

1. Go to admin dashboard: http://localhost:3000/admin
2. You should still see the same data displayed
3. **Data is now in BOTH places**: Database (for admin dashboard) AND Google Sheets (for your records)

## How It Works

### Architecture

```
User submits form
      ↓
Backend receives request
      ↓
   ┌──────────────────┐
   │  Save to MySQL   │ ← Admin dashboard reads from here
   │    Database      │
   └──────────────────┘
      ↓
   ┌──────────────────┐
   │ Save to Google   │ ← Your permanent record
   │     Sheets       │
   └──────────────────┘
      ↓
Return success response
```

### Key Features

✅ **Dual Storage**: Data saved in both MySQL (for admin dashboard) and Google Sheets (for your records)

✅ **Non-Blocking**: If Google Sheets is down, the form still works (data saved to database)

✅ **Auto Headers**: First submission automatically creates column headers in sheets

✅ **Persistent**: Google Sheets data stays forever, even if you reset your database

✅ **Easy Access**: View/export data anytime from Google Sheets

## Troubleshooting

### "Google Sheets integration disabled"

**Cause**: Missing credentials or sheet IDs in `.env` file

**Solution**: Double-check Step 4.2 - make sure all three env variables are set correctly

### "Failed to save to Google Sheets: Permission denied"

**Cause**: Sheet not shared with service account

**Solution**: Go back to Step 3.2 and share both sheets with the service account email

### "Failed to initialize Google Sheets client"

**Cause**: Invalid or missing credentials JSON file

**Solution**:

- Check that `google-sheets-credentials.json` exists in `backend/` directory
- Check that the filename in `.env` matches exactly
- Try downloading a new JSON key from Google Cloud Console

### Sheet shows "Loading..." or doesn't update

**Cause**: Sheet ID is incorrect

**Solution**:

- Go back to Step 3.3 and copy the correct Sheet ID from the URL
- Make sure you're copying the long alphanumeric string, not the entire URL

## Security Best Practices

🔒 **Never commit credentials to Git**

- Add `google-sheets-credentials.json` to `.gitignore`
- Never share the JSON file publicly

🔒 **Limit service account permissions**

- Only share specific sheets (not entire Google Drive)
- Use "Editor" permission (not "Owner")

🔒 **Rotate credentials periodically**

- Delete old keys from Google Cloud Console
- Generate new keys every 6-12 months

## Optional: Disable Integration

To disable Google Sheets integration (data will only save to database):

1. Open `backend/.env`
2. Comment out or remove the three Google Sheets env variables:
   ```env
   # GOOGLE_SHEETS_CREDENTIALS_FILE=google-sheets-credentials.json
   # GOOGLE_SHEETS_CONTACT_SHEET_ID=...
   # GOOGLE_SHEETS_NEWSLETTER_SHEET_ID=...
   ```
3. Restart backend

The system will automatically detect missing config and skip Google Sheets writes.

## Support

If you encounter issues:

1. Check the backend terminal logs for error messages
2. Verify all steps in this guide were completed
3. Test the credentials manually using Python (see next section)

### Test Credentials Manually

Create a file `backend/test_sheets.py`:

```python
import gspread
from google.oauth2.service_account import Credentials

# Update these with your values
CREDENTIALS_FILE = "google-sheets-credentials.json"
SHEET_ID = "YOUR_SHEET_ID_HERE"

scopes = [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive"
]

creds = Credentials.from_service_account_file(CREDENTIALS_FILE, scopes=scopes)
client = gspread.authorize(creds)

sheet = client.open_by_key(SHEET_ID).sheet1
print("✅ Connected successfully!")
print(f"Sheet name: {sheet.title}")
print(f"Row count: {sheet.row_count}")
```

Run it:

```bash
cd backend
.venv/Scripts/python.exe test_sheets.py
```

If this works, your credentials are correct!

---

**That's it!** Your contact messages and newsletter subscriptions will now be automatically saved to Google Sheets. 🎉

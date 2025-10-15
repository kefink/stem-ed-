# Quick Reference: Google Sheets Integration

## What You Need

### 1. Service Account JSON File

- Download from: Google Cloud Console → IAM & Admin → Service Accounts → Keys
- Filename: `google-sheets-credentials.json`
- Location: Place in `backend/` folder (same level as `.env`)

### 2. Service Account Email

From the JSON file, copy the `client_email`:

```
stemed-sheets-writer@your-project.iam.gserviceaccount.com
```

### 3. Two Google Sheets

Create these sheets and share with service account email (Editor permission):

**Sheet 1: Contact Messages**

- Name: "STEM-ED Contact Messages" (or any name)
- URL: `https://docs.google.com/spreadsheets/d/CONTACT_SHEET_ID/edit`
- Copy the `CONTACT_SHEET_ID` from URL

**Sheet 2: Newsletter Subscribers**

- Name: "STEM-ED Newsletter Subscribers" (or any name)
- URL: `https://docs.google.com/spreadsheets/d/NEWSLETTER_SHEET_ID/edit`
- Copy the `NEWSLETTER_SHEET_ID` from URL

---

## Configuration Checklist

### ✅ Step 1: Place Credentials File

```
backend/
  ├── .env
  ├── main.py
  ├── google-sheets-credentials.json  ← Put file here
  └── ...
```

### ✅ Step 2: Update .env File

Open `backend/.env` and add:

```env
# Google Sheets Integration (Optional)
GOOGLE_SHEETS_CREDENTIALS_FILE=google-sheets-credentials.json
GOOGLE_SHEETS_CONTACT_SHEET_ID=1ABC123_YOUR_CONTACT_SHEET_ID_HERE
GOOGLE_SHEETS_NEWSLETTER_SHEET_ID=1XYZ789_YOUR_NEWSLETTER_SHEET_ID_HERE
```

### ✅ Step 3: Restart Backend

```bash
# In terminal, press Ctrl+C to stop, then:
npm run dev:all
```

### ✅ Step 4: Look for Confirmation

In the terminal logs, you should see:

```
✅ Google Sheets client initialized successfully
```

If you see:

```
⚠️  Google Sheets integration disabled (missing credentials or sheet IDs)
```

Then check your `.env` file - something is missing or incorrect.

---

## Testing

### Test Contact Form

1. Go to: http://localhost:3000/contact
2. Fill out and submit form
3. Check your Google Sheet "STEM-ED Contact Messages"
4. Should see new row with contact details!

### Test Newsletter

1. Go to: http://localhost:3000/newsletter
2. Fill out and subscribe
3. Check your Google Sheet "STEM-ED Newsletter Subscribers"
4. Should see new row with subscriber details!

### Verify Admin Dashboard

1. Go to: http://localhost:3000/admin
2. Should still see all data (from database)
3. Data is now in BOTH places!

---

## Troubleshooting

| Error Message                        | Solution                                               |
| ------------------------------------ | ------------------------------------------------------ |
| "Google Sheets integration disabled" | Check `.env` - all 3 variables must be set             |
| "Permission denied"                  | Share sheet with service account email (Editor access) |
| "Failed to initialize client"        | Check credentials file exists in `backend/` folder     |
| "Invalid Sheet ID"                   | Copy ID from URL (between `/d/` and `/edit`)           |

---

## Optional: Disable Integration

To disable Google Sheets (keep only database):

1. Open `backend/.env`
2. Comment out or delete the 3 Google Sheets lines:
   ```env
   # GOOGLE_SHEETS_CREDENTIALS_FILE=...
   # GOOGLE_SHEETS_CONTACT_SHEET_ID=...
   # GOOGLE_SHEETS_NEWSLETTER_SHEET_ID=...
   ```
3. Restart backend

System will auto-detect and skip Google Sheets writes.

---

## Need Help?

See full detailed guide: `GOOGLE_SHEETS_SETUP.md`

---

**That's it! Simple as 1-2-3!** 🎉

# Google Authentication Setup Guide

## Overview

This application now supports Google OAuth authentication for both login and registration. Users can sign in with their Google account seamlessly.

## 🔧 Setup Instructions

### 1. Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth client ID**
5. If prompted, configure the OAuth consent screen first:

   - Choose **External** for user type
   - Fill in application name: **STEM-ED Architects**
   - Add your email as developer contact
   - Add authorized domains: `localhost`, your production domain
   - Save and continue

6. Create OAuth Client ID:

   - Application type: **Web application**
   - Name: **STEM-ED Web App**
   - Authorized JavaScript origins:
     - `http://localhost:3000` (for development)
     - `https://yourdomain.com` (for production)
   - Authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google` (for development)
     - `https://yourdomain.com/api/auth/callback/google` (for production)

7. Click **Create** and copy your:
   - **Client ID**
   - **Client Secret**

### 2. Environment Variables

Create or update your `.env.local` file:

```env
# NextAuth Configuration
AUTH_SECRET="your-secret-key-here"  # Generate with: openssl rand -base64 32
NEXTAUTH_URL="http://localhost:3000"  # Change to your domain in production
NEXTAUTH_SECRET="your-secret-key-here"  # Same as AUTH_SECRET

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Backend API (if different from localhost:8000)
API_BASE_URL="http://localhost:8000"
```

### 3. Generate AUTH_SECRET

Run this command to generate a secure secret:

```bash
openssl rand -base64 32
```

Copy the output and use it for both `AUTH_SECRET` and `NEXTAUTH_SECRET`.

### 4. Backend API Endpoint (Optional)

You may need to create a backend endpoint to handle Google sign-in:

**Endpoint:** `POST /api/v1/auth/google-login`

**Request Body:**

```json
{
  "email": "user@example.com",
  "full_name": "John Doe",
  "google_id": "google-user-id-12345"
}
```

**Response:**

```json
{
  "access_token": "jwt-token-here",
  "refresh_token": "refresh-token-here",
  "user": {
    "id": 123,
    "email": "user@example.com",
    "full_name": "John Doe",
    "role": "user"
  }
}
```

If this endpoint doesn't exist yet, the auth will work with a temporary token (you'll need to implement proper backend sync).

## 🎯 Features Implemented

### Login Page (`/login`)

- ✅ Email/Password login (existing)
- ✅ **Google Sign-In button** with official Google branding
- ✅ Seamless redirect after authentication
- ✅ Error handling for failed sign-ins

### Register Page (`/register`)

- ✅ Traditional registration form (existing)
- ✅ **"Continue with Google" button** at top
- ✅ Automatic account creation for Google users
- ✅ No password needed for Google sign-ins

### Authentication Flow

1. User clicks "Continue with Google"
2. Redirected to Google OAuth consent screen
3. User authorizes the app
4. Redirected back to your app
5. Backend receives Google user info
6. User account created/synced automatically
7. User logged in and redirected to home page

## 🔒 Security Features

- ✅ **Secure token storage** in HTTP-only cookies (via NextAuth)
- ✅ **JWT-based sessions** for fast authentication
- ✅ **OAuth 2.0 standard** implementation
- ✅ **CSRF protection** built into NextAuth
- ✅ **Offline access** with refresh tokens

## 📱 User Experience

### Benefits:

- **Faster sign-up**: No form filling required
- **No password management**: Google handles security
- **Trust**: Users trust Google authentication
- **One-click login**: Returning users sign in instantly

## 🐛 Troubleshooting

### "Invalid redirect URI" Error

- Check that your redirect URIs in Google Console match exactly:
  - `http://localhost:3000/api/auth/callback/google`
- No trailing slashes
- Protocol must match (http vs https)

### "Client ID not found" Error

- Verify `GOOGLE_CLIENT_ID` is set in `.env.local`
- Restart your dev server after adding environment variables

### Google Sign-In Button Not Working

- Check browser console for errors
- Verify API credentials are correct
- Ensure OAuth consent screen is configured

### Backend Sync Issues

- If `/api/v1/auth/google-login` endpoint doesn't exist:
  1. Users will still be authenticated on the frontend
  2. But backend won't know about them
  3. Implement the endpoint to sync Google users with your database

## 🚀 Testing

### Development Testing:

1. Start your dev server: `npm run dev:all`
2. Go to `http://localhost:3000/login`
3. Click "Google" button
4. Sign in with your Google account
5. Should redirect to home page as authenticated user

### Production Testing:

1. Update `NEXTAUTH_URL` to your production domain
2. Add production redirect URI to Google Console
3. Deploy your app
4. Test Google sign-in on live site

## 📝 Next Steps

### Recommended Implementations:

1. **Backend Google Endpoint**

   - Create `/api/v1/auth/google-login` in FastAPI
   - Sync Google users with database
   - Return proper JWT tokens

2. **User Profile Enhancement**

   - Store Google profile picture URL
   - Add "Connected Accounts" section in profile
   - Allow unlinking Google account

3. **Email Verification**

   - Google emails are pre-verified
   - Mark Google users as verified automatically

4. **Role Assignment**

   - Prompt Google users to select role after first sign-in
   - Default to "user" role initially

5. **LinkedIn OAuth** (Future)
   - Similar implementation to Google
   - Add LinkedIn provider to auth.ts
   - Update button in login/register pages

## 🎨 UI Components Updated

### Files Modified:

- ✅ `src/auth.ts` - Added Google provider
- ✅ `src/app/login/page.tsx` - Added Google button
- ✅ `src/app/register/page.tsx` - Added Google button
- 📄 This guide created

### Design Elements:

- Official Google logo (SVG with brand colors)
- Consistent with existing design system
- Responsive button layout
- Hover effects and transitions

## 📞 Support

If you encounter issues:

1. Check the [NextAuth.js Documentation](https://next-auth.js.org/providers/google)
2. Review [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
3. Check browser console for error messages
4. Verify all environment variables are set correctly

---

**Last Updated:** October 19, 2025  
**Status:** ✅ Ready for Testing

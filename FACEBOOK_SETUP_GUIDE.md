# Facebook Login Setup Guide

## Quick Setup Steps

### 1. Create Facebook App

1. Go to **Facebook Developers**: https://developers.facebook.com
2. Click **"My Apps"** → **"Create App"**
3. Choose **"Consumer"** app type
4. Fill in:
   - **App Name**: Your app name (e.g., "Claim Game")
   - **App Contact Email**: Your email
5. Click **"Create App"**

### 2. Add Facebook Login Product

1. In your Facebook App dashboard
2. Click **"Add Product"**
3. Find **"Facebook Login"**
4. Click **"Set Up"**
5. Choose **"Web"** platform

### 3. Get App ID and App Secret

1. Go to **Settings** → **Basic**
2. Copy:
   - **App ID** (e.g., `123456789012345`)
   - **App Secret** (click "Show" to reveal)

### 4. Configure OAuth Redirect URIs

1. In Facebook App → **Settings** → **Basic**
2. Scroll to **"Add Platform"** → Click **"Website"**
3. **Site URL**: `https://YOUR-PROJECT-ID.firebaseapp.com`
4. Click **"Facebook Login"** → **"Settings"**
5. Add to **"Valid OAuth Redirect URIs"**:
   ```
   https://YOUR-PROJECT-ID.firebaseapp.com/__/auth/handler
   http://localhost:3000/__/auth/handler
   ```
   (Replace `YOUR-PROJECT-ID` with your Firebase project ID)

### 5. Configure Firebase Console

1. Go to **Firebase Console**: https://console.firebase.google.com
2. Select your project: **claim**
3. Navigate to **Authentication** → **Sign-in method**
4. Click on **"Facebook"** provider
5. Toggle **"Enable"** switch
6. Paste:
   - **App ID**: From step 3
   - **App Secret**: From step 3
7. Copy the **OAuth redirect URI** shown (e.g., `https://claim-b020c.firebaseapp.com/__/auth/handler`)
8. Go back to Facebook App settings
9. Add the OAuth redirect URI to **"Valid OAuth Redirect URIs"**
10. Click **"Save"** in Firebase Console

### 6. Test Facebook Login

1. Run your app: `npm run dev`
2. Click **"Login with Facebook"** button
3. Should redirect to Facebook login
4. After login, should redirect back and create user in Firestore

---

## Troubleshooting

### Error: "Invalid OAuth Redirect URI"
- Make sure the redirect URI in Facebook matches exactly what Firebase shows
- Include both production and localhost URIs

### Error: "App Not Setup"
- Make sure Facebook Login product is added to your Facebook App
- Make sure Website platform is added

### Error: "App Secret Invalid"
- Double-check App Secret is copied correctly (no spaces)
- Regenerate App Secret if needed in Facebook App Settings

### Redirect Not Working
- Make sure redirect URI is added to Facebook App settings
- Check that the URI matches exactly (including trailing slashes)

---

## Your Firebase Project Info

- **Project ID**: `claim-b020c`
- **OAuth Redirect URI**: `https://claim-b020c.firebaseapp.com/__/auth/handler`
- **Local Dev URI**: `http://localhost:3000/__/auth/handler`

Make sure both URIs are in Facebook App's "Valid OAuth Redirect URIs" list!


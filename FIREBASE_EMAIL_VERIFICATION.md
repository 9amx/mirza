# Firebase Email Verification Setup

## Overview
This application now requires email verification for user accounts. Users must verify their email address before they can sign in to the application.

## How It Works

### 1. User Sign Up Process
- User fills out the signup form
- Account is created in Firebase
- Verification email is automatically sent
- User sees a "Check Your Email" message
- User cannot sign in until email is verified

### 2. Email Verification
- User clicks the verification link in their email
- Link redirects to `/verify-email` page
- Firebase verifies the email address
- User can now sign in to the application

### 3. Sign In Process
- User attempts to sign in
- System checks if email is verified
- If not verified, shows error message with option to resend verification
- If verified, user can sign in successfully

## Firebase Configuration

### 1. Enable Email Verification in Firebase Console
1. Go to Firebase Console
2. Select your project
3. Go to Authentication > Settings > Templates
4. Enable "Email verification" template
5. Customize the email template if needed

### 2. Configure Authorized Domains
1. Go to Authentication > Settings > Authorized domains
2. Add your domain (e.g., `yourdomain.com`)
3. For local development, `localhost` should already be included

### 3. Email Template Customization (Optional)
You can customize the verification email template:
- Go to Authentication > Templates > Email verification
- Customize the subject line and email content
- Include your branding and styling

## Testing Email Verification

### Local Development
1. Use a real email address for testing
2. Check your email inbox (and spam folder)
3. Click the verification link
4. Verify that you can sign in after verification

### Production
1. Ensure your domain is added to authorized domains
2. Test with real email addresses
3. Monitor Firebase Console for any verification issues

## Troubleshooting

### Common Issues
1. **Verification email not received**
   - Check spam folder
   - Verify email address is correct
   - Check Firebase Console for any errors

2. **Verification link not working**
   - Ensure domain is in authorized domains
   - Check if link has expired (default: 1 hour)
   - Try resending verification email

3. **Google Sign-in not working**
   - Google accounts are typically already verified
   - No additional verification needed for Google sign-in

### Error Messages
- "Please verify your email address before signing in" - User needs to verify email
- "Verification email sent!" - Confirmation that email was sent
- "Email verification failed" - Technical issue with verification process

## Security Benefits
- Prevents fake email registrations
- Ensures user owns the email address
- Reduces spam accounts
- Improves user data quality

## User Experience
- Clear messaging about verification requirement
- Easy resend verification option
- Helpful error messages
- Smooth verification flow

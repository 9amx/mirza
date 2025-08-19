# Admin Authentication System

## Overview

The admin panel now has a secure authentication system that requires users to log in before accessing administrative functions.

## Features

- **Secure Login**: Admin users must authenticate before accessing the admin panel
- **Session Management**: Uses secure HTTP-only cookies for session management
- **Automatic Redirects**: Unauthenticated users are redirected to login page
- **Logout Functionality**: Secure logout that clears all session data
- **User Information Display**: Shows logged-in admin user information

## Accessing the Admin Panel

### Method 1: Via Admin Link
1. Click the floating "Admin" button on the main website (bottom-right corner)
2. This will open the admin login page in a new tab
3. Enter your admin credentials
4. You'll be redirected to the admin dashboard

### Method 2: Direct URL Access
1. Navigate to `http://localhost:3000/admin/login`
2. Enter your admin credentials
3. You'll be redirected to the admin dashboard

## Admin Credentials

**Demo Credentials:**
- **Email**: `admin@Mirza Garments.com`
- **Password**: `admin123`

⚠️ **Important**: These are demo credentials for development. In production, you should:
- Use strong, unique passwords
- Implement proper password hashing
- Add two-factor authentication
- Use environment variables for credentials

## Security Features

### Session Management
- Uses HTTP-only cookies for security
- Sessions expire after 24 hours
- Secure cookie settings in production
- Automatic session validation

### Route Protection
- All `/admin/*` routes are protected (except `/admin/login`)
- Middleware automatically redirects unauthenticated users
- Server-side session validation

### API Security
- Admin authentication API with proper error handling
- Secure cookie management
- Input validation and sanitization

## File Structure

```
app/
├── admin/
│   ├── login/
│   │   └── page.tsx          # Admin login page
│   └── page.tsx              # Admin dashboard (protected)
├── api/
│   └── admin/
│       ├── auth/
│       │   └── route.ts      # Authentication API
│       └── user/
│           └── route.ts      # User info API
└── middleware.ts             # Route protection
```

## API Endpoints

### POST /api/admin/auth
Authenticates admin users and sets session cookies.

**Request:**
```json
{
  "email": "admin@Mirza Garments.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "admin-1",
    "name": "Admin User",
    "email": "admin@Mirza Garments.com",
    "role": "admin"
  }
}
```

### DELETE /api/admin/auth
Logs out admin users and clears session cookies.

### GET /api/admin/user
Gets current admin user information.

## Customization

### Adding New Admin Users
1. Update the `ADMIN_CREDENTIALS` object in `/app/api/admin/auth/route.ts`
2. Or implement a proper user management system with database storage

### Changing Session Duration
1. Update the `maxAge` value in the cookie settings (currently 86400 seconds = 24 hours)

### Styling the Login Page
1. Modify `/app/admin/login/page.tsx` to match your brand
2. Update colors, fonts, and layout as needed

## Production Considerations

1. **Environment Variables**: Move credentials to environment variables
2. **Database Integration**: Replace hardcoded credentials with database lookup
3. **Password Hashing**: Implement proper password hashing (bcrypt, Argon2)
4. **Rate Limiting**: Add rate limiting to prevent brute force attacks
5. **HTTPS**: Ensure HTTPS is enabled in production
6. **Session Store**: Consider using Redis or database for session storage
7. **Audit Logging**: Add logging for admin actions
8. **Two-Factor Authentication**: Implement 2FA for additional security

## Troubleshooting

### Login Issues
- Check that the credentials match exactly
- Clear browser cookies and try again
- Check browser console for errors

### Session Issues
- Ensure cookies are enabled in the browser
- Check that the domain and path settings are correct
- Verify that HTTPS is properly configured in production

### API Errors
- Check the server logs for detailed error messages
- Verify that all API routes are properly configured
- Ensure middleware is correctly protecting routes

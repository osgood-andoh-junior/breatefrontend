# Environment Setup Guide

## Overview

The BREATE frontend uses environment variables for configuration, particularly for the API base URL.

## Setup Instructions

### 1. Create Environment Files

Create the following files in the `breate-frontend` directory:

#### `.env.development`
```bash
VITE_API_BASE_URL=http://127.0.0.1:8000/api/v1
```

#### `.env.production`
```bash
VITE_API_BASE_URL=https://your-production-api-domain.com/api/v1
```

#### `.env.example` (Template - already created)
```bash
VITE_API_BASE_URL=http://127.0.0.1:8000/api/v1
```

### 2. Environment Variable Naming

**Important:** Vite requires environment variables to be prefixed with `VITE_` to be exposed to the client-side code.

### 3. Usage in Code

The API base URL is automatically loaded from environment variables in `src/config.js`:

```javascript
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1';
```

### 4. Development

For local development, create `.env.development` or use the default fallback URL.

### 5. Production Deployment

1. Set `VITE_API_BASE_URL` in your production environment
2. Ensure the backend CORS settings allow requests from your production domain
3. Rebuild the application: `npm run build`
4. The production build will use the production API URL

### 6. Verification

To verify environment variables are loaded correctly:

1. Check `import.meta.env.VITE_API_BASE_URL` in browser console (development only)
2. Verify API calls are going to the correct URL
3. Check network tab in browser dev tools

## Notes

- `.env` files are gitignored (except `.env.example`)
- Never commit `.env` files with sensitive data
- Environment variables are embedded at build time, not runtime
- Changes to `.env` files require a rebuild to take effect

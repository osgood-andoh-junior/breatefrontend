# BREATE Frontend - Phase 1 MVP

Frontend application for BREATE, a collaboration-first creative network.

## Overview

This is a React-based frontend that mirrors the existing backend API. It strictly follows the Phase 1 conceptual model:

**Core Loop:**
1. Discover peers
2. Start or join a project
3. Verify what was built (mutual confirmation)
4. Grow a public record of real collaborations

## Architecture

### Project Structure

```
src/
├── components/          # Reusable components (Layout, etc.)
├── contexts/           # React contexts (AuthContext)
├── pages/              # Page components
│   ├── Login.jsx
│   ├── Signup.jsx
│   ├── Discovery.jsx
│   ├── CollaborationHub.jsx
│   ├── ProjectDetail.jsx
│   ├── Profile.jsx
│   ├── Coalitions.jsx
│   ├── CoalitionDetail.jsx
│   └── Verification.jsx
├── services/           # API service layer
│   ├── api.js         # Base API client
│   ├── auth.js
│   ├── users.js
│   ├── discover.js
│   ├── projects.js
│   ├── profile.js
│   ├── collabcircle.js
│   ├── coalitions.js
│   └── metadata.js
├── config.js           # API configuration
└── App.jsx             # Main app with routing
```

### Key Features

- **Authentication**: Login/Signup with JWT tokens
- **Discovery**: Browse users and projects with filters (Archetype, Tier, Region, Coalition)
- **Collaboration Hub**: View and create projects
- **Verification (VCLs)**: Create and view Verified Collaboration Links
- **Profile**: View Collab Circle and Creative Timeline (verified collaborations only)
- **Coalitions**: Browse and view coalition details

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. The app will run on `http://localhost:5173` (or the port Vite assigns)

## API Configuration

The API base URL is configured in `src/config.js`:
- Default: `http://127.0.0.1:8000/api/v1`

Make sure the backend is running on this URL.

## Core Principles

1. **No Hardcoded Data**: All data comes from backend APIs
2. **No Vanity Metrics**: No likes, follows, or popularity indicators
3. **Verification-First**: Only verified collaborations affect reputation
4. **Utilitarian UI**: Sparse, functional, collaboration-focused design
5. **Correctness > Polish**: Focus on functionality over aesthetics

## Phase 1 Limitations

The following features are **NOT** included (by design):

- Follower/following systems
- Like/heart/reaction buttons
- Social feeds beyond basic project listings
- Recommendation engines
- Complex algorithms
- Chat functionality (placeholder only)

## Pages

### Discovery
- Browse users and projects
- Filters: Archetype, Tier, Region, Coalition
- Utilitarian search, not social discovery

### Collaboration Hub
- View all open projects
- Create new projects
- Project details with status management

### Project Detail
- View project information
- Update project status (owner only)
- Delete project (owner only, open projects only)
- Chat placeholder (Phase 1)

### Profile
- View user information
- Collab Circle: Verified collaborations (visible to owner only for now)
- Creative Timeline: Chronological verified collaborations (owner only)

### Verification
- Create new VCL (Verified Collaboration Link)
- View pending and verified collaborations
- Mutual confirmation required for verification

### Coalitions
- Browse coalitions
- View coalition details and members
- Discovery context only (no social feeds)

## Authentication

Authentication uses JWT tokens stored in localStorage. The token is automatically included in API requests via the Authorization header.

Protected routes require authentication and redirect to `/login` if not authenticated.

## API Services

All API services mirror backend endpoints exactly:

- `authAPI`: `/api/v1/auth/*`
- `usersAPI`: `/api/v1/users/*`
- `discoverAPI`: `/api/v1/discover/*`
- `projectsAPI`: `/api/v1/projects/*`
- `profileAPI`: `/api/v1/profile/*`
- `collabCircleAPI`: `/api/v1/collabcircle/*`
- `coalitionsAPI`: `/api/v1/coalitions/*`
- `metadataAPI`: `/api/v1/archetypes/*`, `/api/v1/tiers/*`

## Development

This project uses:
- React 19
- React Router DOM for routing
- Vite for build tooling
- Plain CSS for styling (no CSS-in-JS or frameworks)

## Notes

- The backend may have missing endpoints (e.g., VCL confirmation). The frontend is built to accommodate these when they're added.
- Chat functionality is a placeholder - actual implementation would require backend support.
- Collab Circle is currently only visible to the profile owner due to backend API limitations (`/collabcircle/me` only).

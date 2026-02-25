# GeoMoment — Complete Development Plan

### Temporally-Indexed Geo-Experience Map | Full-Stack Web Application

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Core Innovation — What Makes This Unique](#2-core-innovation)
3. [Requirements Analysis](#3-requirements-analysis)
4. [Complete Tech Stack](#4-complete-tech-stack)
5. [Application Architecture Overview](#5-application-architecture-overview)
6. [Complete Project Structure](#6-complete-project-structure)
7. [Database Design](#7-database-design)
8. [Backend API Design](#8-backend-api-design)
9. [Frontend Architecture & Logic](#9-frontend-architecture--logic)
10. [Google Maps Integration Strategy](#10-google-maps-integration-strategy)
11. [Core Feature Logic Explained](#11-core-feature-logic-explained)
12. [Authentication & Security](#12-authentication--security)
13. [Performance & Optimization](#13-performance--optimization)
14. [Environment Configuration](#14-environment-configuration)
15. [Testing Strategy](#15-testing-strategy)
16. [Deployment Plan](#16-deployment-plan)
17. [Third-Party Services & Accounts Required](#17-third-party-services--accounts-required)
18. [Error Handling Strategy](#18-error-handling-strategy)
19. [Development Build Order](#19-development-build-order)
20. [Accessibility & Responsiveness](#20-accessibility--responsiveness)

---

## 1. Project Overview

**Problem Statement:** Urban environments feel different at different times, but no existing tool captures subjective, crowd-sourced experiential data indexed by time-of-day at arbitrary geographic coordinates. People have no way to know what a specific sidewalk, park bench, or underpass _feels like_ at 11pm on a Friday before they actually go there.

**GeoMoment** is a crowd-sourced, time-indexed experience map. It allows users to tag how any geographic location **feels** at a specific time — safe, unsafe, lively, calm, crowded, or deserted — at any coordinate on Earth (not just at registered businesses). The system aggregates these tags into a predictive heatmap overlay on Google Maps, filtered by day of week and time of day.

The core value: Google Maps tells you **what is** at a location. GeoMoment tells you **what it feels like to be there**, and more importantly, **when it feels that way**.

**Who uses this:**

- Solo travelers and women traveling alone at night
- Tourists researching a neighborhood before visiting
- Night-shift workers (nurses, delivery riders, security staff)
- Parents deciding where to let kids go
- People relocating who want to feel out a new neighborhood across different times

**What it does that nothing else does:**

- Tags are placed at **any latitude/longitude**, not only at business listings
- Each tag is permanently bound to a **day-of-week and hour-slot**, not just a raw timestamp
- The system builds a **predictive time-slot score** for each geographic cell from accumulated tags
- Users can query **prospectively**: "Show me what this area is like on Friday nights"

---

## 2. Core Innovation

### The Patentable Mechanism

**"Temporally-Indexed Geo-Experience Tags at Non-Business Geographic Points with Predictive Time-Slot Scoring"**

The novel combination of three elements:

1. **Non-business coordinate tagging** — Any lat/lng anywhere on Earth can receive a tag, not just Places API results
2. **Time-slot binding** — Every tag is permanently bound to `{ dayOfWeek: 0-6, hourSlot: 0-23 }` at the moment of submission, forming a time pattern rather than a timeline (0 = Sunday, 1 = Monday, …, 6 = Saturday — JavaScript `Date.getDay()` convention)
3. **Prospective time-query** — Users can select a future day and time and see aggregated historical experience data for any area, before they arrive

No existing product combines all three. Google Maps Popular Times only covers registered businesses. Waze only covers road-specific hazards. CrimeGrade uses police reports, not lived experience. Citizen only logs incidents. None allow tagging an empty sidewalk, a park bench, an underpass, or a bus stop with how it actually feels — and none let you query that feeling by future time slot.

---

## 3. Requirements Analysis

### Functional Requirements (FR)

| ID    | Requirement                                                                                                                      |
| ----- | -------------------------------------------------------------------------------------------------------------------------------- |
| FR-01 | Users can register with name, email, and password                                                                                |
| FR-02 | Users can login with email and password, receiving a JWT access token                                                            |
| FR-03 | Authenticated users can tag any lat/lng coordinate with one of 6 experience types: safe, unsafe, lively, calm, crowded, deserted |
| FR-04 | Each tag is permanently bound to the day-of-week (0–6) and hour-slot (0–23) of the moment of submission                          |
| FR-05 | Tags include an optional free-text note (max 80 characters)                                                                      |
| FR-06 | The system aggregates tags into a heatmap overlay on Google Maps, grouped by geohash cell                                        |
| FR-07 | Users can filter the heatmap by day-of-week and time-of-day to view prospective conditions                                       |
| FR-08 | Users can view a scrollable feed of recent individual moments in the visible map area                                            |
| FR-09 | Users can search a specific location and view its time-slot score profile                                                        |
| FR-10 | Users can compare the vibe score of two routes for a given time slot                                                             |
| FR-11 | Authenticated users can view, edit (note only), and delete their own submitted moments                                           |
| FR-12 | Unauthenticated users can view the heatmap and individual moments read-only                                                      |
| FR-13 | Clicking the map while unauthenticated opens the login/register modal instead of the tag modal                                   |

### Non-Functional Requirements (NFR)

| ID     | Requirement                                                                              |
| ------ | ---------------------------------------------------------------------------------------- |
| NFR-01 | Heatmap API response ≤ 500ms for a 50km × 50km bounding box with proper indexes          |
| NFR-02 | Frontend initial load ≤ 3 seconds on a 4G mobile connection                              |
| NFR-03 | System handles 100 concurrent users without degradation                                  |
| NFR-04 | All user passwords stored using bcrypt with 12 salt rounds                               |
| NFR-05 | API rate-limited per endpoint: auth 5/15min, moment submission 10/hr, general 100/15min  |
| NFR-06 | Zero PII leakage — no password hash or private email returned in any public API response |
| NFR-07 | MongoDB indexes ensure no full collection scans on any primary query path                |
| NFR-08 | All user-generated text content (notes) is sanitized and escaped to prevent XSS          |
| NFR-09 | Frontend code-split by route — only the active page's JS bundle loads                    |
| NFR-10 | Application fully responsive: usable on mobile (≥ 375px), tablet, and desktop viewports  |

---

## 4. Complete Tech Stack

### Frontend

| Technology                | Version | Role                                                                                        |
| ------------------------- | ------- | ------------------------------------------------------------------------------------------- |
| React                     | 18.x    | UI framework                                                                                |
| Vite                      | 5.x     | Build tool and dev server                                                                   |
| JavaScript (ES2023)       | —       | Language (no TypeScript for simplicity)                                                     |
| Tailwind CSS              | 3.x     | Utility-first styling (3.x chosen for ecosystem stability; 4.x is available)                |
| @vis.gl/react-google-maps | 1.7.x   | Official React wrapper for Google Maps JS API (Google-endorsed)                             |
| deck.gl                   | 9.x     | WebGL-powered heatmap layer (replaces deprecated Google Heatmap Layer, deprecated May 2025) |
| @deck.gl/google-maps      | 9.x     | deck.gl adapter for Google Maps overlay rendering                                           |
| Zustand                   | 4.x     | Lightweight global state management                                                         |
| React Router DOM          | 6.x     | Client-side routing                                                                         |
| Axios                     | 1.x     | HTTP client for API calls                                                                   |
| React Hook Form           | 7.x     | Form state management (registration/login)                                                  |
| date-fns                  | 3.x     | Date and time utilities                                                                     |
| notistack                 | 3.x     | Snackbar/toast notification system                                                          |

### Backend

| Technology         | Version  | Role                                         |
| ------------------ | -------- | -------------------------------------------- |
| Node.js            | 20.x LTS | Server runtime                               |
| Express            | 4.x      | Web framework                                |
| MongoDB            | 7.x      | Database                                     |
| Mongoose           | 8.x      | ODM (schema, validation, geospatial helpers) |
| jsonwebtoken       | 9.x      | JWT creation and verification                |
| bcryptjs           | 2.x      | Password hashing                             |
| express-validator  | 7.x      | Request input validation                     |
| express-rate-limit | 7.x      | API rate limiting                            |
| helmet             | 7.x      | HTTP security headers                        |
| cors               | 2.x      | Cross-origin resource sharing                |
| dotenv             | 16.x     | Environment variable loading                 |
| morgan             | 1.x      | HTTP request logging (development)           |
| winston            | 3.x      | Structured application logging (production)  |
| compression        | 1.x      | Gzip response compression                    |

### Database

| Technology              | Role                                                               |
| ----------------------- | ------------------------------------------------------------------ |
| MongoDB Atlas           | Managed cloud MongoDB with built-in 2dsphere geospatial indexing   |
| Mongoose 2dsphere index | Native geospatial queries: $geoWithin, $geoNear, $near             |
| ngeohash (npm)          | Geohash computation for grid cell bucketing in heatmap aggregation |

### DevOps & Tooling

| Tool                | Role                                        |
| ------------------- | ------------------------------------------- |
| ESLint + Prettier   | Code quality and formatting                 |
| Vitest              | Frontend + Backend unit/integration testing |
| Supertest           | Backend API integration testing             |
| Husky + lint-staged | Pre-commit hooks to enforce quality         |
| Vercel              | Frontend deployment                         |
| Railway or Render   | Backend deployment                          |
| MongoDB Atlas       | Database hosting                            |
| GitHub Actions      | CI/CD pipeline                              |

---

## 5. Application Architecture Overview

The application follows a clean **Client → REST API → MongoDB** architecture. There is no real-time websocket needed — the map updates on each filter change by fetching fresh aggregated data from the API.

```
[React Frontend on Vercel]
         |
         | HTTPS REST API calls (Axios)
         |
[Express Backend on Railway/Render]
         |
         | Mongoose ODM
         |
[MongoDB Atlas]
    - moments collection (geospatial 2dsphere index)
    - users collection
```

**State flow in the frontend:**

The Zustand store holds the global map state: current time filter (dayOfWeek, hourSlot), current map bounds (bounding box), heatmap cell data from the last API response, authenticated user details, and the modal state for tag submission. Every time the time filter or map viewport changes, a debounced API call fetches fresh heatmap data for the visible area.

**Data flow for heatmap rendering:**

1. User pans or zooms the map → map bounds change → Zustand updates `mapBounds`
2. A `useEffect` watching `{ mapBounds, dayOfWeek, hourSlot }` fires a debounced GET request
3. Backend receives `?swLat=&swLng=&neLat=&neLng=&day=&hour=` parameters
4. MongoDB aggregates moments within that bounding box for that time slot, groups by geohash cell, computes dominant tag per cell
5. Response is an array of `{ geohashCell, lat, lng, dominantTag, score, count }` objects
6. Frontend uses deck.gl PolygonLayer to draw colored polygons over the map for each cell

**Error and fallback paths:**

- **MongoDB unreachable**: Backend returns `503 Service Unavailable` with `Retry-After` header. Frontend shows a "Service temporarily unavailable" banner with retry button.
- **Google Maps API fails to load**: Frontend catches the `APIProvider` error and renders a fallback "Map unavailable — please check your connection" message instead of a blank screen.
- **JWT expired mid-session**: Axios response interceptor catches any `401 Unauthorized` response, clears the auth store, and redirects to `/` with the auth modal open.
- **Heatmap API returns empty data**: Frontend renders the base map with no overlay and a subtle "No data for this area and time" indicator.
- **Rate limit exceeded**: Backend returns `429 Too Many Requests`. Axios interceptor shows a toast: "Too many requests — please wait a moment."

---

## 6. Complete Project Structure

### Root Layout

```
geomoment/
├── client/                    ← React + Vite frontend
├── server/                    ← Node + Express backend
├── .github/
│   └── workflows/
│       └── ci.yml             ← GitHub Actions CI pipeline
├── .gitignore
└── README.md
```

---

### Frontend Structure (`client/`)

```
client/
├── public/
│   ├── favicon.ico
│   └── og-image.png           ← Open Graph image for social sharing
│
├── src/
│   ├── main.jsx               ← Entry point: mounts React app to #root
│   ├── App.jsx                ← Root component: sets up Router and global providers
│   │
│   ├── assets/
│   │   └── logo.svg           ← App logo SVG
│   │
│   ├── components/            ← Reusable, dumb UI components (no API calls here)
│   │   ├── layout/
│   │   │   ├── Navbar.jsx              ← Top navigation bar with logo, login/logout, user avatar
│   │   │   └── PageWrapper.jsx         ← Centered container with consistent max-width
│   │   │
│   │   ├── map/
│   │   │   ├── MapCanvas.jsx           ← Main map component: renders APIProvider + Map + deck.gl overlay
│   │   │   ├── TagMarker.jsx           ← Individual AdvancedMarker rendered per submitted moment (confirmation)
│   │   │   ├── HeatmapOverlay.jsx      ← deck.gl GoogleMapsOverlay with PolygonLayer for color cells
│   │   │   ├── TagSubmitModal.jsx      ← Modal that appears when user clicks map: shows 6 tag options + note
│   │   │   └── RouteScorePanel.jsx     ← Side panel showing vibe scores for two compared routes
│   │   │
│   │   ├── filters/
│   │   │   ├── TimeFilterBar.jsx       ← Day-of-week selector (Mon–Sun) + hour slot selector (Morning/Afternoon/Evening/Night)
│   │   │   └── TagLegend.jsx          ← Color legend showing what each heatmap color means
│   │   │
│   │   ├── auth/
│   │   │   ├── LoginForm.jsx           ← Login form using React Hook Form
│   │   │   ├── RegisterForm.jsx        ← Registration form using React Hook Form
│   │   │   └── AuthModal.jsx           ← Modal container for login/register forms with tab switcher
│   │   │
│   │   ├── moments/
│   │   │   ├── MomentCard.jsx          ← Single moment display card (tag color, note, time label)
│   │   │   └── MomentFeed.jsx          ← Scrollable list of recent moments in visible map area
│   │   │
│   │   └── ui/
│   │       ├── Button.jsx              ← Reusable styled button (variants: primary, danger, ghost)
│   │       ├── Input.jsx               ← Reusable styled text input
│   │       ├── Modal.jsx               ← Generic backdrop + centered modal shell
│   │       ├── Spinner.jsx             ← Loading spinner component
│   │       ├── Badge.jsx               ← Small colored badge for tag type display
│   │       └── ErrorMessage.jsx        ← Inline error display for forms and API failures
│   │
│   ├── pages/                 ← Route-level page components
│   │   ├── HomePage.jsx               ← Main map view: renders MapCanvas, TimeFilterBar, TagLegend
│   │   ├── ExplorePage.jsx            ← Search a location + view its time-slot score summary
│   │   ├── RouteComparePage.jsx       ← Enter two routes, compare vibe scores by time slot
│   │   ├── MyMomentsPage.jsx          ← Authenticated user's submitted moments with edit/delete
│   │   ├── LoginPage.jsx              ← Standalone login/register page (fallback for non-modal flow)
│   │   └── NotFoundPage.jsx           ← 404 page
│   │
│   ├── hooks/                 ← Custom React hooks (logic extraction)
│   │   ├── useMapBounds.js            ← Listens to Google Maps viewport changes, returns current bounding box
│   │   ├── useHeatmapData.js          ← Fetches heatmap cell data when bounds or time filter changes (debounced)
│   │   ├── useTagSubmit.js            ← Handles tag submission flow (auth check, API call, optimistic update)
│   │   ├── useRouteScore.js           ← Fetches vibe score along a decoded polyline for route comparison
│   │   ├── useAuth.js                 ← Reads auth state from Zustand store, exposes login/logout/register helpers
│   │   └── useGeolocation.js          ← Browser geolocation API wrapper: returns user's current lat/lng
│   │
│   ├── store/                 ← Zustand global state
│   │   ├── authStore.js               ← user, accessToken, isAuthenticated, login(), logout() actions
│   │   ├── mapStore.js                ← mapBounds, clickedCoords, selectedTimeFilter, heatmapCells
│   │   └── uiStore.js                 ← modalOpen, activeModal ('login' | 'tagSubmit'), notifications
│   │
│   ├── services/              ← Axios API call functions (all HTTP calls live here only)
│   │   ├── api.js                     ← Axios instance with baseURL and JWT interceptor (auto-attaches token)
│   │   ├── authService.js             ← login(email, pass), register(name, email, pass)
│   │   ├── momentService.js           ← submitMoment(data), getHeatmap(params), getMomentsInBounds(params)
│   │   ├── routeService.js            ← getRouteScore(polylinePoints, day, hour)
│   │   └── userService.js             ← getMyMoments(), deleteMoment(id), updateMoment(id, data)
│   │
│   ├── utils/                 ← Pure utility functions (no side effects)
│   │   ├── geohash.js                 ← Wrapper for ngeohash: encodeCell(lat, lng, precision), cellToPolygon(hash)
│   │   ├── timeSlots.js               ← Constants and helpers: DAYS_OF_WEEK, HOUR_SLOTS, getSlotLabel(hour)
│   │   ├── tagConfig.js               ← TAG_TYPES array: { id, label, emoji, color, bgColor, description }
│   │   ├── scoreColor.js              ← Maps a dominantTag and score to a hex color for PolygonLayer fill
│   │   ├── formatters.js              ← formatTimeAgo(date), formatDaySlot(day, hour), truncateNote(text)
│   │   └── validators.js              ← Frontend validation helpers used in React Hook Form rules
│   │
│   └── styles/
│       └── index.css                  ← Tailwind base directives + any global CSS overrides
│
├── index.html                 ← Vite HTML entry point
├── vite.config.js             ← Vite config: base path, proxy for local dev API, build output
├── tailwind.config.js         ← Tailwind content paths, theme extension (custom colors for tags)
├── postcss.config.js          ← PostCSS config for Tailwind
├── .eslintrc.cjs              ← ESLint rules
├── .prettierrc                ← Prettier formatting config
└── package.json
```

---

### Backend Structure (`server/`)

```
server/
├── src/
│   ├── index.js               ← Server entry: loads env, connects to MongoDB, starts Express server
│   │
│   ├── app.js                 ← Express app setup: middleware stack, route mounting, error handler
│   │
│   ├── config/
│   │   ├── db.js                      ← MongoDB Atlas connection via Mongoose (with retry logic)
│   │   └── constants.js               ← App constants: JWT_EXPIRY, GEOHASH_PRECISION, MAX_BOUNDS_AREA, TAG_TYPES
│   │
│   ├── models/                ← Mongoose schemas
│   │   ├── User.js                    ← User schema: name, email (unique), password hash, createdAt, momentCount
│   │   └── Moment.js                  ← Moment schema: location (GeoJSON Point), tag, dayOfWeek, hourSlot,
│   │                                     geohashCell, note, userId ref, createdAt, updatedAt
│   │
│   ├── routes/                ← Express route definitions (thin — delegate to controllers)
│   │   ├── auth.routes.js             ← POST /register, POST /login
│   │   ├── moment.routes.js           ← GET /heatmap, GET /bounds, POST /, DELETE /:id, PATCH /:id
│   │   ├── user.routes.js             ← GET /me/moments, GET /me/profile
│   │   └── route.routes.js            ← POST /score (route vibe score endpoint)
│   │
│   ├── controllers/           ← Business logic per route group
│   │   ├── auth.controller.js         ← register(), login()
│   │   ├── moment.controller.js       ← getHeatmap(), getMomentsInBounds(), submitMoment(),
│   │   │                                 deleteMoment(), updateMoment()
│   │   ├── user.controller.js         ← getMyMoments(), getProfile()
│   │   └── route.controller.js        ← getRouteVibeScore()
│   │
│   ├── middleware/            ← Express middleware functions
│   │   ├── auth.middleware.js         ← verifyToken(): extracts + validates JWT, attaches req.user
│   │   ├── validate.middleware.js     ← runValidation(): runs express-validator checks, returns 422 on failure
│   │   ├── rateLimit.middleware.js    ← Rate limiters: strictLimiter (auth routes), generalLimiter (other)
│   │   └── errorHandler.middleware.js ← Global error handler: catches all thrown errors, returns JSON
│   │
│   ├── validators/            ← express-validator rule sets per route
│   │   ├── auth.validators.js         ← registerRules, loginRules
│   │   └── moment.validators.js       ← submitMomentRules, heatmapQueryRules, boundsQueryRules
│   │
│   └── utils/
│       ├── geohash.js                 ← Server-side geohash encode/decode using ngeohash (same as client)
│       ├── timeSlot.js                ← extractDayAndHour(timestamp): converts Date to { dayOfWeek, hourSlot }
│       ├── boundsValidator.js         ← validateBoundsArea(swLat,swLng,neLat,neLng): rejects too-large queries
│       └── apiResponse.js             ← Standardized response helpers: success(res, data), error(res, msg, code)
│
├── tests/
│   ├── auth.test.js                   ← Integration tests for auth routes
│   ├── moment.test.js                 ← Integration tests for moment routes (heatmap, submit, bounds)
│   └── route.test.js                  ← Integration tests for route score endpoint
│
├── .env.example               ← Environment variable template (committed to repo without values)
├── .env                       ← Actual environment values (never committed)
├── .eslintrc.cjs
├── .prettierrc
└── package.json
```

---

## 7. Database Design

### Collection: `users`

| Field         | Type     | Details                                                                  |
| ------------- | -------- | ------------------------------------------------------------------------ |
| `_id`         | ObjectId | Auto-generated                                                           |
| `name`        | String   | Required, 2–50 chars                                                     |
| `email`       | String   | Required, unique, lowercased, indexed                                    |
| `password`    | String   | bcrypt hash of original password                                         |
| `momentCount` | Number   | Incremented on each moment submission (denormalized for profile display) |
| `createdAt`   | Date     | Auto-set via Mongoose timestamps                                         |
| `updatedAt`   | Date     | Auto-set via Mongoose timestamps                                         |

**Indexes on users:** `email` unique index.

---

### Collection: `moments`

This is the core collection. Every single tag submission lives here.

| Field         | Type                 | Details                                                                                                           |
| ------------- | -------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `_id`         | ObjectId             | Auto-generated                                                                                                    |
| `location`    | GeoJSON Point        | `{ type: "Point", coordinates: [lng, lat] }` — note: GeoJSON is [lng, lat] order                                  |
| `tag`         | String (enum)        | One of: `safe`, `unsafe`, `lively`, `calm`, `crowded`, `deserted`                                                 |
| `dayOfWeek`   | Number               | 0 = Sunday, 1 = Monday, … 6 = Saturday (extracted from submission time)                                           |
| `hourSlot`    | Number               | 0–23 (hour of day extracted from submission time, in user's local time via frontend)                              |
| `geohashCell` | String               | Geohash string at precision 7 (approx 76m × 38m cell). Pre-computed at submit time. Used for aggregation grouping |
| `note`        | String               | Optional, max 80 chars, free text                                                                                 |
| `userId`      | ObjectId ref → users | Who submitted it                                                                                                  |
| `createdAt`   | Date                 | Exact submission time (auto-set via Mongoose timestamps)                                                          |
| `updatedAt`   | Date                 | Auto-set via Mongoose timestamps (tracks note edits via PATCH)                                                    |

**Indexes on moments:**

- `location`: `2dsphere` index — enables all geospatial queries ($geoWithin, $geoNear)
- Compound index: `{ geohashCell: 1, dayOfWeek: 1, hourSlot: 1 }` — makes heatmap aggregation fast
- `userId` index — for fetching a user's own moments quickly
- `createdAt` index — for recent feed queries

**Why geohash precision 7?** At precision 7, each cell is roughly 76m × 38m. This is large enough that many tag submissions cluster into the same cell (making aggregation meaningful) but small enough that individual blocks and streets have their own cells. Precision 6 (610m × 610m) is too coarse; precision 8 (19m × 19m) is too fine for crowd-sourced data density.

**Deletion strategy — hard delete (conscious decision):** `DELETE /:id` permanently removes the moment from the database. A soft delete (`isActive: false`) was considered but excluded to keep the schema simple and avoid filtering overhead on every query. For abuse cases, server-side logging captures who deleted what and when. If moderation needs grow, soft delete can be added later without schema migration (just add an `isActive` field with default `true` and filter in queries).

---

### Data Flow: Submission to Storage

When a user submits a tag:

1. Frontend sends `{ lat, lng, tag, note, dayOfWeek, hourSlot }` — dayOfWeek and hourSlot are computed on the frontend from the current local time using `date-fns` before sending
2. Backend validates the payload with express-validator
3. Backend computes `geohashCell` from `lat` and `lng` using `ngeohash.encode(lat, lng, 7)`
4. Backend stores the GeoJSON location as `[lng, lat]` (GeoJSON spec: longitude first)
5. User's `momentCount` is incremented atomically

---

## 8. Backend API Design

All responses follow a consistent structure:

- Success: `{ success: true, data: {...} }`
- Error: `{ success: false, message: "...", errors: [...] }`

All protected routes require `Authorization: Bearer <token>` header.

---

### Auth Routes — `/api/auth`

**POST `/api/auth/register`**

- Body: `{ name, email, password }`
- Creates user, returns `{ user: { id, name, email }, accessToken }`
- Validation: email format, password min 8 chars, name length

**POST `/api/auth/login`**

- Body: `{ email, password }`
- Verifies credentials, returns `{ user: { id, name, email }, accessToken }`

**POST `/api/auth/logout`** — Client-Side Only

- No server endpoint needed. Logout is purely a client action: clear the JWT from localStorage, reset the auth Zustand store, and redirect to `/`.
- **Why no server endpoint:** With stateless JWT and no refresh tokens, there is nothing to invalidate server-side. A no-op POST endpoint would be misleading. If token blacklisting is ever needed (via Redis), a server-side logout can be added at that point.

---

### Moment Routes — `/api/moments`

**GET `/api/moments/heatmap`** — Public

- Query params: `swLat`, `swLng`, `neLat`, `neLng`, `day` (0–6), `hour` (0–23)
- Logic: MongoDB aggregation pipeline
  1. `$geoWithin` to filter by bounding box
  2. `$match` on `dayOfWeek` and `hourSlot`
  3. `$group` by `geohashCell` — count each tag type per cell
  4. `$project` to compute `dominantTag` (the tag with the highest count), `score` (dominant tag count / total count as a confidence 0–1), `totalCount`, `centerLat`, `centerLng`
- Response: `{ data: [ { geohashCell, centerLat, centerLng, dominantTag, score, totalCount }, ... ] }`
- Bounds area validation prevents massive queries (max ~50km × 50km box)
- Rate limited: 30 requests/minute per IP

**GET `/api/moments/bounds`** — Public

- Query params: `swLat`, `swLng`, `neLat`, `neLng`, `limit` (default 50, max 100)
- Returns individual recent moments in the bounding box, sorted by createdAt desc
- Used for the side feed panel showing individual tagged moments
- Response: `{ data: [ { tag, note, dayOfWeek, hourSlot, lat, lng, createdAt }, ... ] }`

**POST `/api/moments`** — Protected

- Body: `{ lat, lng, tag, note (optional), dayOfWeek, hourSlot }`
- Creates moment, returns created moment object
- Rate limited: 10 submissions per hour per user (prevents spam)

**DELETE `/api/moments/:id`** — Protected

- Only allowed if `moment.userId === req.user.id`
- Returns `{ success: true }`

**PATCH `/api/moments/:id`** — Protected

- Body: `{ note }` — only the note can be updated, not the tag or location (preserves data integrity)
- Only allowed if `moment.userId === req.user.id`

---

### User Routes — `/api/users`

**GET `/api/users/me/moments`** — Protected

- Returns paginated list of the authenticated user's submitted moments
- Query params: `page` (default 1), `limit` (default 20)
- Response includes total count and pagination metadata

**GET `/api/users/me/profile`** — Protected

- Returns `{ name, email, momentCount, createdAt }`

---

### Route Score — `/api/route`

**POST `/api/route/score`** — Public

- Body: `{ points: [ {lat, lng}, ... ], day, hour }` — array of lat/lng waypoints along a route (decoded from Google's encoded polyline on the frontend)
- Logic: For each point in the route, fetches the geohash cell that contains it and retrieves that cell's score for the given day/hour from moments collection. Averages the scores. Returns an overall route vibe score and per-segment breakdown.
- Used by the Route Compare page to show two route vibe scores side by side
- Points array max 100 items (prevents abuse)
- Rate limited: 20 requests per 15 minutes per IP

---

## 9. Frontend Architecture & Logic

### Routing Structure

The React Router setup in `App.jsx` defines:

- `/` → `HomePage` (the main map experience)
- `/explore` → `ExplorePage` (search a location, see its time-slot profile)
- `/compare` → `RouteComparePage` (route vibe comparison)
- `/my-moments` → `MyMomentsPage` (authenticated, redirects to `/` if not logged in)
- `/login` → `LoginPage` (fallback standalone page)
- `*` → `NotFoundPage`

Route guard logic: `MyMomentsPage` checks `isAuthenticated` from the auth store. If false, redirects to `/` and opens the auth modal.

---

### Zustand Store Design

**`authStore.js`** holds:

- `user`: `{ id, name, email }` or null
- `accessToken`: JWT string or null
- `isAuthenticated`: boolean derived from user/token
- `login(userData, token)` action: sets user + token + writes token to localStorage
- `logout()` action: clears user, token, localStorage
- On app mount (`App.jsx`), reads token from localStorage and rehydrates the store

**`mapStore.js`** holds:

- `mapBounds`: `{ sw: {lat, lng}, ne: {lat, lng} }` — updated on every map viewport change
- `clickedCoords`: `{ lat, lng }` or null — set when user clicks anywhere on the map
- `selectedDay`: 0–6 (default: today's day of week)
- `selectedHour`: 0–23 (default: current hour)
- `heatmapCells`: array of heatmap cell objects from the last API response
- `recentMoments`: array of individual moments for the side feed
- `isHeatmapLoading`: boolean

**`uiStore.js`** holds:

- `isAuthModalOpen`: boolean
- `isTagSubmitModalOpen`: boolean
- `activeAuthTab`: `'login'` or `'register'`

---

### Key Custom Hooks Logic

**`useMapBounds.js`**
Uses `useMap()` from `@vis.gl/react-google-maps` to get the map instance. Attaches a listener to the `bounds_changed` event on the map. On change, extracts southwest and northeast lat/lng from `map.getBounds()` and updates Zustand `mapStore.setMapBounds()`.

**`useHeatmapData.js`**
Watches `{ mapBounds, selectedDay, selectedHour }` from the map store. When any of these change, it sets a 400ms debounce timer then calls `momentService.getHeatmap()` with the current bounds and time filter. On response, it updates `mapStore.setHeatmapCells()`. The debounce prevents firing a new API call on every pixel of a map drag.

**`useTagSubmit.js`**
Called when user picks a tag in `TagSubmitModal`. Checks `isAuthenticated` from auth store — if false, closes the tag modal and opens the auth modal. If authenticated, calls `momentService.submitMoment()`. On success, adds the new moment to the beginning of `recentMoments` in the store (optimistic local update for instant feedback) and shows a success toast via notistack.

**`useRouteScore.js`**
Used in `RouteComparePage`. Accepts a Google Maps Directions API response. Extracts the encoded polyline from the route, decodes it into lat/lng points using Google's geometry library (`google.maps.geometry.encoding.decodePath`), then sends those points to `/api/route/score`. Returns the score object for display.

---

### Component Responsibilities

**`MapCanvas.jsx`** — The central component. Renders `<APIProvider>` wrapping everything. Inside renders `<Map>` with custom map ID for styling. Inside the `<Map>` renders `<HeatmapOverlay>` for the deck.gl layer and `<TagMarker>` for recent individual moments. Also has the map click handler that sets `clickedCoords` in the store and opens the `TagSubmitModal`.

**`HeatmapOverlay.jsx`** — Reads `heatmapCells` from map store. Constructs a `GoogleMapsOverlay` (from `@deck.gl/google-maps`) with a single `PolygonLayer`. Each cell's geohash is converted to a polygon boundary (4 corners) using the `geohash.js` util. The polygon fill color comes from `scoreColor.js` which maps `{ dominantTag, score }` to a hex color with appropriate opacity.

**`TagSubmitModal.jsx`** — Opens when `clickedCoords` is set and user is interacting. Shows the 6 tag buttons in a grid, each with its emoji and color from `tagConfig.js`. Has a small optional note textarea (max 80 chars). Submit button calls `useTagSubmit`. Cancel clears `clickedCoords` and closes.

**`TimeFilterBar.jsx`** — Renders two row groups: day chips (Mon–Sun, with today highlighted by default) and time slot chips (Morning 6am–12pm, Afternoon 12pm–6pm, Evening 6pm–10pm, Night 10pm–6am). Clicking any chip updates `mapStore.selectedDay` and `mapStore.selectedHour` (uses representative hour for each slot, e.g. Evening = 20). This triggers `useHeatmapData` to re-fetch.

**`RouteScorePanel.jsx`** — Split into two columns. Each column has a Google Places Autocomplete input for the route start/end. On submit, calls the Directions API to get a route, then calls `useRouteScore` for each. Displays an overall score badge and a color bar visualization per route for easy comparison.

---

## 10. Google Maps Integration Strategy

### Library Choice

Use `@vis.gl/react-google-maps` v1.7.x. This is the officially Google-endorsed React wrapper, built and maintained by the vis.gl / OpenJS Foundation team. It provides `APIProvider`, `Map`, `AdvancedMarker`, `InfoWindow`, and the `useMapsLibrary` hook for loading optional libraries (Places, Directions, Geometry).

### Map Initialization

The `APIProvider` is placed at the root of the app in `App.jsx`, not inside any individual page. This means the Maps JS API is loaded once for the entire session, not re-loaded on route changes. The `apiKey` comes from `import.meta.env.VITE_GOOGLE_MAPS_API_KEY`.

A custom Map ID is configured in Google Cloud Console for styled maps (dark theme or minimal style that makes colored heatmap cells highly visible). The Map ID is passed as `mapId` to the `<Map>` component.

### Heatmap Rendering — deck.gl (NOT deprecated Google HeatmapLayer)

Google deprecated the native `HeatmapLayer` in May 2025, removed in May 2026. The replacement is `deck.gl`. This project uses:

- `@deck.gl/google-maps` which provides `GoogleMapsOverlay` — a clean bridge that renders deck.gl layers on top of a Google Map without conflicts
- `deck.gl` `PolygonLayer` to draw each geohash cell as a colored rectangle

Why PolygonLayer over deck.gl's own HeatmapLayer: The PolygonLayer approach gives precise, crisp cell boundaries aligned to the geohash grid, which communicates discrete safety zones clearly. The deck.gl HeatmapLayer produces a blurry gradient which is visually beautiful but less precise for a safety-oriented use case. Users need to clearly see cell boundaries.

### Places Autocomplete

Uses `useMapsLibrary('places')` hook to load the Places library, then uses `google.maps.places.Autocomplete` on search inputs. This is used in `ExplorePage` for searching a location and in `RouteComparePage` for entering route start/end points.

### Directions API for Route Compare

Uses `useMapsLibrary('routes')` to access `google.maps.DirectionsService`. On route submission, `directionsService.route()` is called to get the encoded polyline. The Geometry library (`useMapsLibrary('geometry')`) is used to decode the polyline into lat/lng points for sending to the backend.

### Google Maps API Key Restrictions

In Google Cloud Console, the key must be restricted to:

- HTTP Referrers: only your production domain and localhost
- Enabled APIs: Maps JavaScript API, Places API (New), Directions API, Geometry Library

---

## 11. Core Feature Logic Explained

### The Geohash Grid System

A geohash converts any latitude/longitude into a short string representing a rectangular cell on Earth. The `ngeohash` npm package handles encoding and decoding.

At precision 7, the cell for New Delhi city center would be something like `ttnfu7b`. Two nearby points on the same block will share the same geohash cell string. This is what powers grouping — all tag submissions within the same 76m × 38m cell, on the same day and hour, are aggregated together.

The `geohash.js` utility in both `client/src/utils/` and `server/src/utils/` wraps `ngeohash.encode(lat, lng, 7)` for encoding and `ngeohash.decode_bbox(hash)` for converting a hash back to its 4 bounding corners (needed to draw the polygon on the map).

### Heatmap Aggregation Pipeline (MongoDB)

The heatmap query aggregates moments using this logic:

1. Filter by bounding box using `$geoWithin` on the `location` field (uses 2dsphere index)
2. Filter by `dayOfWeek` and `hourSlot` using `$match`
3. Group by `geohashCell` using `$group` — counts each of the 6 tag types per cell
4. Compute `dominantTag`: the tag with the highest count becomes the cell's representative tag
5. Compute `score`: `dominantTagCount / totalCount` — this is the confidence score (0.5 to 1.0 range in practice). A cell with 10 "unsafe" and 2 "safe" tags has score 0.83
6. Compute `centerLat` and `centerLng` from the geohash decoding (done server-side using ngeohash)
7. Return only cells with at least 3 total tags (minimum sample size to avoid misleading single-person reports)

### Score-to-Color Mapping

The `scoreColor.js` utility maps a `{ dominantTag, score }` pair to an RGBA color array for the PolygonLayer:

- `safe`: green spectrum — score 1.0 = full green, score 0.5 = yellow-green
- `unsafe`: red spectrum — score 1.0 = deep red, score 0.5 = orange-red
- `lively`: purple spectrum
- `calm`: blue spectrum
- `crowded`: orange spectrum
- `deserted`: gray spectrum

Opacity is also score-driven: low score (0.5) = 30% opacity, high score (1.0) = 70% opacity. This naturally shows cells with strong consensus as more vivid and cells with mixed signals as more transparent.

### Tag Submission — Day/Hour Extraction

The frontend extracts `dayOfWeek` and `hourSlot` from `new Date()` using `date-fns` before sending the submission. This captures the user's local time — which is the correct behavior because a 10pm tag should reflect what the area feels like at 10pm local time regardless of the server's timezone. The backend stores exactly what the frontend sends and does not re-derive time from the server clock.

### Route Vibe Score

The route points array (up to 100 decoded polyline points) is sent to the backend. For each point, the server computes its geohash at precision 7, then queries the moments collection for moments matching `{ geohashCell: cellHash, dayOfWeek: day, hourSlot: hour }`. It builds a tag frequency object for each cell along the route, computes a score (same logic as heatmap), then averages across all route cells. The response includes both the aggregate score and a per-segment array for visualization as a colored gradient on the route polyline.

---

## 12. Authentication & Security

### JWT Strategy

- Access tokens are signed with `jsonwebtoken` using a secret from env
- Access token expiry: 7 days (simple approach — no refresh token for this project scope)
- Token stored in `localStorage` on the client
- Zustand auth store rehydrates from localStorage on every app mount

**Why localStorage and not httpOnly cookies:** httpOnly cookies are more secure against XSS (JavaScript cannot read them) but introduce CSRF complexity (cookies are sent automatically on every request to the domain). For this project scope, localStorage is used with these XSS mitigations:

1. **Helmet CSP headers** restrict which scripts can execute, reducing XSS surface
2. **No `dangerouslySetInnerHTML`** anywhere in the codebase — React's default JSX escaping handles all text rendering
3. **User-generated content (notes) is text-only**, max 80 chars, always rendered as `{note}` in JSX (auto-escaped), never parsed as HTML
4. **No third-party inline scripts** — all dependencies are bundled via Vite

**CSRF is not a concern here** because the JWT is sent via the `Authorization: Bearer` header, not via cookies. CSRF attacks exploit automatic cookie attachment — header-based auth is immune to CSRF by design.

### Password Security

- bcryptjs with salt rounds of 12
- Passwords are never returned in any API response
- Email lookups are case-insensitive (stored lowercased)

### API Security Layers

- `helmet` middleware sets all recommended HTTP security headers (X-Content-Type-Options, X-Frame-Options, CSP, etc.)
- `cors` configured with explicit origin whitelist:
  ```js
  cors({
    origin: [process.env.FRONTEND_URL, "http://localhost:5173"],
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  });
  ```
- `express-rate-limit` applied to all routes (100 requests per 15 minutes general, 10 per hour for moment submission, 5 per 15 minutes for auth, 20 per 15 minutes for route score)
- `express-validator` on every POST/PATCH endpoint — rejects malformed inputs before they reach controllers
- MongoDB query: bounding box area is validated server-side with `boundsValidator.js` to reject unreasonably large map queries that could cause expensive aggregations
- Environment variables: Google Maps API key is only in the frontend env (VITE\_ prefix). MongoDB connection string and JWT secret are only in the backend env, never exposed to client

### Input Sanitization

- All note text is trimmed and capped at 80 chars server-side
- Notes are rendered in React as plain text via JSX (`{moment.note}`) — React auto-escapes all JSX expressions, preventing XSS
- Tag values are validated against the enum list server-side — any unknown tag value is rejected
- Coordinates are validated as valid lat/lng ranges server-side (lat: -90 to 90, lng: -180 to 180)

---

## 13. Performance & Optimization

### Frontend

**Debounced map bounds updates**: The `useHeatmapData` hook uses a 400ms debounce on the `bounds_changed` event. Without this, a slow map drag would fire 50+ API calls. With debouncing, only one call fires after the user finishes moving the map.

**Heatmap data caching per viewport**: If the user pans slightly but the new bounds are contained within the previous fetched bounds, do not re-fetch. The `useHeatmapData` hook checks if the new bounds are a subset of the last fetched bounds before firing a new call.

**deck.gl PolygonLayer performance**: deck.gl uses WebGL for rendering. Even 5,000 cells renders smoothly because the PolygonLayer batches all polygons into a single WebGL draw call. No React reconciliation overhead per cell.

**Code splitting**: Vite's default route-based code splitting means `RouteComparePage`, `ExplorePage`, and `MyMomentsPage` are lazy-loaded. Only `HomePage` and its map dependencies load immediately.

**Zustand over Redux**: Zustand has no boilerplate, no action/reducer separation, and updates components precisely without causing broad re-renders. The map store, auth store, and UI store are separate files so a change to auth state does not re-render map components.

### Backend

**MongoDB compound index on heatmap query fields**: The index `{ geohashCell: 1, dayOfWeek: 1, hourSlot: 1 }` means the aggregation pipeline's `$match` after `$geoWithin` hits an index instead of scanning. Combined with the 2dsphere spatial index, the heatmap query uses both indexes efficiently.

**Bounding box area limit**: Queries for areas larger than 50km × 50km are rejected with a 400 error. This prevents accidental or malicious large aggregations.

**Gzip compression**: The `compression` middleware gzips all JSON responses. Heatmap responses containing hundreds of cells compress significantly.

**Logging strategy (Morgan + Winston):**

- **Development**: `morgan('dev')` for colorized HTTP request logs to console
- **Production**: `morgan('combined')` piped into Winston for structured JSON logging. Winston also logs:
  - Server start/stop events
  - MongoDB connection success/failure
  - Authentication failures (email attempted, IP, timestamp — for security monitoring)
  - Rate limit hits
  - Aggregation pipeline errors
  - Unhandled promise rejections and uncaught exceptions
- Log levels: `error` > `warn` > `info` > `debug`. Production runs at `info` level. Development runs at `debug`.
- Logs output to `stdout` (Railway/Render capture these automatically from the process output)

---

## 14. Environment Configuration

### Frontend (`client/.env`)

```
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
VITE_API_BASE_URL=http://localhost:3001/api
```

For production, `VITE_API_BASE_URL` is changed to the deployed backend URL. These are set as environment variables in the Vercel project settings.

### Backend (`server/.env`)

```
PORT=3001
NODE_ENV=development
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/geomoment
JWT_SECRET=a_long_random_secret_string_minimum_32_characters
JWT_EXPIRY=7d
FRONTEND_URL=http://localhost:5173
```

For production, `FRONTEND_URL` is the deployed Vercel domain. These are set as environment variables in the Railway or Render project settings. The `.env` file is in `.gitignore` and **never committed**.

The `.env.example` file (which is committed) contains all the keys with placeholder values and comments:

```
# Server port
PORT=3001
# Environment: development | production
NODE_ENV=development
# MongoDB Atlas connection string — replace <username>, <password>, <cluster> with your values
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/geomoment
# JWT signing secret — generate a random 32+ character string (e.g., openssl rand -hex 32)
JWT_SECRET=
# JWT expiry duration
JWT_EXPIRY=7d
# Frontend URL for CORS whitelist
FRONTEND_URL=http://localhost:5173
```

---

## 15. Testing Strategy

### What to Test and Why

Testing focuses on the three areas most likely to have silent bugs: the geospatial aggregation logic, the authentication flow, and the tag submission validation. Frontend unit tests cover the utility functions since those have pure inputs and outputs.

### Backend Tests (Vitest + Supertest)

Tests live in `server/tests/`. Vitest is used as the test runner for both frontend and backend (single test framework across the entire project for consistency). They use Supertest to make HTTP requests against the Express app without running a real server, and connect to `mongodb-memory-server` for a fully offline in-memory database — this avoids affecting real data and ensures tests are reproducible.

**`auth.test.js` covers:**

- Register with valid data → 201 and token returned
- Register with duplicate email → 409 conflict error
- Register with invalid email → 422 validation error
- Login with correct credentials → 200 and token
- Login with wrong password → 401
- Protected route without token → 401
- Protected route with invalid token → 401

**`moment.test.js` covers:**

- Submit moment when authenticated → 201 and stored correctly
- Submit moment when not authenticated → 401
- Submit with invalid tag (not in enum) → 422
- Submit with out-of-range coordinates → 422
- Heatmap endpoint with valid params → 200 and correct shape
- Heatmap endpoint with too-large bounds → 400
- Delete own moment → 200
- Delete another user's moment → 403

**`route.test.js` covers:**

- Route score with valid points array → 200 with score object
- Route score with empty points array → 422
- Route score with too many points → 422

### Frontend Tests (Vitest)

Tests live alongside their source files as `filename.test.js` files.

**Utils under test:**

- `geohash.js`: encodeCell returns consistent 7-char string, cellToPolygon returns 4 corner points
- `timeSlots.js`: getSlotLabel returns correct label for edge cases (hour 0, hour 23, hour 12)
- `scoreColor.js`: each tag type returns correct color family, opacity increases with score
- `formatters.js`: formatTimeAgo handles seconds/minutes/hours/days correctly

**No complex React component testing for this project scope.** The utility tests cover the logic that would silently break and be hard to spot visually.

### Manual Testing Checklist

Before each deployment, verify manually:

- Map loads and renders correctly on desktop and mobile
- Clicking the map while not logged in opens auth modal
- Clicking the map while logged in opens tag submit modal
- Submitting a tag shows it immediately on the map
- Time filter changes update the heatmap color
- Route compare shows two scores
- My Moments page shows user's submissions with delete working
- API key restrictions are working (no key exposure in network tab source)

### Load Testing (Optional, Pre-Production)

Before scaling to real users, validate backend performance using `artillery` or `k6`:

- Target: 100 concurrent requests to `GET /api/moments/heatmap` with a valid 10km × 10km bounding box should complete within 500ms average
- Target: 50 concurrent `POST /api/moments` submissions should complete within 200ms average
- This validates that the MongoDB indexes and aggregation pipeline perform under load

---

## 16. Deployment Plan

### Architecture Decision

- **Frontend → Vercel**: Vercel is the best choice for Vite/React apps. Automatic deployments on `main` branch push. Free tier is sufficient. CDN distribution built in.
- **Backend → Railway** (preferred) or **Render**: Railway supports Node.js with zero-config. Automatically builds from `server/` directory. Railway requires a $5/month starter plan (no free tier). Render offers a free tier with 15-minute sleep on inactivity — suitable for development. For always-on production, Railway's paid plan is recommended.
- **Database → MongoDB Atlas**: Free M0 tier (512MB storage) is fine for development and early production. Has the built-in 2dsphere geospatial indexing needed. Always-on. Auto-backups.

### Health Check Endpoint

A health check endpoint is required for Railway/Render to verify the server is alive:

```
GET /api/health → { status: "ok", uptime: process.uptime(), timestamp: Date.now() }
```

This endpoint is unprotected and not rate-limited. Deployment platforms ping it to determine if the service needs a restart.

### Pre-Deployment Steps

**MongoDB Atlas setup:**

1. Create Atlas account and M0 free cluster
2. Create database named `geomoment`
3. Create a database user with read/write access
4. Whitelist all IPs (0.0.0.0/0) for the deployed backend — or whitelist Railway's IP range
5. Get connection string and add to backend env
6. Create indexes manually via Atlas UI or via a seed script:
   - `moments.location`: 2dsphere
   - `moments.{ geohashCell, dayOfWeek, hourSlot }`: compound ascending
   - `moments.userId`: ascending
   - `users.email`: unique ascending

**Google Cloud Console setup:**

1. Create project, enable Maps JavaScript API, Places API, Directions API
2. Create API key
3. Restrict key to HTTP referrers: `https://yourdomain.vercel.app/*` and `http://localhost:5173/*`
4. Set up billing (required even for free tier usage)

### Frontend Deployment (Vercel)

1. Push project to GitHub
2. Import `client/` directory into new Vercel project
3. Framework preset: Vite
4. Build command: `npm run build`
5. Output directory: `dist`
6. Add environment variables in Vercel dashboard:
   - `VITE_GOOGLE_MAPS_API_KEY`
   - `VITE_API_BASE_URL` (set to the Railway backend URL once deployed)
7. Vercel automatically deploys on every `main` branch push

### Backend Deployment (Railway)

1. Create Railway account, new project from GitHub repo
2. Select `server/` as the root directory
3. Railway auto-detects Node.js and runs `npm start`
4. Add environment variables in Railway dashboard:
   - `PORT` (Railway sets this automatically — just make sure `process.env.PORT` is used)
   - `NODE_ENV=production`
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `JWT_EXPIRY=7d`
   - `FRONTEND_URL` (set to the Vercel domain)
5. Copy the Railway-provided domain and update `VITE_API_BASE_URL` in Vercel env

### CI/CD Pipeline (GitHub Actions)

The `.github/workflows/ci.yml` runs on every push and pull request:

1. Checkout code
2. Set up Node.js 20
3. Install dependencies for both `client/` and `server/`
4. Run ESLint on both
5. Run Vitest backend tests (with `mongodb-memory-server`)
6. Run Vitest frontend tests
7. Run Vite build to verify no build errors

On merge to `main`, Vercel and Railway automatically pick up the latest code via their GitHub integrations.

---

## 17. Third-Party Services & Accounts Required

| Service              | Purpose                                     | Cost                                      |
| -------------------- | ------------------------------------------- | ----------------------------------------- |
| Google Cloud Console | Maps JS API key, Places API, Directions API | Free tier covers ~$200/month in map loads |
| MongoDB Atlas        | Database hosting with geospatial indexing   | Free M0 tier (512MB)                      |
| Vercel               | Frontend hosting                            | Free Hobby tier                           |
| Railway              | Backend hosting                             | $5/month starter plan (no free tier)      |
| Render (alternative) | Backend hosting (free alternative)          | Free tier (15-min sleep on inactivity)    |
| GitHub               | Code repository + CI/CD                     | Free                                      |

**Total cost to run this project in development: $0/month** (using Render free tier).
**Total cost for always-on production: ~$5/month** (Railway starter plan).

---

## 18. Error Handling Strategy

### Backend Error Handling

**Async handler wrapper** — Every controller function is wrapped in an `asyncHandler` utility to eliminate repetitive try-catch blocks:

```js
// utils/asyncHandler.js
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
```

Usage: `router.get('/heatmap', asyncHandler(momentController.getHeatmap))`

**Global error handler** (`errorHandler.middleware.js`) catches all errors passed via `next(error)`:

- `Mongoose ValidationError` → 422 with field-level details
- `Mongoose CastError` (invalid ObjectId) → 400 with "Invalid ID format"
- `error.code === 11000` (duplicate key, e.g., duplicate email) → 409 Conflict
- Custom errors with `statusCode` property → use that status code
- All other errors → 500 with generic "Internal server error" message
- **Development mode**: include `error.stack` in response for debugging
- **Production mode**: never expose stack traces or internal error details

### Frontend Error Handling

- **Axios response interceptor**: catches `401 Unauthorized` → clears auth store, redirects to `/` with auth modal open
- **Axios response interceptor**: catches `429 Too Many Requests` → shows toast "Too many requests — please wait"
- **Axios response interceptor**: catches `5xx` → shows generic error toast "Something went wrong — please try again"
- **Component-level**: each form/action has its own error state for displaying inline error messages
- **React Error Boundary**: wraps the entire app in `App.jsx` as a crash safety net — if any component throws during render, shows a "Something went wrong" fallback UI instead of a white screen

---

## 19. Development Build Order

### Backend Build Order

```
Phase 1 — Foundation
  1. npm init, install all dependencies
  2. Create server/src/index.js (loads env, connects to MongoDB, starts server)
  3. Create server/src/app.js (Express setup, middleware stack, route mounting)
  4. Create config/db.js (Mongoose connection with retry logic)
  5. Create config/constants.js (TAG_TYPES, JWT_EXPIRY, GEOHASH_PRECISION, etc.)
  6. Create utils/apiResponse.js (success/error response helpers)
  7. Create utils/asyncHandler.js

Phase 2 — Auth System
  8. Create models/User.js (Mongoose schema + password hashing pre-save hook)
  9. Create validators/auth.validators.js (register + login validation rules)
  10. Create middleware/auth.middleware.js (JWT verification)
  11. Create controllers/auth.controller.js (register, login)
  12. Create routes/auth.routes.js
  13. Test auth flow with Postman/Thunder Client

Phase 3 — Core Data (Moments + Heatmap)
  14. Create models/Moment.js (schema with 2dsphere index, compound index)
  15. Create utils/geohash.js, utils/timeSlot.js, utils/boundsValidator.js
  16. Create validators/moment.validators.js
  17. Create controllers/moment.controller.js (submitMoment, getHeatmap, getMomentsInBounds, deleteMoment, updateMoment)
  18. Create routes/moment.routes.js
  19. Test moment submission and heatmap query with Postman

Phase 4 — Supporting Features
  20. Create controllers/user.controller.js + routes/user.routes.js
  21. Create controllers/route.controller.js + routes/route.routes.js
  22. Create middleware/rateLimit.middleware.js (all rate limiters)
  23. Create middleware/errorHandler.middleware.js (global error handler)
  24. Create middleware/validate.middleware.js

Phase 5 — Polish
  25. Add health check endpoint (GET /api/health)
  26. Configure morgan + winston logging
  27. Add helmet, compression middleware
  28. Write integration tests with Vitest + Supertest
  29. Create scripts/seed.js (generates test data for development)
  30. Verify all MongoDB indexes are created
```

### Frontend Build Order

```
Phase 1 — Foundation
  1. npx create-vite@latest client -- --template react
  2. Install all dependencies (see tech stack)
  3. Set up Tailwind CSS, ESLint, Prettier, PostCSS
  4. Create src/services/api.js (Axios instance with baseURL + JWT interceptor)
  5. Create all utils/ files (geohash.js, timeSlots.js, tagConfig.js, scoreColor.js, formatters.js, validators.js)
  6. Create all store/ files (authStore.js, mapStore.js, uiStore.js)
  7. Create ui/ components (Button, Input, Modal, Spinner, Badge, ErrorMessage)

Phase 2 — Auth
  8. Create src/services/authService.js
  9. Create src/hooks/useAuth.js
  10. Create auth components (LoginForm, RegisterForm, AuthModal)
  11. Test login/register flow against running backend

Phase 3 — Map Core
  12. Create MapCanvas.jsx (APIProvider + Map + click handler)
  13. Create useMapBounds.js hook
  14. Create HeatmapOverlay.jsx (deck.gl GoogleMapsOverlay + PolygonLayer)
  15. Create useHeatmapData.js hook (debounced API calls)
  16. Create TimeFilterBar.jsx + TagLegend.jsx
  17. Test heatmap rendering with real API data

Phase 4 — Tag Submission
  18. Create TagSubmitModal.jsx
  19. Create useTagSubmit.js hook
  20. Create momentService.js
  21. Test full flow: click map → tag → see on heatmap

Phase 5 — Pages & Navigation
  22. Create all pages (HomePage, ExplorePage, RouteComparePage, MyMomentsPage, LoginPage, NotFoundPage)
  23. Set up React Router in App.jsx with lazy loading
  24. Create Navbar.jsx + PageWrapper.jsx
  25. Create useGeolocation.js hook (center map on user's location)

Phase 6 — Polish
  26. Create MomentCard.jsx + MomentFeed.jsx
  27. Create RouteScorePanel.jsx + useRouteScore.js
  28. Create routeService.js + userService.js
  29. Add notistack SnackbarProvider and toast notifications
  30. Responsive testing across mobile/tablet/desktop
  31. Verify code splitting is working (check network tab)
```

### Database Seed Script

Create `server/scripts/seed.js` for development. This script:

- Creates 2-3 test users with known credentials
- Generates 100+ fake moments around a known location (e.g., New Delhi's Connaught Place) spread across different days and hours
- Uses realistic tag distribution (more "safe" and "lively" tags, fewer "unsafe")
- Run with: `node server/scripts/seed.js`

This makes the heatmap visually populated during frontend development and demo.

---

## 20. Accessibility & Responsiveness

### Accessibility

- **Focus management**: TagSubmitModal and AuthModal trap focus when open. Pressing Escape closes them.
- **Keyboard navigation**: All interactive elements (buttons, chips, inputs, modal close) are keyboard-accessible via Tab and Enter.
- **ARIA labels**: Map controls, filter chips, and icon-only buttons have descriptive `aria-label` attributes.
- **Color + text**: The heatmap color-codes are supplemented by the TagLegend with text labels — the system does not rely on color alone to convey meaning.
- **Semantic HTML**: Pages use `<main>`, `<nav>`, `<header>`, `<section>` for screen reader navigation.

### Responsive Breakpoints

| Breakpoint              | Layout                                                                                                                                                                               |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Mobile (< 768px)        | TimeFilterBar moves to a collapsible bottom sheet. MomentFeed hides behind a slide-up drawer. TagSubmitModal and AuthModal render full-screen. Navbar collapses to a hamburger menu. |
| Tablet (768px – 1024px) | Side feed panel is collapsible. Map takes full width when panel is closed. Two-column layout for RouteComparePage.                                                                   |
| Desktop (> 1024px)      | Full layout. Side feed panel always visible. Three-column layout for ExplorePage (search, map, time profile).                                                                        |

---

## Final Notes on What Was Intentionally Left Out

These things were deliberately excluded to keep the project intermediate-level and buildable, with reasoning for each:

- **WebSockets / real-time updates** — Polling via debounced fetches is sufficient. Real-time adds Socket.IO complexity with no UX benefit here (heatmap data doesn't change by the second).
- **Refresh tokens** — 7-day access tokens are long enough to avoid forcing re-login. Refresh tokens add a token rotation flow, refresh endpoint, and httpOnly cookie management — disproportionate complexity for this scope.
- **Redis caching** — MongoDB with proper compound + 2dsphere indexes is fast enough at this data scale. Redis adds infrastructure and cache invalidation logic.
- **Image upload on moments** — Adds S3/Cloudinary complexity, presigned URLs, and image processing. Minimal value for the core feature (a tag is defined by its type, not a photo).
- **Admin dashboard** — Not needed for an intermediate project; direct MongoDB Atlas UI can serve for data inspection and moderation.
- **Mobile app / PWA** — Responsive Tailwind CSS covers mobile browsers. A native app or PWA with push notifications is a future step.
- **Microservices** — One Express app is clean and sufficient. Microservices add deployment orchestration complexity with no benefit at this scale.
- **TypeScript** — Excluded per stack requirement (JavaScript only). TypeScript adds type safety but also adds compilation step and type gymnastics overhead.
- **Soft delete** — Hard delete is simpler and avoids filtering overhead. Documented as a conscious decision with a migration path if needed later.

Everything in this plan can be built by a single intermediate developer using the specified stack. The complexity ceiling at each layer is deliberately kept at a level where you understand every decision.

---

_Plan Version: 2.0 | Project: GeoMoment | Stack: React + Vite + Tailwind + Node + Express + MongoDB | Maps: @vis.gl/react-google-maps + deck.gl_

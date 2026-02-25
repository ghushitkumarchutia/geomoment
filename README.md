# GeoMoment

**Temporally-indexed geo-experience map.** Tag how a place feels right now — safe, lively, crowded — and see everyone's tags as a time-aware heatmap.

Users tap anywhere on the map, choose a vibe tag, and optionally add a short note. GeoMoment aggregates these into geohash-based cells and renders them as colored polygons on a Google Maps layer, filtered by day of week and time slot. The result is a crowd-sourced "vibe map" that changes across time.

---

## Features

- **Click-to-tag** — Tap anywhere on the map. Pick one of six vibe tags (Safe, Unsafe, Lively, Calm, Crowded, Deserted). Choose a time slot or "All Time." Add an optional note. Done.
- **Time-aware heatmap** — Every tag is bucketed by day of week and hour slot (Morning / Afternoon / Evening / Night). The heatmap only shows data matching the selected time filter.
- **All Time tags** — Tags submitted with "All Time" appear across every time slot, capturing vibes that persist regardless of the hour.
- **Geohash aggregation** — Tags are grouped into ~76m × 38m cells (geohash precision 7). Each cell shows the dominant vibe and a confidence score based on tag density.
- **Explore mode** — Enter any coordinates to get a vibe score profile for that location across all tag types.
- **My Moments** — View, edit notes, and delete your own tags with pagination.
- **Auto geolocation** — The map centers on your current position on load (with permission), with a manual "locate me" button for re-centering.
- **Public heatmap, authenticated tagging** — Anyone can view the heatmap and nearby moments. Signing in is required only to submit, edit, or delete tags.

---

## Tech Stack

| Layer             | Technology                     | Version |
| ----------------- | ------------------------------ | ------- |
| **Runtime**       | Node.js                        | 20+     |
| **Server**        | Express                        | 5.x     |
| **Database**      | MongoDB + Mongoose             | 9.x     |
| **Auth**          | JWT (jsonwebtoken) + bcryptjs  | —       |
| **Frontend**      | React                          | 19.x    |
| **Build**         | Vite                           | 7.x     |
| **Styling**       | Tailwind CSS                   | 4.x     |
| **Routing**       | React Router DOM               | 7.x     |
| **State**         | Zustand                        | 5.x     |
| **Maps**          | Google Maps (vis.gl) + deck.gl | 9.x     |
| **Animations**    | Framer Motion                  | 12.x    |
| **Forms**         | React Hook Form                | 7.x     |
| **Notifications** | notistack                      | 3.x     |
| **Geohash**       | ngeohash                       | 0.6     |
| **Logging**       | Winston + Morgan               | 3.x     |
| **Testing**       | Vitest + Supertest             | —       |

---

## Project Structure

```
geomoment/
├── client/                              # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/                    # LoginForm, RegisterForm, AuthModal,
│   │   │   │                            # ProfileMenu
│   │   │   ├── filters/                 # TimeFilterBar, TagLegend
│   │   │   ├── layout/                  # Navbar, PageWrapper
│   │   │   ├── map/                     # MapCanvas, HeatmapOverlay, TagMarker,
│   │   │   │                            # TagSubmitModal
│   │   │   ├── moments/                 # MomentCard, MomentFeed
│   │   │   └── ui/                      # Button, Input, Modal, Spinner, Badge,
│   │   │                                # ErrorMessage
│   │   ├── hooks/                       # useAuth, useGeolocation, useMapBounds,
│   │   │                                # useHeatmapData, useTagSubmit
│   │   ├── pages/                       # HomePage, ExplorePage, MyMomentsPage,
│   │   │                                # LoginPage, NotFoundPage
│   │   ├── services/                    # api.js, authService, momentService,
│   │   │                                # userService
│   │   ├── store/                       # authStore, mapStore, uiStore (Zustand)
│   │   ├── utils/                       # tagConfig, timeSlots, geohash,
│   │   │                                # scoreColor, formatters, validators
│   │   ├── App.jsx                      # Router setup + providers
│   │   ├── main.jsx                     # Entry point
│   │   └── index.css                    # Tailwind directives + base styles
│   ├── index.html
│   └── package.json
│
├── server/                              # Express API
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js                    # MongoDB connection with retry logic
│   │   │   └── constants.js             # Tag types, rate limits, thresholds
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── moment.controller.js
│   │   │   ├── user.controller.js
│   │   │   └── route.controller.js
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js        # JWT verification
│   │   │   ├── validate.middleware.js    # express-validator runner
│   │   │   ├── rateLimit.middleware.js   # Per-endpoint rate limiters
│   │   │   └── errorHandler.middleware.js # Global error handler
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   └── Moment.js
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── moment.routes.js
│   │   │   ├── user.routes.js
│   │   │   └── route.routes.js
│   │   ├── validators/
│   │   │   ├── auth.validators.js
│   │   │   ├── moment.validators.js
│   │   │   ├── route.validators.js
│   │   │   └── user.validators.js
│   │   ├── utils/
│   │   │   ├── apiResponse.js           # Standardized success/error helpers
│   │   │   ├── asyncHandler.js          # Async controller wrapper
│   │   │   ├── boundsValidator.js       # Haversine-based area check
│   │   │   ├── geohash.js              # ngeohash encode/decode wrappers
│   │   │   ├── logger.js               # Winston logger (dev/prod formats)
│   │   │   └── timeSlot.js             # Day/hour extraction from Date
│   │   └── app.js                       # Express app setup
│   ├── server.js                        # Entry point
│   └── package.json
│
└── README.md
```

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 20
- **MongoDB** (local or [Atlas](https://www.mongodb.com/atlas))
- **Google Maps API key** with Maps JavaScript API, Places API enabled

### 1. Clone and install

```bash
git clone https://github.com/ghushitkumarchutia/geomoment.git
cd geomoment

# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
```

### 2. Configure environment

**Server** — create `server/.env`:

```env
PORT=3001
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/geomoment
JWT_SECRET=your-strong-secret-key-min-32-chars
JWT_EXPIRY=7d
FRONTEND_URL=http://localhost:5173
```

**Client** — create `client/.env`:

```env
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
VITE_GOOGLE_MAPS_MAP_ID=your-map-id-for-styled-maps
VITE_API_BASE_URL=http://localhost:3001/api
```

> **Google Maps setup:** Go to [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → Enable **Maps JavaScript API** → Create an API key → Restrict to HTTP referrers. The Map ID is optional (for custom styling) — create one at [Map Styles](https://console.cloud.google.com/google/maps-api/studio/styles).

### 3. Run in development

```bash
# Terminal 1 — Start server (port 3001)
cd server && npm run dev

# Terminal 2 — Start client (port 5173)
cd client && npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

---

## API Reference

All endpoints are prefixed with `/api`. Responses follow a consistent shape:

```json
{ "success": true, "data": { ... } }
{ "success": false, "message": "...", "errors": [...] }
```

### Authentication

| Method | Endpoint         | Auth | Description                                        |
| ------ | ---------------- | ---- | -------------------------------------------------- |
| `POST` | `/auth/register` | —    | Create account. Body: `{ name, email, password }`  |
| `POST` | `/auth/login`    | —    | Sign in. Body: `{ email, password }`. Returns JWT. |

### Moments

| Method   | Endpoint           | Auth | Description                                                                |
| -------- | ------------------ | ---- | -------------------------------------------------------------------------- |
| `GET`    | `/moments/heatmap` | —    | Aggregated heatmap cells for a bounding box + time filter.                 |
| `GET`    | `/moments/bounds`  | —    | Individual recent moments within a bounding box.                           |
| `POST`   | `/moments`         | ✅   | Submit a new moment. Body: `{ lat, lng, tag, note?, dayOfWeek, hourSlot }` |
| `PATCH`  | `/moments/:id`     | ✅   | Update note only. Body: `{ note }`                                         |
| `DELETE` | `/moments/:id`     | ✅   | Delete a moment you own.                                                   |

**Heatmap query parameters:**

```
GET /api/moments/heatmap?swLat=28.60&swLng=77.20&neLat=28.65&neLng=77.25&day=5&hour=20
```

- `day`: 0 (Sun) – 6 (Sat), or `-1` for all days
- `hour`: 0–23 (representative hour for a slot), or `-1` for all hours

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "geohashCell": "ttnfv4q",
      "centerLat": 28.6315,
      "centerLng": 77.2167,
      "dominantTag": "lively",
      "score": 0.85,
      "totalCount": 12
    }
  ]
}
```

### Users

| Method | Endpoint            | Auth | Description                                               |
| ------ | ------------------- | ---- | --------------------------------------------------------- |
| `GET`  | `/users/me/moments` | ✅   | Paginated list of your moments. Query: `?page=1&limit=20` |
| `GET`  | `/users/me/profile` | ✅   | Your profile: name, email, momentCount, createdAt.        |

### Route Score

| Method | Endpoint       | Auth | Description                                                         |
| ------ | -------------- | ---- | ------------------------------------------------------------------- |
| `POST` | `/route/score` | —    | Vibe score for a route. Body: `{ points: [{lat, lng}], day, hour }` |

### Health Check

| Method | Endpoint  | Auth | Description                             |
| ------ | --------- | ---- | --------------------------------------- |
| `GET`  | `/health` | —    | Returns `{ status, uptime, timestamp }` |

---

## Tag Types

| Tag      | Emoji | Color     | Meaning                          |
| -------- | ----- | --------- | -------------------------------- |
| Safe     | 🛡️    | `#22c55e` | Feels secure and safe to be here |
| Unsafe   | ⚠️    | `#ef4444` | Feels threatening or dangerous   |
| Lively   | 🎉    | `#a855f7` | Energetic, active, buzzing       |
| Calm     | �     | `#3b82f6` | Peaceful, quiet, relaxing        |
| Crowded  | 👥    | `#f97316` | Packed with people, hard to move |
| Deserted | 🏚️    | `#6b7280` | Empty, nobody around             |

---

## How the Heatmap Works

1. **User submits a tag** at a location → the server computes a geohash cell (precision 7 ≈ 76m × 38m) using `ngeohash`, stores the tag with day-of-week, hour-slot, and GeoJSON coordinates.

2. **Frontend requests heatmap data** whenever the map viewport changes or the time filter is adjusted → a 400ms debounced API call with the visible bounding box + selected day + hour.

3. **Server aggregates** using a MongoDB pipeline: `$geoWithin` (2dsphere index) → `$match` on day/hour (including "All Time" tags with value -1) → `$group` by geohash cell → compute dominant tag per cell and confidence score.

4. **deck.gl renders** each cell as a colored polygon via `GoogleMapsOverlay` + `PolygonLayer`, with RGBA color derived from the dominant tag and opacity scaled by confidence (30%–70%).

The `MIN_TAGS_PER_CELL` threshold (configurable in `server/src/config/constants.js`) controls how many tags a cell needs before appearing on the heatmap. Currently set to `1` for development visibility.

---

## Scripts

### Server (`server/`)

```bash
npm run dev          # Start with nodemon (auto-reload)
npm start            # Production start
npm test             # Run Vitest test suite
npm run lint         # ESLint check
npm run lint:fix     # ESLint auto-fix
npm run format       # Prettier format
npm run format:check # Prettier check
npm run seed         # Seed database with test data
```

### Client (`client/`)

```bash
npm run dev          # Vite dev server (HMR, port 5173)
npm run build        # Production build → dist/
npm run preview      # Preview production build locally
npm run lint         # ESLint check
npm run lint:fix     # ESLint auto-fix
npm run format       # Prettier format
npm run format:check # Prettier check
```

---

## Environment Variables

### Server

| Variable       | Required | Description                                  |
| -------------- | -------- | -------------------------------------------- |
| `MONGODB_URI`  | ✅       | MongoDB connection string                    |
| `JWT_SECRET`   | ✅       | Secret for signing JWT tokens (min 32 chars) |
| `JWT_EXPIRY`   | —        | Token expiry duration (default: `7d`)        |
| `PORT`         | —        | Server port (default: `3001`)                |
| `NODE_ENV`     | —        | `development` or `production`                |
| `FRONTEND_URL` | —        | Frontend origin for CORS whitelist           |

### Client

| Variable                   | Required | Description                    |
| -------------------------- | -------- | ------------------------------ |
| `VITE_GOOGLE_MAPS_API_KEY` | ✅       | Google Maps JavaScript API key |
| `VITE_GOOGLE_MAPS_MAP_ID`  | —        | Map ID for custom styled maps  |
| `VITE_API_BASE_URL`        | —        | API base URL (default: `/api`) |

---

## Security

- Passwords hashed with **bcryptjs** (12 salt rounds), never returned in API responses
- **JWT** tokens for stateless authentication with configurable expiry
- **Rate limiting** per endpoint: auth (5/15min), moment submission (10/hr), heatmap (30/min), route score (20/15min), general (100/15min)
- **Helmet** for HTTP security headers (CSP, X-Frame-Options, etc.)
- **CORS** configured with explicit origin whitelist
- **Input validation** via express-validator on all POST/PATCH endpoints
- **Bounding box area limit** (max 2500 km²) prevents expensive aggregation queries
- Protected routes require valid JWT in `Authorization: Bearer <token>` header

---

## Deployment

| Service           | Purpose          | Recommended                |
| ----------------- | ---------------- | -------------------------- |
| **Vercel**        | Frontend hosting | Auto-deploy from `client/` |
| **Render**        | Backend hosting  | Auto-deploy from `server/` |
| **MongoDB Atlas** | Database         | Free M0 tier with 2dsphere |

The backend exposes a `GET /api/health` endpoint for deployment platform health checks.

---

## License

MIT

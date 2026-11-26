# UniVent

UniVent helps students across Kenya's universities discover and attend campus events, while clubs can publish and manage them.

This repo is the React frontend. The Flask + PostgreSQL API lives in [UniVent-BackEnd](https://github.com/nobuyanzi07-cell/UniVent-BackEnd).

## Getting started

You need Node.js 20+ and the backend running on `http://localhost:5000` (see the backend README).

```bash
npm install
cp .env.example .env
npm run dev
```

Open http://localhost:5173. During development Vite forwards every `/api/...` request to `http://localhost:5000`, so you don't need CORS set up locally.

Other scripts:

```bash
npm run build    # production build in dist/
npm run preview  # serve the production build
npm run lint     # ESLint
npm test         # Vitest
```

## Environment variables

### Frontend (`.env`)

| Variable | Required | Example | Description |
| --- | --- | --- | --- |
| `VITE_API_URL` | Production only | `https://univent-api.onrender.com` | Base URL of the Flask API. Leave empty locally; the Vite proxy handles `/api`. |
| `VITE_USE_MOCK` | No | `false` | `true` shows the built-in mock events instead of calling the API. |

### Backend (`.env` in UniVent-BackEnd)

| Variable | Required | Example | Description |
| --- | --- | --- | --- |
| `DATABASE_URL` | Yes | `postgresql://postgres:postgres@localhost:5432/univent` | PostgreSQL connection string. |
| `FLASK_APP` | Yes | `app.py` | Flask entry point. |
| `FLASK_DEBUG` | No | `1` | Enable auto-reload and debug pages locally. |
| `CORS_ORIGINS` | Production | `https://univent.vercel.app` | Frontend origin(s) allowed to call the API. |

Never commit `.env` files.

## Routes

| Path | Page |
| --- | --- |
| `/` | Browse events |
| `/events/:id` | Event details |
| `/saved` | Saved events |
| `/create` | Create event (POSTs to `/api/events`) |
| `/clubs/new` | Create club (POSTs to `/api/clubs`) |
| `/clubs/:id/edit` | Edit club (PATCHes `/api/clubs/:id`) |
| `/auth` | Log in |
| `/auth?mode=signup` | Sign up |

## API endpoints

Full request/response details: [`docs/API.md`](https://github.com/nobuyanzi07-cell/UniVent-BackEnd/blob/main/docs/API.md) in the backend repo.

| Method | Endpoint | Description | Used by |
| --- | --- | --- | --- |
| GET | `/api/events?q=` | List events, optional search | Browse |
| GET | `/api/events/:id` | One event | Event details |
| POST | `/api/events` | Create an event | Create event |
| PATCH | `/api/events/:id` | Update an event | — |
| DELETE | `/api/events/:id` | Delete an event | — |
| GET | `/api/clubs?university=` | List clubs, optional university filter | Create event club dropdown |
| GET | `/api/clubs/:id` | One club | Edit club |
| POST | `/api/clubs` | Create a club | Create club |
| PATCH | `/api/clubs/:id` | Update a club | Edit club |
| DELETE | `/api/clubs/:id` | Delete a club | — |

Validation errors come back as `400` with `{ "errors": { "<field>": "<message>" } }`. The forms show each message next to its field.

The university list (`src/constants/universities.js`) comes from the CUE list of accredited universities. The backend must accept the same names.

## Project structure

```text
src/
  Components/       # Shared UI components
  Pages/            # Route pages (CreateEvent, ClubForm, Browse, ...)
  constants/        # Shared constants (university list)
  context/          # Saved events provider
  hooks/            # Data hooks (useEvents, useEvent, useClubs)
  routing/          # React Router route definitions
  services/         # API client, events/clubs API, mock data
  test/             # Test setup
  App.jsx           # Shared layout (NavBar, routes, footer)
  main.jsx          # React entry point
  styles.css        # Global styles

index.html          # Vite HTML entry
vite.config.js      # Vite config, /api dev proxy, test config
vercel.json         # SPA rewrites for deployment
```

## Deployment

The site is deployed on Vercel. Set `VITE_API_URL` in the Vercel project settings to the deployed API. `vercel.json` rewrites all routes to `index.html` so deep links like `/clubs/3/edit` work on refresh.
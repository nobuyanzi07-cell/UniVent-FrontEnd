# UniVent

UniVent helps students across Nairobi's universities discover and attend campus events, while clubs can publish and manage them.

Phase 2 replaces the Ticketmaster API with our own Flask REST API and PostgreSQL database, with full CRUD on Clubs and Events. A club belongs to one university and has many events; an event's university must match its club's.

## Getting started

The repo holds both apps: the React frontend at the root and the Flask API in `backend/`.

### 1. Backend (Flask, port 5000)

```bash
cd backend
python -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env               # then edit .env
flask --app wsgi db upgrade        # create the tables
python seed.py                     # universities, clubs and sample events
flask --app wsgi run --port 5000
```

Check it: http://localhost:5000/api/health should return `{"status": "ok", "database": "ok"}`.

### 2. Frontend (React + Vite, port 5173)

In a second terminal, from the repo root:

```bash
npm install
cp .env.example .env
npm run dev
```

Open http://localhost:5173. Vite forwards every `/api/...` request to `http://localhost:5000`, so no CORS setup is needed locally.

Other scripts:

```bash
npm run build    # production build in dist/
npm run lint     # ESLint
npm test         # Vitest
```

## Environment variables

### Frontend (`.env` at the repo root)

| Variable | Required | Example | Description |
| --- | --- | --- | --- |
| `VITE_API_URL` | Production only | `https://univent-api.onrender.com` | Base URL of the Flask API. Leave empty locally; the Vite proxy handles `/api`. |
| `VITE_USE_MOCK` | No | `false` | `true` shows built-in mock events instead of calling the API. |

### Backend (`backend/.env`)

| Variable | Required | Example | Description |
| --- | --- | --- | --- |
| `FLASK_ENV` | No | `development` | `development`, `testing` or `production`. |
| `SECRET_KEY` | Production | `change-me` | Flask secret key. |
| `DATABASE_URL` | Yes | `postgresql://postgres:password@localhost:5432/univent` | Database URL. `sqlite:///univent.db` works locally with no setup. |
| `FRONTEND_URLS` | Yes | `http://localhost:5173,https://univent.vercel.app` | Origins allowed by CORS, comma-separated. |
| `TICKETMASTER_API_KEY` | No | | Only for the optional `/api/featured` endpoint. |

Never commit `.env` files.

## Routes

| Path | Page | API calls |
| --- | --- | --- |
| `/` | Browse events | `GET /api/events` |
| `/events/:id` | Event details | `GET /api/events/:id` |
| `/saved` | Saved events | — |
| `/create` | Create event | `GET /api/universities`, `GET /api/clubs?university=<id>`, `POST /api/events` |
| `/clubs/new` | Create club | `GET /api/universities`, `POST /api/clubs` |
| `/clubs/:id/edit` | Edit club | `GET /api/clubs/:id`, `PATCH /api/clubs/:id` |
| `/auth` | Log in | — |
| `/auth?mode=signup` | Sign up | — |

## API endpoints

Full request/response examples: [`docs/API.md`](docs/API.md).

| Method | Endpoint | Success | Errors |
| --- | --- | --- | --- |
| GET | `/api/health` | 200 | 503 |
| GET | `/api/universities` | 200 list | — |
| GET | `/api/clubs?university=<id>` | 200 list | — |
| GET | `/api/clubs/<id>` | 200 club | 404 |
| POST | `/api/clubs` | 201 club | 400 |
| PATCH | `/api/clubs/<id>` | 200 club | 400, 404 |
| DELETE | `/api/clubs/<id>` | 204 | 404, 409 |
| GET | `/api/events?q=` | 200 list | — |
| GET | `/api/events/<id>` | 200 event | 404 |
| POST | `/api/events` | 201 event | 400 |
| PATCH | `/api/events/<id>` | 200 event | 400, 404 |
| DELETE | `/api/events/<id>` | 204 | 404 |

Errors always look like `{"error": {"status": 400, "message": "...", "fields": {"title": "Title is required"}}}`. The forms show each `fields` message next to its input.

## Project structure

```text
src/
  Components/       # Shared UI components
  Pages/            # Route pages (CreateEvent, ClubForm, Browse, ...)
  context/          # Saved events provider
  hooks/            # Data hooks (useEvents, useEvent, useClubs, useUniversities)
  routing/          # React Router route definitions
  services/         # API client, events/clubs/universities API, mock data
  test/             # Test setup
  App.jsx           # Shared layout (NavBar, routes, footer)
  main.jsx          # React entry point
  styles.css        # Global styles

backend/            # Flask API (see backend/README.md)
docs/API.md         # API reference
index.html          # Vite HTML entry
vite.config.js      # Vite config, /api dev proxy, test config
vercel.json         # SPA rewrites for deployment
```

## Deployment

The site is deployed on Vercel. Set `VITE_API_URL` in the Vercel project settings to the deployed API. `vercel.json` rewrites all routes to `index.html` so deep links like `/clubs/3/edit` work on refresh.

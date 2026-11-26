# UniVent API (Flask)

Flask REST API and PostgreSQL database for UniVent, Phase 2.
This first version is the project foundation: app factory, config, CORS,
error handling, a health check, Render deployment, and the optional
`/api/featured` Ticketmaster endpoint. Teammates add models and blueprints on top.

## Project structure

```text
app/
  __init__.py        # create_app(): config, extensions, blueprints, error handlers
  config.py          # Development / Testing / Production settings from .env
  extensions.py      # db, migrate, cors (created once, attached in create_app)
  errors.py          # ApiError + one JSON error shape for every response
  models/            # Caleb M.: University, Club, Event, SavedEvent go here
  routes/
    __init__.py      # ALL_BLUEPRINTS: register new blueprints here
    health.py        # GET /api/health
    featured.py      # GET /api/featured (optional Ticketmaster extra)
  services/
    ticketmaster.py  # Ticketmaster call, mapping and 10-minute cache
tests/               # pytest
wsgi.py              # entry point for flask run and gunicorn
render.yaml          # Render blueprint: web service + Postgres
```

## Run it locally

```bash
python -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env               # then edit .env
flask --app wsgi run --port 5000
```

Open http://localhost:5000/api/health. You should see `{"status": "ok", "database": "ok"}`.

Run the tests:

```bash
pytest -q
```

## Adding your part (for teammates)

**A model** (Caleb M.): create `app/models/event.py`, import `db` from `app.extensions`,
then import the model in `app/models/__init__.py`. Create the migrations:

```bash
flask --app wsgi db init        # only once, by one person; commit the migrations/ folder
flask --app wsgi db migrate -m "add events"
flask --app wsgi db upgrade
```

**A blueprint** (Abdilei, Caleb M.): create `app/routes/events.py` with
`events_bp = Blueprint("events", __name__, url_prefix="/api/events")`, then add it
to `ALL_BLUEPRINTS` in `app/routes/__init__.py`.

**Errors**: raise `ApiError` instead of building error JSON by hand:

```python
from app.errors import ApiError

raise ApiError(400, "Please fix the highlighted fields.", {"title": "Title is required"})
raise ApiError(404, "Event not found.")
```

## API so far

| Method | Endpoint | Returns |
| --- | --- | --- |
| GET | `/api/health` | `{"status": "ok", "database": "ok"}`, or 503 if the database is down |
| GET | `/api/featured?city=&country=&size=` | `{"events": [...], "count": n}` from Ticketmaster; 503 if no key is set |

Errors always look like:

```json
{ "error": { "status": 400, "message": "...", "fields": { "size": "Use 1 to 20" } } }
```

## Deploy the API on Render (task #9)

1. Push this repo to GitHub. The `migrations/` folder must be committed first,
   because the build runs `flask db upgrade`.
2. On Render: **New → Blueprint**, choose this repo. `render.yaml` creates the
   `univent-api` web service and the `univent-db` PostgreSQL database.
3. When asked for the variables marked `sync: false`, set:
   - `FRONTEND_URLS`: `https://<your-vercel-app>.vercel.app,http://localhost:5173`
   - `TICKETMASTER_API_KEY`: your key (optional; leave blank to switch featured events off)
4. Wait for the deploy, then open `https://univent-api.onrender.com/api/health`.
5. Seed the database once from the service's **Shell** tab: `python seed.py`
   (when Caleb M.'s seed script exists).

Notes:
- Render gives `postgres://` URLs; `config.py` converts them to `postgresql://`.
- The free web service sleeps after 15 minutes idle, so the first request can take
  30 to 60 seconds. Open `/api/health` before a demo to wake it.
- The free Postgres database expires after 30 days; check the date on the dashboard
  before the final presentation.

## Connect the React app on Vercel (task #10)

1. Vercel → the UniVent project → **Settings → Environment Variables**.
2. Add `VITE_API_URL` = `https://univent-api.onrender.com` (no trailing slash)
   for Production and Preview.
3. **Deployments → Redeploy** the latest build. Vite reads `VITE_` variables
   at build time, so the change only applies after a redeploy.
4. Make sure the Vercel URL is in the API's `FRONTEND_URLS`, or the browser
   will block requests with a CORS error.
5. Remove `VITE_TM_API_KEY` from Vercel once no page calls Ticketmaster directly.

Check: open the deployed site, open DevTools → Network, and confirm requests go to
`univent-api.onrender.com` with status 200 and no CORS errors in the Console.

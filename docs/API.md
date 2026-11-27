# UniVent API

The Flask API lives in `backend/`. Base URL: `http://localhost:5000` locally. All requests and responses are JSON, and field names are `snake_case`.

## Errors

Every error has the same shape (`backend/app/errors.py`):

```json
{
  "error": {
    "status": 400,
    "message": "Please fix the highlighted fields.",
    "fields": { "name": "Name is required" }
  }
}
```

| Status | When |
| --- | --- |
| 400 | Validation failed. `fields` maps each request field to its message. |
| 404 | Resource not found |
| 409 | Conflict, e.g. deleting a club that still has events |
| 500 | Unexpected server error |

The React forms show each `fields` message next to the matching input, so the keys must be the request field names (`title`, `start_at`, `club_id`, ...).

---

## Universities

### GET /api/universities

All universities, sorted by name. Fills the University dropdowns.

`200 OK`

```json
[
  { "id": 2, "name": "Kenyatta University", "short_name": "KU" },
  { "id": 3, "name": "Strathmore University", "short_name": "SU" }
]
```

---

## Clubs

### Club object

```json
{
  "id": 2,
  "name": "KU Tech Club",
  "description": "Coding, hackathons and tech talks.",
  "university_id": 2,
  "university": { "id": 2, "name": "Kenyatta University", "short_name": "KU" },
  "contact_email": "tech@ku.example",
  "logo_url": null,
  "created_at": "2026-11-26T18:45:02"
}
```

| Field | Type | Rules |
| --- | --- | --- |
| `name` | string | Required, up to 120 characters, unique within a university |
| `university_id` | integer | Required, an existing university |
| `description` | string or null | Optional |
| `contact_email` | string or null | Optional, must contain `@` |
| `logo_url` | string or null | Optional |

### GET /api/clubs

List clubs, sorted by name.

| Query | Description |
| --- | --- |
| `university` | A university **id**: only that university's clubs |

```http
GET /api/clubs?university=2
```

`200 OK`: an array of club objects.

### GET /api/clubs/&lt;id&gt;

`200 OK`: a club object plus `"events": [...]`. `404` if it does not exist.

### POST /api/clubs

```json
{
  "name": "KU Chess Club",
  "university_id": 2,
  "description": "Weekly chess.",
  "contact_email": null,
  "logo_url": null
}
```

`201 Created`: the new club. `400` example:

```json
{
  "error": {
    "status": 400,
    "message": "Please fix the highlighted fields.",
    "fields": { "name": "A club with this name already exists at this university" }
  }
}
```

### PATCH /api/clubs/&lt;id&gt;

Send only the fields to change; same rules as POST. A club that has events cannot change `university_id`.

`200 OK`: the updated club. `400` with `fields`, `404` if not found.

### DELETE /api/clubs/&lt;id&gt;

`204 No Content`. `404` if not found. `409` if the club still has events.

---

## Events

### Event object

```json
{
  "id": 2,
  "title": "KU Hackathon 2026",
  "description": null,
  "category": "Tech",
  "start_at": "2026-12-08T09:00:00",
  "venue": "KU Main Auditorium",
  "city": "Nairobi",
  "image_url": null,
  "price_kes": 0,
  "capacity": 150,
  "club_id": 2,
  "university_id": 2,
  "club": { "id": 2, "name": "KU Tech Club", "logo_url": null },
  "university": { "id": 2, "name": "Kenyatta University", "short_name": "KU" },
  "created_at": "2026-11-26T18:45:02"
}
```

| Field | Type | Rules |
| --- | --- | --- |
| `title` | string | Required, up to 200 characters |
| `start_at` | ISO datetime `YYYY-MM-DDTHH:MM` | Required |
| `venue` | string | Required |
| `club_id` | integer | Required, an existing club |
| `university_id` | integer | Required, must equal the club's `university_id` |
| `category` | string or null | e.g. `Tech`, `Arts`, `Music`, `Business`, `Sports` |
| `description` | string or null | Optional |
| `city` | string or null | Optional |
| `price_kes` | integer | Default 0, must be ≥ 0 (0 = free) |
| `capacity` | integer or null | Optional, ≥ 0 |
| `image_url` | string or null | Optional |

### GET /api/events

List events, soonest first. Optional query: `q` (search text).

`200 OK`: an array of event objects.

### GET /api/events/&lt;id&gt;

`200 OK`: an event object. `404` if it does not exist.

### POST /api/events

```json
{
  "title": "Code & Coffee",
  "category": "Tech",
  "description": "Morning coding session.",
  "start_at": "2026-12-21T09:30",
  "venue": "KU Library",
  "city": "Nairobi",
  "price_kes": 0,
  "image_url": null,
  "university_id": 2,
  "club_id": 2
}
```

`201 Created`: the new event. `400` with `fields` (for example `{"club_id": "Club is not at this university"}`).

### PATCH /api/events/&lt;id&gt;

Send only the fields to change; same rules as POST. `200 OK`, `400`, or `404`.

### DELETE /api/events/&lt;id&gt;

`204 No Content`. `404` if not found. Also removes the event from Saved Events.

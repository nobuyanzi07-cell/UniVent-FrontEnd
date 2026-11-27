"""Featured events from Ticketmaster (task #20, optional third-party API).

The API key stays on the server, so it no longer ships in the React bundle.
Events are mapped to the same shape the frontend already uses.
"""
import time

import requests

BASE_URL = "https://app.ticketmaster.com/discovery/v2/events.json"
TIMEOUT_SECONDS = 8

# Simple in-memory cache: {(city, country, size): (saved_at, events)}
_cache = {}


class TicketmasterError(Exception):
    def __init__(self, status, message):
        super().__init__(message)
        self.status = status
        self.message = message


def map_event(raw):
    venue = (raw.get("_embedded") or {}).get("venues", [{}])[0]
    price = (raw.get("priceRanges") or [{}])[0]
    images = raw.get("images") or []
    image = next((i for i in images if i.get("ratio") == "16_9" and i.get("width", 0) >= 500), None)
    if image is None and images:
        image = images[0]
    start = (raw.get("dates") or {}).get("start") or {}
    classification = (raw.get("classifications") or [{}])[0]

    return {
        "id": f"tm-{raw.get('id')}",
        "name": raw.get("name", ""),
        "imageUrl": image.get("url") if image else None,
        "startDate": start.get("localDate"),
        "startTime": start.get("localTime"),
        "venueName": venue.get("name", ""),
        "city": (venue.get("city") or {}).get("name", ""),
        "priceMin": price.get("min"),
        "priceMax": price.get("max"),
        "currency": price.get("currency"),
        "category": (classification.get("segment") or {}).get("name"),
        "ticketUrl": raw.get("url"),
        "source": "ticketmaster",
    }


def get_featured_events(api_key, city=None, country=None, size=6, cache_seconds=600):
    if not api_key:
        raise TicketmasterError(503, "Featured events are not configured.")

    key = (city or "", country or "", size)
    cached = _cache.get(key)
    if cached and time.time() - cached[0] < cache_seconds:
        return cached[1]

    params = {"apikey": api_key, "size": size, "sort": "date,asc"}
    if city:
        params["city"] = city
    if country:
        params["countryCode"] = country

    try:
        response = requests.get(BASE_URL, params=params, timeout=TIMEOUT_SECONDS)
    except requests.RequestException:
        raise TicketmasterError(502, "Could not reach Ticketmaster.")

    if response.status_code == 429:
        raise TicketmasterError(429, "Too many requests to Ticketmaster. Try again shortly.")
    if not response.ok:
        raise TicketmasterError(502, "Ticketmaster returned an error.")

    raw_events = (response.json().get("_embedded") or {}).get("events", [])
    events = [map_event(e) for e in raw_events]
    _cache[key] = (time.time(), events)
    return events


def clear_cache():
    _cache.clear()

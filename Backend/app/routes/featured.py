"""GET /api/featured?city=London&country=GB&size=6 — featured events from Ticketmaster."""
from flask import Blueprint, current_app, jsonify, request

from ..errors import ApiError
from ..services.ticketmaster import TicketmasterError, get_featured_events

featured_bp = Blueprint("featured", __name__, url_prefix="/api")


@featured_bp.get("/featured")
def featured():
    city = request.args.get("city", "").strip() or None
    country = request.args.get("country", "").strip().upper() or None

    size = request.args.get("size", "6")
    if not size.isdigit() or not 1 <= int(size) <= 20:
        raise ApiError(400, "size must be a number from 1 to 20.", {"size": "Use 1 to 20"})

    try:
        events = get_featured_events(
            current_app.config["TICKETMASTER_API_KEY"],
            city=city,
            country=country,
            size=int(size),
            cache_seconds=current_app.config["FEATURED_CACHE_SECONDS"],
        )
    except TicketmasterError as err:
        raise ApiError(err.status, err.message)

    return jsonify({"events": events, "count": len(events)})

"""GET /api/health — used by Render's health check and to test the deploy."""
from flask import Blueprint, jsonify
from sqlalchemy import text

from ..extensions import db

health_bp = Blueprint("health", __name__, url_prefix="/api")


@health_bp.get("/health")
def health():
    try:
        db.session.execute(text("SELECT 1"))
        database = "ok"
    except Exception:  # the API is up even if the database is not
        database = "unavailable"

    status = 200 if database == "ok" else 503
    return jsonify({"status": "ok" if status == 200 else "degraded", "database": database}), status

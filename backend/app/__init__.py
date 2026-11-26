"""Application factory (task #1).

    from app import create_app
    app = create_app("development")
"""
import os

from flask import Flask, jsonify

from .config import config_by_name
from .errors import register_error_handlers
from .extensions import cors, db, migrate


def create_app(config_name=None):
    config_name = config_name or os.getenv("FLASK_ENV", "development")
    if config_name not in config_by_name:
        raise ValueError(f"Unknown config '{config_name}'. Use one of: {', '.join(config_by_name)}")

    app = Flask(__name__)
    app.config.from_object(config_by_name[config_name])

    # Extensions
    db.init_app(app)
    migrate.init_app(app, db)
    cors.init_app(
        app,
        resources={r"/api/*": {"origins": app.config["FRONTEND_URLS"]}},
        methods=["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
        allow_headers=["Content-Type"],
    )

    # Load the models so migrations can see every table
    from . import models  # noqa: F401

    # Routes
    from .routes import ALL_BLUEPRINTS

    for blueprint in ALL_BLUEPRINTS:
        app.register_blueprint(blueprint)

    register_error_handlers(app)

    @app.get("/")
    def index():
        return jsonify({"name": "UniVent API", "health": "/api/health"})

    return app

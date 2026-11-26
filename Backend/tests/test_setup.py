"""Task #1: app factory, config, CORS and the JSON error shape."""
import pytest

from app import create_app
from app.config import _database_url


def test_index_lists_health_route(client):
    response = client.get("/")
    assert response.status_code == 200
    assert response.get_json()["health"] == "/api/health"


def test_health_reports_database_ok(client):
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.get_json() == {"status": "ok", "database": "ok"}


def test_unknown_route_returns_json_error(client):
    response = client.get("/api/does-not-exist")
    assert response.status_code == 404
    assert response.get_json()["error"]["status"] == 404


def test_cors_allows_the_frontend(client):
    response = client.get("/api/health", headers={"Origin": "http://localhost:5173"})
    assert response.headers.get("Access-Control-Allow-Origin") == "http://localhost:5173"


def test_cors_blocks_other_sites(client):
    response = client.get("/api/health", headers={"Origin": "https://evil.example"})
    assert "Access-Control-Allow-Origin" not in response.headers


def test_render_database_url_is_fixed(monkeypatch):
    monkeypatch.setenv("DATABASE_URL", "postgres://user:pw@host/db")
    assert _database_url("sqlite://") == "postgresql://user:pw@host/db"


def test_unknown_config_name_fails_loudly():
    with pytest.raises(ValueError):
        create_app("staging")

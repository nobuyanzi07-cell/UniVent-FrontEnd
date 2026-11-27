"""Task #20: /api/featured, with Ticketmaster mocked so tests never use the network."""
from unittest.mock import MagicMock, patch

import requests

SAMPLE = {
    "_embedded": {
        "events": [
            {
                "id": "abc123",
                "name": "Live Concert",
                "url": "https://tickets.example/abc123",
                "images": [{"ratio": "16_9", "width": 640, "url": "https://img.example/a.jpg"}],
                "dates": {"start": {"localDate": "2026-12-05", "localTime": "19:30:00"}},
                "priceRanges": [{"min": 20, "max": 50, "currency": "GBP"}],
                "classifications": [{"segment": {"name": "Music"}}],
                "_embedded": {"venues": [{"name": "O2 Arena", "city": {"name": "London"}}]},
            }
        ]
    }
}


def fake_response(status=200, body=None):
    response = MagicMock()
    response.status_code = status
    response.ok = 200 <= status < 300
    response.json.return_value = body or {}
    return response


@patch("app.services.ticketmaster.requests.get")
def test_featured_maps_events(mock_get, client):
    mock_get.return_value = fake_response(body=SAMPLE)

    response = client.get("/api/featured?city=London&country=gb")

    assert response.status_code == 200
    event = response.get_json()["events"][0]
    assert event["id"] == "tm-abc123"
    assert event["venueName"] == "O2 Arena"
    assert event["category"] == "Music"
    assert mock_get.call_args.kwargs["params"]["countryCode"] == "GB"


@patch("app.services.ticketmaster.requests.get")
def test_featured_uses_cache(mock_get, client):
    mock_get.return_value = fake_response(body=SAMPLE)
    client.get("/api/featured?city=London")
    client.get("/api/featured?city=London")
    assert mock_get.call_count == 1


@patch("app.services.ticketmaster.requests.get")
def test_featured_rate_limit(mock_get, client):
    mock_get.return_value = fake_response(status=429)
    response = client.get("/api/featured")
    assert response.status_code == 429


@patch("app.services.ticketmaster.requests.get")
def test_featured_network_error(mock_get, client):
    mock_get.side_effect = requests.ConnectionError()
    response = client.get("/api/featured")
    assert response.status_code == 502
    assert "error" in response.get_json()


def test_featured_bad_size(client):
    response = client.get("/api/featured?size=500")
    assert response.status_code == 400
    assert response.get_json()["error"]["fields"]["size"]


def test_featured_without_key(app, client):
    app.config["TICKETMASTER_API_KEY"] = ""
    response = client.get("/api/featured")
    assert response.status_code == 503

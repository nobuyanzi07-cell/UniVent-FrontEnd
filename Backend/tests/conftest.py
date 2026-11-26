import pytest

from app import create_app
from app.services.ticketmaster import clear_cache


@pytest.fixture
def app():
    app = create_app("testing")
    clear_cache()
    yield app
    clear_cache()


@pytest.fixture
def client(app):
    return app.test_client()

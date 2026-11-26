"""App settings, read from environment variables (.env locally, Render in production)."""
import os

from dotenv import load_dotenv

load_dotenv()


def _database_url(default):
    """Render gives 'postgres://...', but SQLAlchemy needs 'postgresql://...'."""
    url = os.getenv("DATABASE_URL", default)
    if url.startswith("postgres://"):
        url = url.replace("postgres://", "postgresql://", 1)
    return url


def _frontend_urls():
    """FRONTEND_URLS="http://localhost:5173,https://univent.vercel.app" -> list of origins."""
    raw = os.getenv("FRONTEND_URLS", "http://localhost:5173")
    return [url.strip().rstrip("/") for url in raw.split(",") if url.strip()]


class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-only-secret")
    SQLALCHEMY_DATABASE_URI = _database_url("sqlite:///univent.db")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    FRONTEND_URLS = _frontend_urls()
    TICKETMASTER_API_KEY = os.getenv("TICKETMASTER_API_KEY", "")
    FEATURED_CACHE_SECONDS = 600  # reuse Ticketmaster results for 10 minutes
    JSON_SORT_KEYS = False


class DevelopmentConfig(Config):
    DEBUG = True


class TestingConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"
    TICKETMASTER_API_KEY = "test-key"
    FRONTEND_URLS = ["http://localhost:5173"]


class ProductionConfig(Config):
    DEBUG = False


config_by_name = {
    "development": DevelopmentConfig,
    "testing": TestingConfig,
    "production": ProductionConfig,
}

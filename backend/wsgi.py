"""Entry point for `flask --app wsgi run` locally and `gunicorn wsgi:app` on Render."""
from app import create_app

app = create_app()

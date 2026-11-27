"""Extensions are created here without an app, then attached in create_app().

Keeping them in their own file avoids circular imports: models import `db`
from here, not from app/__init__.py.
"""
from flask_cors import CORS
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()
migrate = Migrate()
cors = CORS()

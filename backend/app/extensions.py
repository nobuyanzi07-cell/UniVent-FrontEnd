"""Extension objects shared across the app.

They are created here, WITHOUT an app, and attached to the app later inside
create_app() with db.init_app(app) and migrate.init_app(app, db).
Keeping them in their own module avoids circular imports between the app
factory (__init__.py) and the models.
"""
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

db = SQLAlchemy()
migrate = Migrate()
"""UniVent Phase 2 data models: University, Club, Event, SavedEvent.

Club -> Event is the one-to-many relationship required by the brief.
"""
from datetime import datetime, timezone

from .extensions import db


def utcnow():
    """Timestamp used as the default for every created_at column."""
    return datetime.now(timezone.utc)


class University(db.Model):
    __tablename__ = "universities"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), nullable=False, unique=True)
    short_name = db.Column(db.String(20), nullable=False)

    clubs = db.relationship("Club", back_populates="university")
    events = db.relationship("Event", back_populates="university")

    def to_dict(self):
        return {"id": self.id, "name": self.name, "short_name": self.short_name}


class Club(db.Model):
    __tablename__ = "clubs"
    __table_args__ = (
        # Club names are unique WITHIN a university (requirements, section 4).
        db.UniqueConstraint("university_id", "name", name="uq_club_university_name"),
    )

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    description = db.Column(db.Text)
    university_id = db.Column(
        db.Integer, db.ForeignKey("universities.id"), nullable=False, index=True
    )
    contact_email = db.Column(db.String(255))
    logo_url = db.Column(db.String(500))
    created_at = db.Column(db.DateTime, nullable=False, default=utcnow)

    university = db.relationship("University", back_populates="clubs")
    # No cascade on purpose: the team has not yet decided what happens to a
    # club's events when the club is deleted. The DELETE endpoint will enforce
    # the rule (409 block). To switch to "delete events too", change this to:
    #   db.relationship("Event", back_populates="club", cascade="all, delete-orphan")
    events = db.relationship("Event", back_populates="club", order_by="Event.start_at")

    def to_dict(self, include_events=False):
        data = {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "university_id": self.university_id,
            "university": self.university.to_dict() if self.university else None,
            "contact_email": self.contact_email,
            "logo_url": self.logo_url,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
        if include_events:
            data["events"] = [event.to_dict(include_club=False) for event in self.events]
        return data


class Event(db.Model):
    __tablename__ = "events"
    __table_args__ = (
        # price_kes and capacity are whole numbers of 0 or more (0 = free).
        db.CheckConstraint("price_kes >= 0", name="ck_event_price_non_negative"),
        db.CheckConstraint(
            "capacity IS NULL OR capacity >= 0", name="ck_event_capacity_non_negative"
        ),
    )

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    category = db.Column(db.String(50), index=True)
    start_at = db.Column(db.DateTime, nullable=False, index=True)
    venue = db.Column(db.String(200), nullable=False)
    city = db.Column(db.String(100))
    image_url = db.Column(db.String(500))
    price_kes = db.Column(db.Integer, nullable=False, default=0)
    capacity = db.Column(db.Integer)
    club_id = db.Column(db.Integer, db.ForeignKey("clubs.id"), nullable=False, index=True)
    university_id = db.Column(
        db.Integer, db.ForeignKey("universities.id"), nullable=False, index=True
    )
    created_at = db.Column(db.DateTime, nullable=False, default=utcnow)

    club = db.relationship("Club", back_populates="events")
    university = db.relationship("University", back_populates="events")
    # Deleting (cancelling) an event also removes its saved entries, so it
    # disappears from Saved Events too (acceptance flow 3).
    saved_entries = db.relationship(
        "SavedEvent", back_populates="event", cascade="all, delete-orphan"
    )

    def to_dict(self, include_club=True):
        data = {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "category": self.category,
            "start_at": self.start_at.isoformat() if self.start_at else None,
            "venue": self.venue,
            "city": self.city,
            "image_url": self.image_url,
            "price_kes": self.price_kes,
            "capacity": self.capacity,
            "club_id": self.club_id,
            "university_id": self.university_id,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
        if include_club:
            data["club"] = (
                {"id": self.club.id, "name": self.club.name, "logo_url": self.club.logo_url}
                if self.club
                else None
            )
            data["university"] = self.university.to_dict() if self.university else None
        return data


class SavedEvent(db.Model):
    __tablename__ = "saved_events"

    id = db.Column(db.Integer, primary_key=True)
    # unique=True: an event can be saved once. In Phase 3 (accounts) this
    # becomes unique per (user_id, event_id) when user_id is added.
    event_id = db.Column(
        db.Integer, db.ForeignKey("events.id"), nullable=False, unique=True
    )
    created_at = db.Column(db.DateTime, nullable=False, default=utcnow)

    event = db.relationship("Event", back_populates="saved_entries")

    def to_dict(self):
        return {
            "id": self.id,
            "event_id": self.event_id,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "event": self.event.to_dict() if self.event else None,
        }
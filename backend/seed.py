from app import create_app
from app.extensions import db
from app.models import University
from app.models import Club
from datetime import datetime
from app.models import Event


UNIVERSITIES = [
    {"name": "University of Nairobi", "short_name": "UoN"},
    {"name": "Kenyatta University", "short_name": "KU"},
    {"name": "Strathmore University", "short_name": "SU"},
    {"name": "USIU-Africa", "short_name": "USIU"},
    {"name": "Jomo Kenyatta University of Agriculture and Technology", "short_name": "JKUAT"},
]


def seed_universities():
    for data in UNIVERSITIES:
        exists = University.query.filter_by(name=data["name"]).first()
        if not exists:
            db.session.add(University(**data))
    db.session.commit()

CLUBS = [
    {"university": "UoN", "name": "UoN Drama Club", "description": "Theatre, skits and stage productions.", "contact_email": "drama@uon.example"},
    {"university": "KU", "name": "KU Tech Club", "description": "Coding, hackathons and tech talks.", "contact_email": "tech@ku.example"},
    {"university": "SU", "name": "Strathmore Entrepreneurship Club", "description": "Startup pitches and business mentorship.", "contact_email": "ent@su.example"},
    {"university": "USIU", "name": "USIU Music Society", "description": "Live music nights and open mics.", "contact_email": "music@usiu.example"},
    {"university": "JKUAT", "name": "JKUAT Robotics Club", "description": "Building robots and competing in engineering challenges.", "contact_email": "robotics@jkuat.example"},
]


def seed_clubs():
    for data in CLUBS:
        university = University.query.filter_by(short_name=data["university"]).first()
        exists = Club.query.filter_by(university_id=university.id, name=data["name"]).first()
        if not exists:
            db.session.add(Club(
                name=data["name"],
                description=data["description"],
                contact_email=data["contact_email"],
                university_id=university.id,
            ))
    db.session.commit()

EVENTS = [
    {"club": "UoN Drama Club", "title": "Campus Theatre Night", "category": "Arts", "start_at": datetime(2026, 12, 5, 18, 0), "venue": "Taifa Hall", "price_kes": 200, "capacity": 300},
    {"club": "KU Tech Club", "title": "KU Hackathon 2026", "category": "Tech", "start_at": datetime(2026, 12, 8, 9, 0), "venue": "KU Main Auditorium", "price_kes": 0, "capacity": 150},
    {"club": "Strathmore Entrepreneurship Club", "title": "Startup Pitch Day", "category": "Business", "start_at": datetime(2026, 12, 10, 14, 0), "venue": "Strathmore Business School", "price_kes": 500, "capacity": 120},
    {"club": "USIU Music Society", "title": "Open Mic Night", "category": "Music", "start_at": datetime(2026, 12, 12, 19, 0), "venue": "USIU Amphitheatre", "price_kes": 0, "capacity": 200},
    {"club": "JKUAT Robotics Club", "title": "Robotics Showdown", "category": "Tech", "start_at": datetime(2026, 12, 15, 10, 0), "venue": "JKUAT Engineering Workshop", "price_kes": 100, "capacity": 100},
]


def seed_events():
    for data in EVENTS:
        club = Club.query.filter_by(name=data["club"]).first()
        exists = Event.query.filter_by(club_id=club.id, title=data["title"]).first()
        if not exists:
            db.session.add(Event(
                title=data["title"],
                category=data["category"],
                start_at=data["start_at"],
                venue=data["venue"],
                city="Nairobi",
                price_kes=data["price_kes"],
                capacity=data["capacity"],
                club_id=club.id,
                university_id=club.university_id,
            ))
    db.session.commit()

def run_seed():
    app = create_app()
    with app.app_context():
        seed_universities()
        seed_clubs()
        seed_events()
        print("Seed complete.")


if __name__ == "__main__":
    run_seed()
from flask import Blueprint, jsonify, request

from ..models import Club, University
from ..extensions import db
from ..errors import error_response

clubs_bp = Blueprint("clubs", __name__, url_prefix="/api/clubs")


@clubs_bp.get("")
def list_clubs():
    query = Club.query
    university_id = request.args.get("university", type=int)
    if university_id:
        query = query.filter_by(university_id=university_id)
    clubs = query.order_by(Club.name).all()
    return jsonify([club.to_dict() for club in clubs]), 200

@clubs_bp.get("/<int:club_id>")
def get_club(club_id):
    club = db.session.get(Club, club_id)
    if club is None:
        return error_response(404, "Club not found")
    return jsonify(club.to_dict(include_events=True)), 200

@clubs_bp.post("")
def create_club():
    data = request.get_json(silent=True) or {}
    name = (data.get("name") or "").strip()
    university_id = data.get("university_id")
    contact_email = (data.get("contact_email") or "").strip()

    fields = {}
    if not name:
        fields["name"] = "Name is required"
    if university_id is None:
        fields["university_id"] = "University is required"
    elif not isinstance(university_id, int) or db.session.get(University, university_id) is None:
        fields["university_id"] = "University does not exist"
    if contact_email and "@" not in contact_email:
        fields["contact_email"] = "Enter a valid email address"
    if not fields and Club.query.filter_by(university_id=university_id, name=name).first():
        fields["name"] = "A club with this name already exists at this university"

    if fields:
        return error_response(400, "Please fix the highlighted fields.", fields)

    club = Club(
        name=name,
        description=data.get("description"),
        university_id=university_id,
        contact_email=contact_email or None,
        logo_url=data.get("logo_url"),
    )
    db.session.add(club)
    db.session.commit()
    return jsonify(club.to_dict()), 201

@clubs_bp.patch("/<int:club_id>")
def update_club(club_id):
    club = db.session.get(Club, club_id)
    if club is None:
        return error_response(404, "Club not found")

    data = request.get_json(silent=True) or {}
    fields = {}

    name = club.name
    if "name" in data:
        name = (data["name"] or "").strip()
        if not name:
            fields["name"] = "Name is required"

    university_id = club.university_id
    if "university_id" in data:
        university_id = data["university_id"]
        if not isinstance(university_id, int) or db.session.get(University, university_id) is None:
            fields["university_id"] = "University does not exist"
        elif university_id != club.university_id and club.events:
            fields["university_id"] = "Cannot change the university of a club that has events"

    contact_email = club.contact_email
    if "contact_email" in data:
        contact_email = (data["contact_email"] or "").strip()
        if contact_email and "@" not in contact_email:
            fields["contact_email"] = "Enter a valid email address"

    if not fields:
        duplicate = Club.query.filter(
            Club.university_id == university_id,
            Club.name == name,
            Club.id != club.id,
        ).first()
        if duplicate:
            fields["name"] = "A club with this name already exists at this university"

    if fields:
        return error_response(400, "Please fix the highlighted fields.", fields)

    club.name = name
    club.university_id = university_id
    club.contact_email = contact_email or None
    if "description" in data:
        club.description = data["description"]
    if "logo_url" in data:
        club.logo_url = data["logo_url"]

    db.session.commit()
    return jsonify(club.to_dict()), 200

@clubs_bp.delete("/<int:club_id>")
def delete_club(club_id):
    club = db.session.get(Club, club_id)
    if club is None:
        return error_response(404, "Club not found")

    if club.events:
        return error_response(
            409,
            "This club still has events. Delete or move its events first.",
        )

    db.session.delete(club)
    db.session.commit()
    return "", 204
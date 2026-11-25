from flask import jsonify


def error_response(status, message, fields=None):
    body = {"error": {"status": status, "message": message}}
    if fields:
        body["error"]["fields"] = fields
    return jsonify(body), status
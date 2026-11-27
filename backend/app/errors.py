"""One JSON error shape for the whole API, matching the requirements doc:

    {"error": {"status": 400, "message": "...", "fields": {"title": "Title is required"}}}

The React app reads error.status, so getErrorInfo() keeps working.
"""
from flask import jsonify
from werkzeug.exceptions import HTTPException


class ApiError(Exception):
    """Raise this in a route to send a clean JSON error, e.g.

        raise ApiError(400, "Please fix the highlighted fields.", {"title": "Title is required"})
    """

    def __init__(self, status, message, fields=None):
        super().__init__(message)
        self.status = status
        self.message = message
        self.fields = fields


def error_response(status, message, fields=None):
    body = {"status": status, "message": message}
    if fields:
        body["fields"] = fields
    return jsonify({"error": body}), status


def register_error_handlers(app):
    @app.errorhandler(ApiError)
    def handle_api_error(err):
        return error_response(err.status, err.message, err.fields)

    @app.errorhandler(HTTPException)
    def handle_http_error(err):
        # 404 for unknown routes, 405 for wrong methods, and so on
        return error_response(err.code, err.description)

    @app.errorhandler(Exception)
    def handle_unexpected_error(err):
        app.logger.exception("Unhandled error: %s", err)
        return error_response(500, "Something went wrong on the server.")

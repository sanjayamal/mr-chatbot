from functools import wraps
from flask import request, jsonify
from helper.cognito.jwt_verify import jwt_verify


def jwt_verify_middleware(f):
    @wraps(f)
    def decorator(*args, **kwargs):
        token = None
        if "Authorization" in request.headers:
            token = request.headers["Authorization"].split(" ")[1]

        if not token:
            return jsonify({"message": "Unauthorized"}), 401

        current_user = jwt_verify(token)
        if (current_user):
            return f(current_user, *args, **kwargs)

        return jsonify({"message": "Unauthorized"}), 401

    return decorator

from flask import request, Blueprint, Response
from flask_cors import cross_origin

from repositories.user_repository import UserRepository
from services.user_service import UserService
from middleware.jwt_verify_middleware import jwt_verify_middleware

user_bp = Blueprint('user_bp', __name__)
user_repository = UserRepository()
user_service = UserService(user_repository)


@user_bp.before_request
def basic_authentication():
    if request.method.lower() == 'options':
        return Response()


@cross_origin(supports_credentials=True)
@user_bp.route('/api/v1/review-create', methods=['POST'])
@jwt_verify_middleware
def create_review(current_user):
    # get user detail
    user_id = current_user['sub']

    data = request.get_json()

    name = data.get("name")
    content = data.get("content")
    rate = data.get("rate")

    if not (name and name.strip()):
        name = current_user['name']

    response = user_service.create_review(user_id, name, content, rate)
    return response


@cross_origin(supports_credentials=True)
@user_bp.route('/api/v1/reviews', methods=['GET'])
def get_reviews():
    response = user_service.get_reviews()
    return response

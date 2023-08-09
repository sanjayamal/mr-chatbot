import uuid

from flask import jsonify

from constants import common_constants
from entities.model import Review


class UserService:

    def __init__(self, user_repository):
        self.user_repository = user_repository

    def create_review(self, user_id, name, content, rate):
        try:
            review_id = uuid.uuid4()
            review_record = Review(
                id=review_id,
                name=name,
                content=content,
                rate=rate,
                is_approved=True,
                user_id=user_id
            )
            try:
                self.user_repository.add_review(review_record)
                return jsonify({
                    'title': common_constants.review_creation_success_title,
                    'message': common_constants.review_retrain_success_msg
                }), 200
            except Exception as e:
                return jsonify(
                    {
                        'error': {
                            'type': common_constants.internal_server_error_type,
                            'title': common_constants.internal_server_error_title,
                            'message': common_constants.add_review_error_msg
                        }
                    }), 500
        except Exception as e:
            return jsonify({
                    'error': {
                        'type': common_constants.internal_server_error_type,
                        'title': common_constants.internal_server_error_title,
                        'message': common_constants.add_review_error_msg
                    }
            }), 500

    def get_reviews(self):
        try:
            reviews = self.user_repository.get_reviews()
            return jsonify([review.json() for review in reviews]), 200
        except Exception as e:
            return jsonify({
                'error': {
                    'type': common_constants.internal_server_error_type,
                    'title': common_constants.internal_server_error_title,
                    'message': common_constants.get_reviews_error_msg
                }
            }), 500

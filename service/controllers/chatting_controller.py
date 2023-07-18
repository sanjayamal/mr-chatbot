import json
from flask import request, Blueprint, Response
from repositories.chatting_repositoy import ChattingRepository
from flask_cors import cross_origin

from services.chatting_service import ChattingService

chatting_bp = Blueprint('chatting_bp', __name__)
chatting_repository = ChattingRepository()
chatting_service = ChattingService(chatting_repository)


@chatting_bp.before_request
def basic_authentication():
    if request.method.lower() == 'options':
        return Response()


@cross_origin(supports_credentials=True)
@chatting_bp.route('/api/v1/bot/web-chat/<string:chatbot_id>', methods=['POST'])
def get_bot_answer(chatbot_id):
    # get user detail
    user_id = '550aa922-e98c-477c-9766-0cbea52de9de'

    referrer = request.referrer
    if referrer is not None:
        if referrer.endswith('/'):
            referrer = referrer.rstrip('/')

    dict_str = request.data.decode("UTF-8")
    data = json.loads(dict_str)
    client_ip = request.remote_addr
    user_agent = request.headers.get('User-Agent')

    response = chatting_service.get_bot_answer(user_id, chatbot_id, referrer, data, client_ip, user_agent)
    return response


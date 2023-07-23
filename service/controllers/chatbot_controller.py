from flask import request, Blueprint, current_app
from middleware.jwt_verify_middleware import jwt_verify_middleware
from repositories.channel_repository import ChannelRepository
from services.chatbot_service import ChatbotService
from repositories.chatbot_repository import ChatbotRepository
from flask_cors import cross_origin

chatbot_bp = Blueprint('chatbot_bp', __name__)
chatbot_repository = ChatbotRepository()
channel_repository = ChannelRepository()
chatbot_service = ChatbotService(chatbot_repository, channel_repository)


@chatbot_bp.route('/api/v1/bot-create', methods=['POST'])
def create_bot():
    # get user detail
    user_id = '550aa922-e98c-477c-9766-0cbea52de9de'

    # extract request body
    files = request.files.getlist('files')
    chatbot_name = request.form['name']
    text_source = request.form['text']
    description = request.form['description']
    response = chatbot_service.create_chatbot(
        current_app._get_current_object(),
        user_id,
        files,
        chatbot_name,
        text_source,
        description)
    return response


@chatbot_bp.route('/api/v1/bots', methods=['get'])
@cross_origin(supports_credentials=True)
@jwt_verify_middleware
def get_bots(current_user):
    user_id = '550aa922-e98c-477c-9766-0cbea52de9de'
    response = chatbot_service.get_chatbots(user_id)
    return response


@chatbot_bp.route('/api/v1/bot/<string:bot_id>', methods=['get'])
def get_bot(bot_id):
    user_id = '550aa922-e98c-477c-9766-0cbea52de9de'
    response = chatbot_service.get_chatbot_by_id(bot_id, user_id)
    return response


@chatbot_bp.route('/api/v1/process-source', methods=['POST'])
@cross_origin(supports_credentials=True)
def process_source():
    files = request.files.getlist('files')
    response = chatbot_service.process_source(files)
    return response


@chatbot_bp.route('/api/v1/bot/<string:bot_id>/publish-details',
                  methods=['get'])
@cross_origin(supports_credentials=True)
def get_bot_publish_detail(bot_id):
    response = chatbot_service.get_chatbot_publish_detail_by_id(bot_id)
    return response


@chatbot_bp.route(
    '/api/v1/bot/<string:bot_id>/web-channel/<string:chatbot_channel_id>/publish-details',
    methods=['PUT'])
@cross_origin(supports_credentials=True)
def update_bot_publish_detail(bot_id, chatbot_channel_id):
    user_id = '550aa922-e98c-477c-9766-0cbea52de9de'
    response = chatbot_service.update_chatbot_publish_detail(
        user_id, bot_id, chatbot_channel_id)
    return response


@chatbot_bp.route('/api/v1/bot/<string:bot_id>/setting-details',
                  methods=['get'])
@cross_origin(supports_credentials=True)
def get_bot_setting_detail(bot_id):
    user_id = '550aa922-e98c-477c-9766-0cbea52de9de'
    response = chatbot_service.get_chatbot_setting_detail_by_id(user_id, bot_id)
    return response


@chatbot_bp.route('/api/v1/bot/<string:bot_id>/setting-details',
                  methods=['PUT'])
@cross_origin(supports_credentials=True)
def update_bot_setting_detail(bot_id):
    user_id = '550aa922-e98c-477c-9766-0cbea52de9de'
    response = chatbot_service.update_chatbot_setting_detail(user_id, bot_id)
    return response


@chatbot_bp.route('/api/v1/bot/<string:bot_id>/data-source', methods=['get'])
@cross_origin(supports_credentials=True)
def get_bot_data_source(bot_id):
    user_id = '550aa922-e98c-477c-9766-0cbea52de9de'
    response = chatbot_service.get_chatbot_data_source(bot_id, user_id)
    return response


@chatbot_bp.route('/api/v1/bot/<string:bot_id>/remove-data-source',
                  methods=['POST'])
@cross_origin(supports_credentials=True)
def remove_source(bot_id):
    data = request.get_json()
    files_to_remove = data.get("filesToRemove")

    user_id = '550aa922-e98c-477c-9766-0cbea52de9de'
    response = chatbot_service.remove_source(bot_id, user_id, files_to_remove)
    return response


@chatbot_bp.route('/api/v1/bot/<string:bot_id>/retrain', methods=['POST'])
@cross_origin(supports_credentials=True)
def retrain_bot(bot_id):
    files = request.files.getlist('files')
    text_source = request.form.get('text', '')

    user_id = '550aa922-e98c-477c-9766-0cbea52de9de'
    response = chatbot_service.retrain_bot(
        current_app._get_current_object(),
        user_id,
        bot_id,
        files,
        text_source)
    return response

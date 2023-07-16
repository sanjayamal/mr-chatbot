from flask import Flask, request, jsonify, Blueprint, current_app

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
    response = chatbot_service.create_chatbot(current_app._get_current_object(),user_id, files, chatbot_name, text_source, description)
    return response


@chatbot_bp.route('/api/v1/bots', methods=['get'])
@cross_origin(supports_credentials=True)
def get_bots():
    user_id = '550aa922-e98c-477c-9766-0cbea52de9de'
    response = chatbot_service.get_chatbots(user_id)
    return response



@chatbot_bp.route('/api/v1/<string:user_id>/bot/<string:bot_id>', methods=['get'])
def get_bot(user_id, bot_id):
    return 'Hello, World I am new bot!'


@chatbot_bp.route('/api/v1/process-source', methods=['POST'])
@cross_origin(supports_credentials=True)
def process_source():
    try:
        current_app.logger.info('processing start')
        files = request.files.getlist('files')
        current_app.logger.info('processing files')
        response = chatbot_service.process_source(files)

        return jsonify(response), 200
    except Exception as err:
        return jsonify({
            # put error here
        }), 500


from flask import Flask, request, jsonify, Blueprint
from services.chatbot_service import ChatbotService
from repositories.chatbot_repository import ChatbotRepository

chatbot_bp = Blueprint('chatbot_bp',__name__)
chatbot_repository = ChatbotRepository()
chatbot_service = ChatbotService(chatbot_repository)

@chatbot_bp.route('/api/v1/<string:user_id>/bot', methods=['POST'])
def create_bot():

    return 'Hello, World!'


@chatbot_bp.route('/api/v1/<string:user_id>/bots', methods=['get'])
def get_bots(user_id):
    return 'Hello, World!'


@chatbot_bp.route('/api/v1/<string:user_id>/bot/<string:bot_id>', methods=['get'])
def get_bot(user_id, bot_id):
    return 'Hello, World I am new bot!'


@chatbot_bp.route('/api/v1/process-source', methods=['POST'])
def process_source():
    try:
        files = request.files.getlist('files')
        response = chatbot_service.process_source(files)

        return jsonify(response), 200
    except Exception as err:
        return jsonify({
            # put error here
        }), 500


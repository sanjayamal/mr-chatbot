from datetime import datetime
from flask import jsonify
from constants.common_constants import not_found_error_type, get_chatbot_not_found_error_title, \
    get_chatbot_not_found_error_msg, internal_server_error_type, internal_server_error_title, \
    add_chat_history_error_msg
from controllers.chatbot_controller import chatbot_service
from entities.model import ChatbotChannelHistory
from helper.pinecone.generate import process_content


class ChattingService:
    def __init__(self, chatting_repository):
        self.chatting_repository = chatting_repository

    def get_bot_answer(
            self,
            user_id,
            chatbot_id,
            referrer,
            data,
            client_ip,
            user_agent):
        chatbot, status = chatbot_service.get_chatbot_by_id(chatbot_id, None)

        if status != 200:
            return jsonify({
                'error': {
                    'type': not_found_error_type,
                    'title': get_chatbot_not_found_error_title,
                    'message': get_chatbot_not_found_error_msg
                }
            }), 404

        web_channel_id = None
        if len(chatbot['webChannels']) > 0:
            web_channel_id = chatbot['webChannels'][0]['chatbotChannelId']

        session_id = data['id']

        metadata = {
            'referrer': referrer,
            'client_ip': client_ip,
            'browser': user_agent,
            'session_id': session_id
        }
        history_id = self.persist_chat_history(
            web_channel_id, data['question'], None, metadata)
        chat_history = data['history']

        result = process_content(
            data['question'], [
                tuple(history) for history in chat_history], chatbot)

        chat_history.append((data['question'], result['answer']))

        update_history_response = self.update_chat_history(
            history_id, None, None, result['answer'], None)

        if not update_history_response:
            return jsonify({
                'error': {
                    'type': internal_server_error_type,
                    'title': internal_server_error_title,
                    'message': get_chatbot_not_found_error_msg
                }
            }), 500

        return jsonify({
            'result': {
                'answer': result['answer'],
                'history': chat_history
            }
        }), 200

    def persist_chat_history(self, channel_id, question, answer, metadata):
        try:
            bot_history_record = ChatbotChannelHistory(
                chatbot_channel_id=channel_id,
                history_metadata=metadata,
                human_message=question,
                ai_message=answer,
                human_message_time=datetime.now()
            )
            try:
                history_id = self.chatting_repository.add_chat_history(
                    bot_history_record)
                return history_id
            except Exception as e:
                return None
        except Exception as e:
            return None, (
                {
                    'error': {
                        'type': internal_server_error_type,
                        'title': internal_server_error_title,
                        'message': add_chat_history_error_msg
                    }
                }
            ), 500

    def update_chat_history(
            self,
            history_id,
            channel_id,
            question,
            answer,
            metadata):
        try:
            bot_history_record = self.chatting_repository.get_chatbot_channel_history(
                history_id)
            if bot_history_record:
                if channel_id is not None:
                    bot_history_record.chatbot_channel_id = channel_id
                if question is not None:
                    bot_history_record.human_message = question
                if answer is not None:
                    bot_history_record.ai_message = answer
                    bot_history_record.ai_message_time = datetime.now()
                if metadata is not None:
                    bot_history_record.history_metadata = metadata

                bot_history_record.updated_at = datetime.now()

                try:
                    self.chatting_repository.update_chat_history(
                        bot_history_record)
                    return True
                except Exception as e:
                    return False
            else:
                return False
        except Exception as e:
            return None, (
                {
                    'error': {
                        'type': internal_server_error_type,
                        'title': internal_server_error_title,
                        'message': add_chat_history_error_msg
                    }
                }
            ), 500

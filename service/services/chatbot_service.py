import threading
import uuid

from constants.chatbot import channel_web_type
from constants.common_constants import internal_server_error_type, internal_server_error_title, \
    chatbot_creation_error_msg, chatbot_creation_success_msg, get_chatbots_error_msg, chatbot_creation_success_title, \
    get_chatbots_not_found_error_msg, get_chatbots_not_found_error_title, not_found_error_type
from entities.model import Chatbot, ChatbotChannelMain
from flask import jsonify
from helper.pinecone.pinecone_upload import run_upload_to_pinecone
from helper.process_file import get_character_count_in_pdf
from helper.upload_files import upload_files_to_store
from constants.defualtChatbotSetting import model, prompt_message, temperature,initial_message,user_message_color,chat_bubble_color


class ChatbotService:

    def __init__(self, chatbot_repository, channel_repository):
        self.chatbot_repository = chatbot_repository
        self.channel_repository = channel_repository


    def process_source(self, files):
        try:

            file_character_count = []

            if files is not None:
                for file in files:
                    character_count = get_character_count_in_pdf(file)
                    file_character_count.append({
                        'name': file.filename,
                        'count': character_count
                    })

            return {
                "files": file_character_count
            }
        except Exception as err:
            return err


    def create_chatbot(self,app,user_id, files, chatbot_name,text_source,description):

        # validate user privilege - How many bots can create

        # calculate source character count
        source_char_count = len(text_source)
        for file in files:
            character_count = get_character_count_in_pdf(file)
            source_char_count += character_count

        # prepare  chatbot detail object
        try:
            chatbot_id = uuid.uuid4()
            chatbot = Chatbot(
                id=chatbot_id,
                user_id=user_id,
                name=chatbot_name,
                model=model,
                temperature=temperature,
                prompt_message=prompt_message,
                text_source=text_source,
                number_of_characters=source_char_count,
                status=0,
                description=description
            )

            # create web channel
            chatbot_channel_id = uuid.uuid4()
            chatbot_channel = ChatbotChannelMain(
                id=chatbot_channel_id,
                chatbot_id=chatbot_id,
                initial_message=initial_message,
                display_name='',
                profile_picture_url='',
                user_message_color=user_message_color,
                chat_bubble_color=chat_bubble_color,
                type=channel_web_type
            )
            # upload files

            file_object_names, err = upload_files_to_store(files,user_id,chatbot_id)

            if err is not None:
                return jsonify({
                    'error': {
                        'type': internal_server_error_type,
                        'title': internal_server_error_title,
                        'message': chatbot_creation_error_msg
                    }
                }), 500

            # commit to DB create_chatbot(chatbot, chatbot_channel)
            try:
                self.chatbot_repository.add_chatbot(chatbot)
                self.channel_repository.add_channel_main(chatbot_channel)
            except Exception as e:
                print(e)
                return jsonify({
                    'error': {
                        'type': internal_server_error_type,
                        'title': internal_server_error_title,
                        'message': chatbot_creation_error_msg
                    }
                }), 500

            # upload source to vector DB
            thread = threading.Thread(target=run_upload_to_pinecone,
                                      args=(
                                          app, file_object_names, text_source, user_id + "_" + str(chatbot_id),str(chatbot_id)))
            thread.start()

            # return success message - It will take sometime to upload vector source
            return jsonify({
                'title': chatbot_creation_success_title,
                'message': chatbot_creation_success_msg
            }), 200
        except Exception as e:
            return jsonify({
                'error': {
                    'type': internal_server_error_type,
                    'title': internal_server_error_title,
                    'message': chatbot_creation_error_msg
                }
            }), 500

    def get_chatbots(self,user_id):
        try:
            chatbots = self.chatbot_repository.get_chatbots_by_user_id(user_id)
            return jsonify([bot.json() for bot in chatbots]),200
        except Exception as error:
            return jsonify({
                'error': {
                    'type': internal_server_error_type,
                    'title': internal_server_error_title,
                    'message': get_chatbots_error_msg
                }
            }), 500


    def get_chatbot_by_id(self,user_id,chatbot_id):
        try:
            chatbot = self.chatbot_repository.get_chatbot_by_chatbot_id(chatbot_id)

            if chatbot is None or chatbot.user_id != user_id:
                return jsonify({
                    'error': {
                        'type': not_found_error_type,
                        'title': get_chatbots_not_found_error_title,
                        'message': get_chatbots_not_found_error_msg
                    }
                }), 404

            chatbot_json = chatbot.json()
            channels = chatbot.channels

            web_channels = [channel for channel in channels if
                            isinstance(channel, ChatbotChannelMain) and channel.type == channel_web_type and channel.deleted_at is None]

            web_channels_json = []

            for web_channel in web_channels:
                web_channel_json = web_channel.json()
                web_channels_json.append(web_channel_json)

            chatbot_json['webChannels'] = web_channels_json

            return chatbot_json, 200
        except Exception as error:
            return jsonify({
                'error': {
                    'type': internal_server_error_type,
                    'title': internal_server_error_title,
                    'message': get_chatbots_error_msg
                }
            }), 500

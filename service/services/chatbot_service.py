import os
import threading
import uuid

import boto3

from constants.chatbot import channel_web_type
from constants import common_constants
from entities.model import Chatbot, ChatbotChannelMain
from flask import jsonify, request
from helper.pinecone.pinecone_upload import run_upload_to_pinecone
from helper.process_file import get_character_count_in_pdf
from helper.s3.s3_helper_functions import get_object_url
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

            return jsonify({
                "files": file_character_count
            }), 200
        except Exception as err:
            return jsonify({
                'error': {
                    'type': common_constants.not_found_error_type,
                    'title': common_constants.internal_server_error_title,
                    'message': common_constants.data_source_processing_error_msg
                }
            }), 500

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
                        'type': common_constants.internal_server_error_type,
                        'title': common_constants.internal_server_error_title,
                        'message': common_constants.chatbot_creation_error_msg
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
                        'type': common_constants.internal_server_error_type,
                        'title': common_constants.internal_server_error_title,
                        'message': common_constants.chatbot_creation_error_msg
                    }
                }), 500

            # upload source to vector DB
            thread = threading.Thread(target=run_upload_to_pinecone,
                                      args=(
                                          app, file_object_names, text_source, user_id + "_" + str(chatbot_id),str(chatbot_id)))
            thread.start()

            # return success message - It will take sometime to upload vector source
            return jsonify({
                'title': common_constants.chatbot_creation_success_title,
                'message': common_constants.chatbot_creation_success_msg
            }), 200
        except Exception as e:
            return jsonify({
                'error': {
                    'type': common_constants.internal_server_error_type,
                    'title': common_constants.internal_server_error_title,
                    'message': common_constants.chatbot_creation_error_msg
                }
            }), 500

    def get_chatbots(self, user_id):
        try:
            chatbots = self.chatbot_repository.get_chatbots_by_user_id(user_id)
            return jsonify([bot.json() for bot in chatbots]), 200
        except Exception as error:
            return jsonify({
                'error': {
                    'type': common_constants.internal_server_error_type,
                    'title': common_constants.internal_server_error_title,
                    'message': common_constants.get_chatbots_error_msg
                }
            }), 500

    def get_chatbot_by_id(self, user_id, chatbot_id):
        try:
            chatbot = self.chatbot_repository.get_chatbot_by_chatbot_id(chatbot_id)

            if chatbot is None or chatbot.user_id != user_id:
                return jsonify({
                    'error': {
                        'type': common_constants.not_found_error_type,
                        'title': common_constants.get_chatbot_not_found_error_title,
                        'message': common_constants.get_chatbot_not_found_error_msg
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
                    'type': common_constants.internal_server_error_type,
                    'title': common_constants.internal_server_error_title,
                    'message': common_constants.get_chatbots_error_msg
                }
            }), 500

    def get_chatbot_publish_detail_by_id(self, user_id, chatbot_id):
        try:
            chatbot = self.chatbot_repository.get_chatbot_by_chatbot_id(chatbot_id)

            if chatbot is None or chatbot.user_id != user_id:
                return jsonify({
                    'error': {
                        'type': common_constants.not_found_error_type,
                        'title': common_constants.get_chatbot_not_found_error_title,
                        'message': common_constants.get_chatbot_not_found_error_msg
                    }
                }), 404

            channels = chatbot.channels

            web_channels = [channel for channel in channels if
                            isinstance(channel,
                                       ChatbotChannelMain) and channel.type == channel_web_type and channel.deleted_at is None]

            web_channel_json = web_channels[0].json()
            return web_channel_json, 200
        except Exception as error:
            return jsonify({
                'error': {
                    'type': common_constants.internal_server_error_type,
                    'title': common_constants.internal_server_error_title,
                    'message': common_constants.get_chatbots_error_msg
                }
            }), 500

    def update_chatbot_publish_detail(self, user_id, chatbot_id, chatbot_channel_id):
        try:
            web_channel = self.channel_repository.get_web_channel(chatbot_channel_id)

            if web_channel is None:
                return jsonify({
                    'error': {
                        'type': common_constants.not_found_error_type,
                        'title': common_constants.get_chatbot_not_found_error_title,
                        'message': common_constants.get_chatbot_not_found_error_msg
                    }
                }), 404

            if web_channel.chatbot.user_id != user_id:
                return jsonify(
                    {
                        'error': {
                            'type': common_constants.forbidden_error_type,
                            'title': common_constants.forbidden_error_title,
                            'message': common_constants.forbidden_error_msg,
                        }
                    }
                ), 403

            profile_pic = request.files.get('profilePictureUrl')
            profile_picture_url = ''

            s3 = boto3.client('s3')

            if profile_pic is not None:
                try:
                    bucket_name = os.getenv("PUBLIC_S3_BUCKET")
                    file_dir = 'chatbot-profile/' + user_id + '/chatbot/' + str(
                        web_channel.chatbot.id) + '/channel/' + str(chatbot_channel_id)

                    file_data = profile_pic.read()
                    file_length = len(file_data)
                    profile_pic.seek(0)  # Reset the file pointer to the beginning
                    object_name = file_dir + "/" + profile_pic.filename

                    response = s3.upload_fileobj(profile_pic, bucket_name, object_name,
                                                 ExtraArgs={'ACL': 'public-read'})
                    if response is None:
                        profile_picture_url = get_object_url(bucket_name, object_name)

                    web_channel.profile_picture_url = profile_picture_url
                except Exception as error:
                    return jsonify({
                        'error': {
                            'type': common_constants.internal_server_error_type,
                            'title': common_constants.internal_server_error_title,
                            'message': common_constants.update_chatbot_detail_error_msg
                        }
                    }), 500

            web_channel.initial_message = request.form.get('initialMessage', web_channel.initial_message)
            web_channel.display_name = request.form.get('displayName', web_channel.display_name)
            web_channel.user_message_color = request.form.get('userMessageColor', web_channel.user_message_color)
            web_channel.chat_bubble_color = request.form.get('chatBubbleColor', web_channel.chat_bubble_color)

            self.channel_repository.update_web_channel(web_channel)
            return jsonify({
                'title': common_constants.chatbot_updated_success_title,
                'message': common_constants.chatbot_updated_success_msg
            }), 200

        except Exception as error:
            return jsonify({
                'error': {
                    'type': common_constants.internal_server_error_type,
                    'title': common_constants.internal_server_error_title,
                    'message': common_constants.update_chatbot_detail_error_msg
                }
            }), 500

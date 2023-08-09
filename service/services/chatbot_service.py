import io
import os
import threading
import uuid
from constants.chatbot import channel_web_type
from constants import common_constants
from entities.model import Chatbot, ChatbotChannelMain
from flask import jsonify, request

from helper.pinecone.pinecone_api import delete_pinecone_index
from helper.pinecone.pinecone_upload import run_upload_to_pinecone
from helper.process_file import get_character_count_in_pdf
from helper.s3.s3_helper_functions import get_object_url
from helper.s3.s3_store import get_s3_file_names, get_s3_object, delete_s3_files, get_S3_client
from helper.upload_files import upload_files_to_store
from constants.defualtChatbotSetting import model, prompt_message, temperature, initial_message, user_message_color, chat_bubble_color


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

    def create_chatbot(
            self,
            app,
            user_id,
            files,
            chatbot_name,
            text_source,
            description):

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

            file_object_names, err = upload_files_to_store(
                files, user_id, chatbot_id)

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
            thread = threading.Thread(
                target=run_upload_to_pinecone,
                args=(
                    app,
                    file_object_names,
                    text_source,
                    user_id +
                    "_" +
                    str(chatbot_id),
                    str(chatbot_id)))
            thread.start()

            # return success message - It will take sometime to upload vector
            # source
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

    def get_chatbot_by_id(self, chatbot_id: object, user_id: object) -> object:
        try:
            chatbot = self.chatbot_repository.get_chatbot_by_chatbot_id(
                chatbot_id)

            if user_id is not None:
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

            web_channels = [
                channel for channel in channels if isinstance(
                    channel,
                    ChatbotChannelMain) and channel.type == channel_web_type and channel.deleted_at is None]

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

    def get_chatbot_publish_detail_by_id(self, chatbot_id):
        try:
            chatbot = self.chatbot_repository.get_chatbot_by_chatbot_id(
                chatbot_id)
            channels = chatbot.channels
            web_channels = [
                channel for channel in channels if isinstance(
                    channel,
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

    def update_chatbot_publish_detail(
            self, user_id, chatbot_id, chatbot_channel_id):
        try:
            web_channel = self.channel_repository.get_web_channel(
                chatbot_channel_id)

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

            s3_client = get_S3_client()

            if profile_pic is not None:
                try:
                    bucket_name = os.getenv("PUBLIC_S3_BUCKET")
                    file_dir = 'chatbot-profile/' + user_id + '/chatbot/' + str(
                        web_channel.chatbot.id) + '/channel/' + str(chatbot_channel_id)

                    file_data = profile_pic.read()
                    file_length = len(file_data)
                    # Reset the file pointer to the beginning
                    profile_pic.seek(0)
                    object_name = file_dir + "/" + profile_pic.filename

                    response = s3_client.upload_fileobj(
                        profile_pic, bucket_name, object_name, ExtraArgs={
                            'ACL': 'public-read'})
                    if response is None:
                        profile_picture_url = get_object_url(
                            bucket_name, object_name)

                    web_channel.profile_picture_url = profile_picture_url
                except Exception as error:
                    return jsonify({
                        'error': {
                            'type': common_constants.internal_server_error_type,
                            'title': common_constants.internal_server_error_title,
                            'message': common_constants.update_chatbot_detail_error_msg
                        }
                    }), 500

            web_channel.initial_message = request.form.get(
                'initialMessage', web_channel.initial_message)
            web_channel.display_name = request.form.get(
                'displayName', web_channel.display_name)
            web_channel.user_message_color = request.form.get(
                'userMessageColor', web_channel.user_message_color)
            web_channel.chat_bubble_color = request.form.get(
                'chatBubbleColor', web_channel.chat_bubble_color)

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

    def get_chatbot_setting_detail_by_id(self, user_id, chatbot_id):
        try:
            chatbot = self.chatbot_repository.get_chatbot_by_chatbot_id(
                chatbot_id)

            if chatbot is None or chatbot.user_id != user_id:
                return jsonify({
                    'error': {
                        'type': common_constants.not_found_error_type,
                        'title': common_constants.get_chatbot_not_found_error_title,
                        'message': common_constants.get_chatbot_not_found_error_msg
                    }
                }), 404

            chatbot_json = chatbot.json()
            return chatbot_json, 200
        except Exception as error:
            return jsonify({
                'error': {
                    'type': common_constants.internal_server_error_type,
                    'title': common_constants.internal_server_error_title,
                    'message': common_constants.get_chatbots_error_msg
                }
            }), 500

    def update_chatbot_setting_detail(self, user_id, chatbot_id):
        try:
            chatbot = self.chatbot_repository.get_chatbot_by_chatbot_id(
                chatbot_id)

            if chatbot is None:
                return jsonify({
                    'error': {
                        'type': common_constants.not_found_error_type,
                        'title': common_constants.get_chatbot_not_found_error_title,
                        'message': common_constants.get_chatbot_not_found_error_msg
                    }
                }), 404

            if chatbot.user_id != user_id:
                return jsonify(
                    {
                        'error': {
                            'type': common_constants.forbidden_error_type,
                            'title': common_constants.forbidden_error_title,
                            'message': common_constants.forbidden_error_msg,
                        }
                    }
                ), 403

            chatbot.name = request.form.get('name', chatbot.name)
            chatbot.prompt_message = request.form.get(
                'promptMessage', chatbot.prompt_message)
            chatbot.model = request.form.get('model', chatbot.model)
            chatbot.temperature = request.form.get(
                'temperature', chatbot.temperature)
            chatbot.description = request.form.get(
                'description', chatbot.description)

            self.chatbot_repository.update_chatbot_setting(chatbot)
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

    def get_chatbot_data_source(self, chatbot_id, user_id,):
        try:
            chatbot = self.chatbot_repository.get_chatbot_by_chatbot_id(
                chatbot_id)

            if chatbot is None or chatbot.user_id != user_id:
                return jsonify({
                    'error': {
                        'type': common_constants.not_found_error_type,
                        'title': common_constants.get_chatbot_not_found_error_title,
                        'message': common_constants.get_chatbot_not_found_error_msg
                    }
                }), 404

            text = chatbot.text_source
            files_character_count = chatbot.number_of_characters - len(text)

            bucket_name = os.getenv("S3_BUCKET_NAME")
            file_dir = user_id + '/chatbot/' + str(chatbot_id)
            file_names = get_s3_file_names(bucket_name, file_dir)

            return jsonify({
                'text': text,
                'files': file_names,
                'filesCharacterCount': files_character_count
            }), 200
        except Exception as Error:
            return jsonify({
                'error': {
                    'type': common_constants.internal_server_error_type,
                    'title': common_constants.internal_server_error_title,
                    'message': common_constants.update_chatbot_detail_error_msg
                }
            }), 500

    def remove_source(self, chatbot_id, user_id, files_to_remove):
        try:
            pdf_character_count = None
            if len(files_to_remove) > 0:
                file_dir = user_id + '/chatbot/' + str(chatbot_id) + '/'
                s3_file_keys = [
                    file_dir + file_name for file_name in files_to_remove]

                # load the file
                bucket_name = os.getenv("S3_BUCKET_NAME")

                try:
                    file = get_s3_object(bucket_name, s3_file_keys[0])
                except Exception as error:
                    return jsonify({
                        'error': {
                            'type': common_constants.internal_server_error_type,
                            'title': common_constants.internal_server_error_title,
                            'message': common_constants.update_chatbot_detail_error_msg
                        }
                    }), 500

                try:
                    pdf_content = file['Body'].read()
                    pdf_file = io.BytesIO(pdf_content)
                    pdf_character_count = get_character_count_in_pdf(pdf_file)

                except Exception as error:
                    return jsonify({
                        'error': {
                            'type': common_constants.internal_server_error_type,
                            'title': common_constants.internal_server_error_title,
                            'message': common_constants.update_chatbot_detail_error_msg
                        }
                    }), 500

                try:
                    delete_s3_files(bucket_name, s3_file_keys)
                except Exception as error:
                    return jsonify({
                        'error': {
                            'type': common_constants.internal_server_error_type,
                            'title': common_constants.internal_server_error_title,
                            'message': common_constants.delete_chatbot_data_source_error_msg
                        }
                    }), 500

            chatbot = self.chatbot_repository.get_chatbot_by_chatbot_id(
                chatbot_id)

            if pdf_character_count is not None:
                chatbot.number_of_characters = chatbot.number_of_characters - pdf_character_count

            files_character_count = chatbot.number_of_characters - \
                len(chatbot.text_source)

            self.chatbot_repository.update_chatbot_commit(chatbot)

            return jsonify({
                'filesCharacterCount': files_character_count
            }), 200
        except Exception as error:
            return jsonify({
                'error': {
                    'type': common_constants.internal_server_error_type,
                    'title': common_constants.internal_server_error_title,
                    'message': common_constants.delete_chatbot_data_source_error_msg
                }
            }), 500

    def retrain_bot(self, app, user_id, chatbot_id, files, text_source):
        try:
            # count new data source character
            new_source_character_count = len(text_source)
            for file in files:
                character_count = get_character_count_in_pdf(file)
                new_source_character_count += character_count

            # update files to s3 bucket
            _, err = upload_files_to_store(files, user_id, chatbot_id)
            if err is not None:
                return jsonify({
                    'error': {
                        'type': common_constants.internal_server_error_type,
                        'title': common_constants.internal_server_error_title,
                        'message': common_constants.retrain_chatbot_error_msg
                    }
                }), 500

            # update data source count
            chatbot = Chatbot.query.get(chatbot_id)
            if chatbot:
                chatbot.number_of_characters = chatbot.number_of_characters - \
                    len(chatbot.text_source) + new_source_character_count
                chatbot.text_source = text_source
                self.chatbot_repository.update_chatbot_commit(chatbot)
            else:
                return jsonify({
                    'error': {
                        'type': common_constants.internal_server_error_type,
                        'title': common_constants.internal_server_error_title,
                        'message': common_constants.retrain_chatbot_error_msg
                    }
                }), 500

            # get existing files
            bucket_name = os.getenv("S3_BUCKET_NAME")
            file_dir = user_id + '/chatbot/' + str(chatbot_id)
            existing_files = get_s3_file_names(bucket_name, file_dir)
            file_object_names = []  # to send to pinecone
            if len(existing_files) > 0:
                file_object_names = [
                    file_dir + "/" + file_name for file_name in existing_files]

            namespace = user_id + '_' + str(chatbot_id)

            try:
                delete_pinecone_index(namespace)
            except Exception as error:
                return jsonify({
                    'error': {
                        'type': common_constants.internal_server_error_type,
                        'title': common_constants.internal_server_error_title,
                        'message': common_constants.retrain_chatbot_error_msg
                    }
                }), 500

                # upload source to vector DB
            thread = threading.Thread(
                target=run_upload_to_pinecone,
                args=(
                    app,
                    file_object_names,
                    text_source,
                    user_id +
                    "_" +
                    str(chatbot_id),
                    str(chatbot_id)))
            thread.start()

            return jsonify({
                'title': common_constants.chatbot_retrain_success_title,
                'message': common_constants.chatbot_retrain_success_msg
            }), 200
        except Exception as error:
            return jsonify({
                'error': {
                    'type': common_constants.internal_server_error_type,
                    'title': common_constants.internal_server_error_title,
                    'message': common_constants.retrain_chatbot_error_msg
                }
            }), 500

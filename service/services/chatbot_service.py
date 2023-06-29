import threading
import uuid
from entities.model import Chatbot, ChatbotChannelMain
from flask import jsonify

from helper.pinecone_upload import run_upload_to_pinecone
from helper.process_file import get_character_count_in_pdf
from helper.upload_files import upload_files_to_store
from constants.defualtChatbotSetting import model, prompt_message, temperature,initial_message,user_message_color,chat_bubble_color


class ChatbotService:

    def __init__(self, chatbot_repository):
        self.chatbot_repository = chatbot_repository

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
                type='web'
            )
            # upload files
            file_object_names ,err = upload_files_to_store(files,user_id,chatbot_id)

            # commit to DB
            self.chatbot_repository.create_chatbot(chatbot,chatbot_channel)

            # upload source to vector DB
            thread = threading.Thread(target=run_upload_to_pinecone,
                                      args=(
                                          app, file_object_names, text_source, user_id + "_" + str(chatbot_id)))
            thread.start()

            # return success message - It will take sometime to upload vector source
            return jsonify({
                'message' : 'Bot creation successful'
            }),200
        except Exception as e:
            print(e)
            return jsonify({
                'message' : 'Bot creation fail'
            }),500


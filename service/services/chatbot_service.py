from flask import jsonify
from helper.process_file import get_character_count_in_pdf


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
                        'name': file.name,
                        'count': character_count
                    })

            return jsonify({
                "files": file_character_count
            })
        except Exception as err:
            return err


    def create_chatbot(self):
        # validate user privilege - How many bots can create
        # calculate source character count
        # prepare  chatbot detail object
        # create web channel
        # upload files
        # commit to DB
        # upload source to vector DB
        # return success message - It will take sometime to upload vector source
        return ''
from entities.model import db


class ChatbotRepository:

    def __int__(self):
        self.db = db

    def create_chatbot(self, chatbot, chatbot_channel_main=None):
        db.session.add(chatbot)
        if chatbot_channel_main is not None:
            db.session.add(chatbot_channel_main)
        db.session.commit()

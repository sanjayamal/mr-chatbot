from sqlalchemy.orm import joinedload

from entities.model import db, Chatbot,ChatbotChannel





class ChatbotRepository:

    def __int__(self):
        self.db = db

    def add_chatbot(self, chatbot):
        db.session.add(chatbot)
        db.session.commit()

    def get_chatbots_by_user_id(self, user_id):
        try:
            chatbots =Chatbot.query.filter_by(user_id=user_id).all()
            return chatbots
        except Exception as err:
            print(err)
            return err

    def get_chatbot_by_chatbot_id(self, chatbot_id):
        try:
            chatbot =Chatbot.query.options(
                joinedload(Chatbot.channels),
                joinedload(Chatbot.channels).joinedload(ChatbotChannel.channel_main),
            )\
                .filter_by(id=chatbot_id).first()
            return chatbot
        except Exception as err:
            print(err)
            return err
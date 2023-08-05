from sqlalchemy.orm import joinedload
from entities.model import db, Chatbot, ChatbotChannel
from config.logger import createLogger


logger = createLogger(__name__)


class ChatbotRepository:

    def __int__(self):
        self.db = db

    def add_chatbot(self, chatbot):
        db.session.add(chatbot)
        db.session.commit()

    def get_chatbots_by_user_id(self, user_id):
        try:
            chatbots = Chatbot.query.filter_by(user_id=user_id).all()
            return chatbots
        except Exception as err:
            return err

    def get_chatbot_by_chatbot_id(self, chatbot_id):
        try:
            chatbot = Chatbot.query.options(
                joinedload(
                    Chatbot.channels),
                joinedload(
                    Chatbot.channels).joinedload(
                    ChatbotChannel.channel_main),
            ) .filter_by(
                id=chatbot_id).first()
            return chatbot
        except Exception as err:
            # First argument takes the msg
            # As the second arg you can pass an object with additional details
            # exc_info=True will add the stack trace to the logs (only needed
            # for logging errors inside a except block)
            logger.error(
                "Error occurred!", {
                    "Extra": "Additional key value pairs"}, exc_info=True)
            return err

    def get_chatbot_setting_detail_by_chatbot_id(self, chatbot_id):
        try:
            chatbot = Chatbot.query.filter_by(id=chatbot_id).first()
            return chatbot
        except Exception as err:
            return err

    def update_chatbot_setting(self, chatbot_setting):
        try:
            db.session.merge(chatbot_setting)
            db.session.commit()
        except Exception as error:
            print(error)

    def update_chatbot_commit(self, chatbot):
        try:
            db.session.commit()
        except Exception as error:
            db.session.rollback()

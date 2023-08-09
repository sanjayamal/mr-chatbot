from entities.model import db, ChatbotChannelHistory


class ChattingRepository:

    def __int__(self):
        self.db = db

    def add_chat_history(self, chat_history):
        try:
            db.session.add(chat_history)
            db.session.flush()
            history_id = chat_history.id
            db.session.commit()
            return history_id
        except Exception as e:
            db.session.rollback()

    def get_chatbot_channel_history(self, history_id):
        bot_history_record = ChatbotChannelHistory.query.get(history_id)
        return bot_history_record

    def update_chat_history(self, chat_history):
        try:
            db.session.commit()
        except Exception as error:
            db.session.rollback()

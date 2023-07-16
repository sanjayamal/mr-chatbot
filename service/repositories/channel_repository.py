from entities.model import db


class ChannelRepository:

    def __int__(self):
        self.db = db

    def add_channel_main(self, chatbot_channel_main):
        if chatbot_channel_main is not None:
            db.session.add(chatbot_channel_main)
        db.session.commit()

from entities.model import db, ChatbotChannelMain


class ChannelRepository:

    def __int__(self):
        self.db = db

    def add_channel_main(self, chatbot_channel_main):
        if chatbot_channel_main is not None:
            db.session.add(chatbot_channel_main)
        db.session.commit()

    def get_web_channel(self, channel_id):
        web_channel = db.session.query(ChatbotChannelMain).get(channel_id)
        return web_channel

    def update_web_channel(self, channel):
        try:
            db.session.merge(channel)
            db.session.commit()
        except Exception as error:
            print(error)

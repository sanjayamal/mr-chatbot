from entities.model import db, ChatBotChannelWebDomain


class WebDomainRepository:
    def __init__(self):
        self.db = db

    def get_web_domains_by_channel_id(self, channel_id):
        domains = ChatBotChannelWebDomain.query.filter_by(chatbot_channel_main_id=channel_id).all()
        return domains

    def delete_web_domain(self, domain):
        db.session.delete(domain)

    def add_web_domain(self, domain):
        db.session.add(domain)
        db.session.commit()


class WebDomainService:

    def __init__(self, web_domain_repository):
        self.web_domain_repository = web_domain_repository

    def get_web_domains_by_channel_id(self, channel_id):
        domains = self.get_web_domains_by_channel_id(channel_id)
        return domains

    def delete_web_domain(self, domain):
        self.web_domain_repository.delete_web_domain(domain)

import os


def validate_bot_access(chatbot, referrer):
    web_channels = chatbot["webChannels"]
    if len(web_channels) < 1:
        return False
    web_channel = web_channels[0]
    chatbot_domain = os.getenv("CHATBOT_APP_BASE_URL")
    channel_domain_names = [domain['domainName'] for domain in web_channel['domains']]
    if referrer != chatbot_domain and referrer not in channel_domain_names:
        return False
    return True

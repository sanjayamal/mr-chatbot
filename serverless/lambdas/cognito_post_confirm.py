import requests


def handler(event, context):
    r = requests.get('https://www.google.com')
    print(r.status_code)

    return event

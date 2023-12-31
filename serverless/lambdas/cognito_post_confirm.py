import os
import psycopg


def handler(event, context):
    if event['triggerSource'] != "PostConfirmation_ConfirmSignUp":
        return event
        
    with psycopg.connect(os.environ['POSTGRESQL_CONN_STR']) as conn:
        with conn.cursor() as cur:
            cur.execute("INSERT INTO users (id) VALUES (%s)",
                        (event['request']['userAttributes']['sub'], ))

            conn.commit()

    return event

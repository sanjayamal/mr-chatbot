import os
import psycopg


def handler(event, context):
    with psycopg.connect(os.environ['POSTGRESQL_CONN_STR']) as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT * FROM users")

            for record in cur:
                print(record)

            conn.commit()

    return event

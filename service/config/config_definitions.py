from environs import Env
from dotenv import load_dotenv

# load_dotenv()


class __Config:
    env = Env()

    def __init__(self) -> None:
        self.port = self.env.int('PORT')
        self.app_secret = self.env.str('APP_SECRET')

        self.postgresql_user = self.env.str('POSTGRESQL_USER')
        self.postgresql_password = self.env.str('POSTGRESQL_PASSWORD')
        self.postgresql_host = self.env.str('POSTGRESQL_HOST')
        self.postgresql_port = self.env.int('POSTGRESQL_PORT')
        self.postgresql_db = self.env.str('POSTGRESQL_DB')
        self.postgresql_con_str = "postgresql://{postgresql_user}:{postgresql_password}@{postgresql_host}:{postgresql_port}/{postgresql_db}".format(
            postgresql_user=self.postgresql_user,
            postgresql_password=self.postgresql_password,
            postgresql_host=self.postgresql_host,
            postgresql_port=self.postgresql_port,
            postgresql_db=self.postgresql_db)

        self.aws_cognito_region = self.env.str('AWS_COGNITO_REGION')
        self.aws_cognito_pool_id = self.env.str('AWS_COGNITO_POOL_ID')
        self.aws_cognito_client_id = self.env.str('AWS_COGNITO_CLIENT_ID')

        self.logger_file_path = self.env.str('LOGGER_FILE_PATH')
        self.logger_file_rotate_when = self.env.str('LOGGER_FILE_ROTATE_WHEN')
        self.logger_file_rotate_interval = self.env.int(
            'LOGGER_FILE_ROTATE_INTERVAL')
        self.logger_file_rotate_backup_count = self.env.int(
            'LOGGER_FILE_ROTATE_BACKUP_COUNT')


config = __Config()

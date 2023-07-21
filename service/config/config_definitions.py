from environs import Env


class Config:
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


config = Config()

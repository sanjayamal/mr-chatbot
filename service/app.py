from flask import Flask
from flask_migrate import Migrate, upgrade

from controllers.chatting_controller import chatting_bp
from controllers.user_controller import user_bp
from entities.model import db
from controllers.chatbot_controller import chatbot_bp
from flask_cors import CORS
from config.config_definitions import config


app = Flask(__name__)
CORS(app, supports_credentials=True)

app.config["SECRET_KEY"] = config.app_secret
app.config["SQLALCHEMY_DATABASE_URI"] = config.postgresql_con_str

db.init_app(app)
migrate = Migrate(app, db)

app.register_blueprint(chatbot_bp)
app.register_blueprint(chatting_bp)
app.register_blueprint(user_bp)

if __name__ == '__main__':
    with app.app_context():
        upgrade()
    app.run(host=config.host, port=config.port, debug=config.debug)

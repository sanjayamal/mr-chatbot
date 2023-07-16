from flask import Flask, request, jsonify
from flask_migrate import Migrate, upgrade
from entities.model import db
from dotenv import dotenv_values
from controllers.chatbot_controller import chatbot_bp
from flask_cors import CORS


app = Flask(__name__)
CORS(app, supports_credentials=True)
config = dotenv_values(".env")

app.config["SECRET_KEY"] = config.get("APP_SECRET")
app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql://"+config.get("POSTGRESQL_USER")+":"+config.get(
    "POSTGRESQL_PASSWORD")+"@"+config.get("POSTGRESQL_HOST")+":"+config.get("POSTGRESQL_PORT")+'/'+config.get(
    "POSTGRESQL_DB"
)

db.init_app(app)
migrate = Migrate(app, db)

app.register_blueprint(chatbot_bp)

if __name__ == '__main__':
    with app.app_context():
        upgrade()
    app.run()


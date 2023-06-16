from flask import Flask
from flask_migrate import Migrate
from entities.model import db
from dotenv import dotenv_values


app = Flask(__name__)
config = dotenv_values(".env")

app.config["SECRET_KEY"] = config.get("APP_SECRET")
app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql://"+config.get("POSTGRESQL_USER")+":"+config.get(
    "POSTGRESQL_PASSWORD")+"@"+config.get("POSTGRESQL_HOST")+":"+config.get("POSTGRESQL_PORT")+'/'+config.get(
    "POSTGRESQL_DB"
)

db.init_app(app)
migrate = Migrate(app, db)


@app.route('/api/v1/<string:user_id>/bot', methods=['POST'])
def create_bot():
    return 'Hello, World!'


@app.route('/api/v1/<string:user_id>/bots', methods=['get'])
def get_bots(user_id):
    return 'Hello, World!'


@app.route('/api/v1/<string:user_id>/bot/<string:bot_id>', methods=['get'])
def get_bot(user_id, bot_id):
    return 'Hello, World I am new bot!'


@app.route('/api/v1/process-source', methods=['POST'])
def process_source():
    return 'Hello, World!'


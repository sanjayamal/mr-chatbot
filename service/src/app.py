from flask import Flask

app = Flask(__name__)


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



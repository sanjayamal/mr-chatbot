from flask import Flask

app = Flask(__name__)


@app.route('/api/process-source',methods=['POST'])
def process_source():
    return 'Hello, World!'


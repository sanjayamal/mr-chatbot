from dotenv import load_dotenv
from flask_migrate import upgrade
from src.app import app


# Press the green button in the gutter to run the script.
if __name__ == '__main__':
    with app.app_context():
        upgrade()
    app.run()



from flask import Flask, jsonify
from flask_migrate import Migrate
from flask_cors import CORS
from models import db
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("SQLALCHEMY_DATABASE_URI")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = os.getenv("SQLALCHEMY_TRACK_MODIFICATIONS")
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")

db.init_app(app)
MIGRATE = Migrate(app, db)
CORS(app)

@app.route("/")
def home():
    return jsonify({"msg": "API funcionando"})

if __name__ == "__main__":
    app.run(debug=True)
from flask import Flask
from celery import Celery
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_bcrypt import Bcrypt
from flask_login import LoginManager
from flask_socketio import SocketIO
from app.config import Config
from app.gamesio.utils import create_rooms

db = SQLAlchemy()
ma = Marshmallow()
sio = SocketIO()
bcrypt = Bcrypt()

# Followed this link to instantiate Celery into our Flask app as a global
# https://blog.miguelgrinberg.com/post/celery-and-the-flask-application-factory-pattern
celery = Celery(__name__, broker=Config.CELERY_BROKER_URL, backend=Config.CELERY_BROKER_BACKEND)

login_manager = LoginManager()
login_manager.login_view = 'users.login'
login_manager.login_message_category = 'info'

# def create_app(config_class=Config):
def create_app(config_class=Config):
  app = Flask(__name__)
  app.config.from_object(Config)

  db.init_app(app)
  ma.init_app(app)
  bcrypt.init_app(app)
  login_manager.init_app(app)
  sio.init_app(app)

  # Celery doesn't have flask extenion so we need to instantiate it differently
  celery.conf.update(app.config)

  # Need to do this here so we don't have circular imports. 
  from app.users.routes import users
  from app.game.routes import game
  from app.gamesio.routes import gamesio
  from app.main.routes import main

  app.register_blueprint(main)
  app.register_blueprint(users)
  app.register_blueprint(game)
  app.register_blueprint(gamesio)

  return app


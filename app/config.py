import os, datetime


class Config:
    # Get private info from environment varialbes
    # I've commented this out for now and used literals
    # to populate the constants.

    # SECRET_KEY = os.environ.get('SECRET_KEY')
    SECRET_KEY = "1234567890"

    # SQLALCHEMY_DATABASE_URI = os.environ.get('SQLALCHEMY_DATABASE_URI')
    SQLALCHEMY_DATABASE_URI = "sqlite:///games.db"
    # SQLALCHEMY_DATABASE_URI = 'mysql://eps@localhost:3307/eps_db'
    SQLALCHEMY_BINDS = {
        # 'types': 'sqlite:///types.db',
        # 'initial': 'sqlite:///initial.db'
    }
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # COOKIE SETTINGS
    REMEMBER_COOKIE_DURATION = datetime.timedelta(hours=3)
    REMEMBER_COOKIE_REFRESH_EACH_REQUEST = True

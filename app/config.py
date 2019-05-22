import os 

class Config:
  # Get private info from environment varialbes
  # I've commented this out for now and used literals
  # to populate the constants.
  # SECRET_KEY = os.environ.get('SECRET_KEY')  
  # SQLALCHEMY_DATABASE_URI = os.environ.get('SQLALCHEMY_DATABASE_URI')
  SECRET_KEY = '1234567890'
  #SQLALCHEMY_DATABASE_URI = 'sqlite:///games.db'
  SQLALCHEMY_DATABASE_URI = 'mysql://eps@localhost:3307/eps_db'
  SQLALCHEMY_BINDS = {
    # 'types': 'sqlite:///types.db',
    # 'initial': 'sqlite:///initial.db'
  }


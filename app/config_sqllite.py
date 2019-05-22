import os 

class Config:
  # Get private info from environment varialbes
  # I've commented this out for now and used literals
  # to populate the constants.
  SECRET_KEY = '1234567890'
  SQLALCHEMY_DATABASE_URI = 'sqlite:///game_test.db'


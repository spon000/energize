from app.models import User, Game, Company
from app.game.init_cities import init_cities
from app.game.init_facilities import init_facilities

def initgame():
  # Add initial cities
  init_cities()

  # Add initial facilities
  init_facilities()

  return 0
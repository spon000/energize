from app.models import User, Game, Company
from app.game.init_cities import init_cities
from app.game.init_facilities import init_facilities

def initgame(game_id):
  # Add initial cities
  init_cities(game_id)

  # Add initial facilities
  init_facilities(game_id)

  return 0
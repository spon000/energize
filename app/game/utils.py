from math import floor
from app.models import User, Game, Company

turn_interval = 4

def get_current_game_date(game):
  c_qtr = game.turn_number % turn_interval
  c_year = game.start_year + floor(game.turn_number / turn_interval)
  return {'current_quarter': c_qtr, 'current_year': c_year}


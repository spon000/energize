from math import floor
from app.models import User, Game, Company

yearly_intervals = 4
num_months = 12

def get_current_game_date(game):
  c_qtr = game.start_quarter - (game.turn_number % yearly_intervals)
  c_year = game.start_year + floor(game.turn_number / yearly_intervals)
  return {'current_quarter': c_qtr, 'current_year': c_year}

def add_turns_to_game_date(current_qtr, current_year, turns = 1):
  current_month = 0
  new_qtr = 0
  new_year = 0
  return {'new_qtr': new_qtr, 'new_year': new_year}




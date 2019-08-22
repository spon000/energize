from math import floor, ceil
from app.models import User, Game, Company

hours_per_quarter = 2160

qtr_intervals = 4
num_months = 12
months_in_qtr = 3

####################################################################
# Date utilities

def format_date(hours, formatStr):
  return None

def get_current_game_date(game):
  c_qtr = game.start_quarter - (game.turn_number % qtr_intervals)
  c_year = game.start_year + floor(game.turn_number / qtr_intervals)
  return {'current_quarter': c_qtr, 'current_year': c_year}

def convert_date_to_qtr_year(date, format=False):
  qtr =  str(ceil(int(date[:2]) / months_in_qtr))
  year = date[2:6]
  result =  {'qtr': qtr, 'year': year}

  if format:
    return format_qtr_year(result['qtr'], result['year'])
  else:
    return result
    
def convert_qtr_year_to_date(qtrYear):
  return None

def add_turns_to_date(qtr, year, turns = 1):
  # num_qtrs = (int(qtr) + turns) % qtr_intervals
  new_qtr = (int(qtr) + turns) % qtr_intervals
  new_year = int(year) + floor((int(qtr) + turns) / qtr_intervals)
  return {'qtr': new_qtr, 'year': new_year}

def format_qtr_year(qtr, year):
  return "Q" + str(qtr) + " " + str(year)

###################################################################
# Money utilities
def convert_to_money_string(value):
  return '${:,}'.format(int(value))


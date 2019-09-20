from math import floor, ceil

# date modifiers

# This must match the default in the Game model in app/models.py
zero_year = 1920

quarters_per_year = 4
turns_per_year = quarters_per_year

months_per_year = 12
months_per_quarter = 3

days_per_year = 360
days_per_quarter = 90
days_per_month = 30

hours_per_year = 8640
hours_per_quarter = 2160
hours_per_turn = 2160
hours_per_month = 720
hours_per_day = 24

####################################################################
# Date utilities


####################################################################
# Returns date string based on number of hours since zero_year 
# (defined in Game object).
# date string is in format: yyyy:mm:dd:hh
####################################################################
def hours_to_date(hours):
  date_array = [
    str(floor(hours / hours_per_year) + zero_year),               # years
    str(floor((hours % hours_per_year) / hours_per_month) + 1),   # months
    str(floor((hours % hours_per_month) / hours_per_day) + 1),    # days
    str(hours % hours_per_day),                                   # hours
  ]
  return ":".join(date_array)

####################################################################
# Returns number of hours since zero_year (defined in Game object).
####################################################################
def date_to_hours(date):
  date_array = date.split(":")
  year_hours = (int(date_array[0]) - zero_year) * hours_per_year
  month_hours = (int(date_array[1]) - 1) * hours_per_month
  day_hours = (int(date_array[2]) - 1) * hours_per_day
  hour_hours = (int(date_array[3])) 

  return year_hours + month_hours + day_hours + hour_hours

####################################################################
# Returns date string based on number of hours since zero_year
# (defined in Game object).
####################################################################
def format_date(date_hours, format_str):
  date = hours_to_date(date_hours)
  date_array = date.split(":")

  if (format_str == "Q Y"):
    return "Q" + str(get_quarter(date)) + " " + str(date_array[0])

  if (format_str == "Y Q"):
    return str(date_array[0]) + " Q" + str(get_quarter(date))

  return date

####################################################################
# Returns the quarter number based on the current month.
####################################################################
def get_quarter(date):
  date_array = date.split(":")

  return int(ceil(int(date_array[1]) / months_per_quarter))

####################################################################
# Returns the current month based on current quarter and day.
####################################################################
def get_month_from_quarter(quarter, day=1):
  return None

####################################################################
# Returns standardized date string. "yyyy:m:d:h"
####################################################################
def date_to_date_str(year, month = 1, day = 1, hour = 0):
  date_array = [str(year), str(month), str(day), str(hour)]

  return ":".join(date_array)

####################################################################
# Returns standardized date string. "yyyy:m:d:h"
####################################################################
def get_current_game_date(game):
  return game.sim_start_date + game.turn_number * hours_per_turn
  
####################################################################
# Returns calculated production date of facility or gernerator 
# being built.
####################################################################
def calc_start_prod_date(game, build_turns):
  current_date_hours =  get_current_game_date(game)
  return current_date_hours + (build_turns * hours_per_turn)

def calc_end_prod_date(game, lifespan_turns):
  return None

def get_age(game, start_date):
  return floor((get_current_game_date(game) - start_date) / hours_per_year)

def turns_to_hours(turns):
  return turns * hours_per_turn

###################################################################
# Money utilities

####################################################################
# Returns monenatary value (cents are truncated) string
####################################################################
def convert_to_money_string(value):
  return '${:,}'.format(int(value))

def add_commas_to_number(value):
  return '{:,}'.format(int(value))
  




# def get_current_game_date(game):
#   c_qtr = game.start_quarter - (game.turn_number % quarters_per_year)
#   c_year = game.start_year + floor(game.turn_number / quarters_per_year)
#   return {'current_quarter': c_qtr, 'current_year': c_year}

# def convert_date_to_qtr_year(date, format=False):
#   qtr =  str(ceil(int(date[:2]) / months_per_quarter))
#   year = date[2:6]
#   result =  {'qtr': qtr, 'year': year}

#   if format:
#     return format_qtr_year(result['qtr'], result['year'])
#   else:
#     return result
    
# def convert_qtr_year_to_date(qtrYear):
#   return None

# def add_turns_to_date(qtr, year, turns = 1):
#   # num_qtrs = (int(qtr) + turns) % qtr_intervals
#   new_qtr = (int(qtr) + turns) % quarters_per_year
#   new_year = int(year) + floor((int(qtr) + turns) / quarters_per_year)
#   return {'qtr': new_qtr, 'year': new_year}

# def format_qtr_year(qtr, year):
#   return "Q" + str(qtr) + " " + str(year)

# ###################################################################
# # Money utilities
# def convert_to_money_string(value):
#   return '${:,}'.format(int(value))


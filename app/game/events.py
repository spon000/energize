import numpy as np
import scipy
import scipy.signal
import scipy.stats

import app.game.constants as cons

from math import trunc
from datetime import datetime 

from app import db, celery
from app.models import Facility, Generator, City, Company, Game, Prompt
from app.models import FacilityType, GeneratorType

from shapely.geometry import Point
from shapely.geometry.polygon import Polygon

from app.game.prompts import assign_prompt
from app.game.sio_outgoing import shout_game_turn_interval

from app.game.utils import get_age, add_commas_to_number

# ###############################################################################  
# ###############################################################################
def hourly_events(game):
  pass

# ###############################################################################  
# ###############################################################################
def daily_events(game):
  pass

# ###############################################################################  
# ###############################################################################
def quarterly_events(game, mods):

  # Don't check for events on turn 0
  if game.turn_number == 0:
    return

  # Winter events
  if game.turn_number % cons.quarters_per_year == cons.winter:
    print("*"*80)
    print("Winter events...")
    check_blizzard(game, mods, .90)

  # Spring, nice weather, nothing bad ever happens in spring
  if game.turn_number % cons.quarters_per_year == cons.spring:
    print("*"*80)
    print("Springtime events...")
    pass

  # Summer events
  if game.turn_number % cons.quarters_per_year == cons.summer:
    print("*"*80)
    print("Summer events...")
    check_heatwave(game, mods, .90)    

  # Fall events
  if game.turn_number % cons.quarters_per_year == cons.fall:
    print("*"*80)
    print("Fall events...")
    check_hurricane(game, mods, .90)
    
# ###############################################################################  
# ###############################################################################
def check_heatwave(game, mods, probability = .40):
  # Roll random number to decide if a new heatwave starts
  
  dur_days = 4 + np.random.randint(9)
  dur_hours = dur_days * cons.hours_per_day
  start_day = np.random.randint(cons.days_per_quarter - 15)
  start_hour = (game.turn_number * cons.hours_per_quarter) + (start_day * cons.hours_per_quarter)
  end_day = start_day + dur_days
  peak = np.random.uniform(0.10, 0.25)
  
  check = np.random.uniform(0, 1)
  print("*"*80)
  print(f"Heatwave... {int(check*100)}%")
  if check < probability:
    # create randomly fluctuating timeseries to represent increase in energy demand due to heat
    x1 = np.linspace(0, 14, 6)
    y1 = np.random.uniform(0.2, 0.5, 6)
    y1[0] = 0
    y1[-1] = 0
    y1 = y1 * (1.0 / (1 + np.exp(-10 * (x1 - 1)))) * (1.0 - 1.0 / (1 + np.exp(-10 * (x1 - dur_days))))
    x2  = np.linspace(0, 14, 14 * 24)
    y2  = scipy.interpolate.interp1d(x1, y1, kind='cubic')(x2)
    y2 *= (1.0 / (1 + np.exp(-10 * (x2 - 1)))) * (1.0 - 1.0 / (1 + np.exp(-10 * (x2 - dur_days))))
    y2 /= np.max(y2)
    y2 *= peak
    y2 += 1.0

    # update the energy demand accordingly
    for jj in range(len(mods['ed'])):
      for kk in range(dur_days * cons.hours_per_day):
        mods['ed'][jj][0][start_hour + kk] *= y2[kk] 
  
    # in the future, the location of the heatwave would also be decided here
    # therefore the demand of individual cities might become too high for the transmission lines in some places
    # aint no tranmission network yet so we'll ignore that for now  
    # For now...
    # You get a heatwave! You get a heatwave! Everybody gets a heatwave!
    for company in Company.query.filter_by(id_game=game.id).all():
      event = assign_prompt('heatwave', game, company, {'start': start_day, 'end': end_day}, [dur_days, int(np.ceil(peak*100))])
      db.session.add(event)
  
# ###############################################################################  
# ###############################################################################
def check_hurricane(game, mods, probability = .25):
    # Roll random number to decide if hurricane happens

    dur_days = 2 + np.random.randint(7)
    dur_hours = dur_days * cons.hours_per_day
    start_day = np.random.randint(cons.days_per_quarter - 15)
    end_day = start_day + dur_days 

    check = np.random.uniform(0, 1)
    print("*"*80)
    print(f"Hurricane... {int(check*100)}%")
    if check < probability:
      # roll random severity
      sev  = np.random.uniform(30, 70)
      # determine set of facilities affected (ie knocked offline)
      x = [75 ,50 ,20 ,10,30,35,15,12 ,5,5]
      y = [120,105,100,90,85,75,55,40,20,5]
      cl = coastal_length(x, y)
      dc = np.random.uniform(0, cl)
      dS = dc-sev
      dN = dc+sev

      if dS < 0: 
        dS = 0

      if dN > cl: 
        dN = cl

      xc, yc = coastal_dist_to_xy(x, y, dc)
      xS, yS = coastal_dist_to_xy(x, y, dS)
      xN, yN = coastal_dist_to_xy(x, y, dN)
      xi = xc + sev * 1.5
      yi = yc + np.random.normal(0,0.2 * sev, 1)
      polyx = [0, 0, xS, xi, xN, 0,  0]
      polyy = [yc,yS,yS, yi, yN, yN, yc]
      polygon = Polygon(zip(polyx,polyy))

      for company in Company.query.filter_by(id_game=game.id).all():
        # count facilities that are in the impacted polygon
        off_facs = []

        for facility in Facility.query.filter_by(id_company=company.id).all():
          point = Point(facility.column, facility.row)

          if polygon.contains(point):
            off_facs += [facility]
            facility.state='inactive'
            facility.counter=dur_days

        if len(off_facs) > 0:
          event = assign_prompt('hurricane-affected', game, company, {'start': start_day, 'end': end_day}, [len(off_facs), dur_days])
          db.session.add(event)
        else:
          event = assign_prompt('hurricane-unaffected', game, company, {'start': start_day, 'end': end_day},  [len(off_facs), dur_days])
          db.session.add(event)

# ###############################################################################  
# ###############################################################################  
def check_blizzard(game, mods, probability = .25):
    # Roll random number to decide if blizzard happens

    dur_days = 4 + np.random.randint(9)
    dur_hours = dur_days * cons.hours_per_day
    start_day = np.random.randint(cons.days_per_quarter - 15)
    end_day = start_day + dur_days      

    check = np.random.uniform(0, 1)
    print("*"*80)
    print(f"Blizzard... {int(check*100)}%")
    if check < probability:
      # determine set of facilities affected (ie knocked offline)
      polyx = [0, 0, 80, 160, 240,  240, 0]
      polyy = [0, np.random.uniform(20, 60), np.random.uniform(20, 60), np.random.uniform(20, 60), np.random.uniform(20, 60), 0, 0]
      polygon = Polygon(zip(polyx,polyy))

      for company in Company.query.filter_by(id_game=game.id).all():
        # count facilities that are in the impacted polygon
        off_facs = []

        for facility in Facility.query.filter_by(id_company=company.id, state='active').all():
          point = Point(facility.column, facility.row)

          if polygon.contains(point) or facility.facility_type.maintype=='coal':
            off_facs += [facility]
            facility.state='inactive'
            facility.counter = dur_days


        if len(off_facs) > 0:
          # capacity_amount = sum(fac.facility_type.nameplate_capacity for fac in off_facs if fac.state = 'inactive')
          # capacity_amount = 0
          # for fac in off_facs:
          #   for gen in fac.generators:
          #     if gen.state == 'available':
          #       capacity_amount += gen.generator_type.nameplate_capacity
          capacity_amount = sum(gen.generator_type.nameplate_capacity for fac in off_facs for gen in fac.generators if gen.state == 'available')
          
          # event = assign_prompt('blizzard-affected', game, company, {'start': start_day, 'end': end_day}, [len(off_facs), add_commas_to_number(capacity_amount), dur_days])          
          event = assign_prompt('blizzard-affected', game, company, {'start': start_day, 'end': end_day}, [len(off_facs), dur_days])          
          db.session.add(event)
        else:
          event = assign_prompt('blizzard-unaffected', game, company, {'start': start_day, 'end': end_day})
          db.session.add(event)

# ###############################################################################  
# ###############################################################################
def coastal_length(x, y):
  distance = 0.0
  for i in range(len(x) - 1):
    distance += ((x[i] - x[i + 1]) ** 2 + (y[i] - y[i + 1]) ** 2) ** 0.5

  return distance

# ###############################################################################  
# ###############################################################################
def coastal_dist_to_xy(x ,y, d0):
  d=0.0
  for i in range(len(x) - 1):
    dd = ((x[i] - x[i + 1]) ** 2 + (y[i] - y[i + 1]) ** 2) ** 0.5

    if (d + dd) > d0: 
      break
    else: 
      d += dd

  x0 = x[i] + (x[i  +1] - x[i]) * (d0 - d) / dd
  y0 = y[i] + (y[i  +1] - y[i]) * (d0 - d) / dd

  return x0, y0
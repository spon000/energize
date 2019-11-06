import numpy as np
from math import trunc
# import pickle
# import math
# import time
import scipy
import scipy.signal
import scipy.stats

import app.game.constants as cons

# import matplotlib as mpl
# mpl.use('Agg')
# import matplotlib.pyplot as plt
from datetime import datetime 
from app import db, celery
from app.models import Facility, Generator, City, Company, Game, Prompt
from app.models import FacilityType, GeneratorType

from shapely.geometry import Point
from shapely.geometry.polygon import Polygon

from app.game.prompts import assign_prompt
from app.game.sio_outgoing import shout_game_turn_interval
from app.game.utils import get_age
from app.game.events import quarterly_events, daily_events, hourly_events


# ###############################################################################  
#
# ###############################################################################
def initialize_turn(game, mods):
  pass
# ###############################################################################  
#
# ###############################################################################
def check_generator_hourly(game, state, hour):
    #     if generator.build_turn <= 0:  
    #     generator.state="available"
    #     generator.prod_turn += 1
    #     set_state_vars(state, mods, game.id)
    #     state = get_state_vars(state, mods, game.id)
    #     #if available (and chosen...so may need to go somewhere else): "OM" = 'fixed_cost_to_operate'*'nameplate_capacity'+'variable_cost_to_operate'*'capacity??'
    #     ##check term names...especially the 

    # elif generator.state == "available":

    #   if generator.condition < 0.20:
    #     generator.state = "unavailable"
    #     set_state_vars(state, mods, game.id)
    #     state = get_state_vars(state, mods, game.id)
    #   else:
    #     generator.prod_turn += 1

  pass


# ###############################################################################  
#
# ###############################################################################
def check_generator_daily(game, state, day):
  pass

# ###############################################################################  
#
# ###############################################################################
def check_generator_quarterly(game):
  generators = Generator.query.filter_by(id_game=game.id).all()

  for generator in generators:
    generator.construction = 0.0

    if generator.state == "new":
      generator.state="building"
      generator.build_turn -= 1 
      generator.construction = qtr_gen_const_cost(generator.generator_type)

    elif generator.state == "building":
      generator.build_turn -= 1
      generator.construction = qtr_gen_const_cost(generator.generator_type)

      if generator.build_turn <= 0:  
        generator.state="available"
        generator.prod_turn += 1

    elif generator.state == "available":
      
      if generator.condition < 0.20:
        generator.state = "unavailable"
      else:
        generator.prod_turn += 1

    elif generator.state == "start_decom":
      generator.state = "decommissioning"
      generator.decom_turn -= 1

    elif generator.state == "decommissioning":
       generator.decom_turn -= 1
       if generator.decom_turn <= 0:
         generator.state = "decommissioned"

    
  db.session.commit()
  return 
  

# ###############################################################################  
#
# ###############################################################################  
def check_facility_hourly(game, hour):
  pass


# ###############################################################################  
#
# ###############################################################################  
def check_facility_daily(game, day):
  facilities = Facility.query.filter_by(id_game=game.id, state='inactive').all()
  for facility in facilities:
    facility.counter -= 1
    if facility.counter <= 0:
      facility.counter = 0
      facility.state = 'active'

# ###############################################################################  
#
# ###############################################################################  
def check_facility_quarterly(game):
  facilities = Facility.query.filter_by(id_game=game.id).all()
  for facility in facilities:
    facility.construction = 0.0

    if facility.state == "new":
      facility.state="building"
      facility.build_turn -= 1
      facility.construction = qtr_fac_const_cost(facility.facility_type)

    elif facility.state == "building":
      facility.build_turn -= 1

      if facility.build_turn <= 0: 
        facility.state="active"
        facility.prod_turn += 1
      else:
        facility.construction = qtr_fac_const_cost(facility.facility_type)

    elif facility.state == "active":
      facility.prod_turn += 1  

    db.session.commit()
    
# ###############################################################################  
#
# ############################################################################### 
def qtr_fac_const_cost(facility_type):
  return facility_type.fixed_cost_build * facility_type.maximum_capacity / facility_type.build_time

# ###############################################################################  
#
# ############################################################################### 
def qtr_gen_const_cost(generator_type):
   return generator_type.fixed_cost_build * generator_type.nameplate_capacity / generator_type.build_time

# ###############################################################################  
#
# ###############################################################################  
# def modify_facility_states(game):
#   facilities = Facility.query.filter_by(id_game=game.id).all()
#   for facility in facilities:

#     if facility.state == "new":
#       facility.state="building"
#       facility.build_turn -= 1

#     elif facility.state == "building":
#       facility.build_turn -= 1
#       if facility.build_turn <= 0: 
#         facility.state="active"
#         facility.prod_turn += 1

#     elif facility.state == "active":
#       facility.prod_turn += 1

#     elif facility.state=='inactive' and facility.counter > 0:
#       facility.counter -= 1
#       if facility.counter == 0:
#         facility.state='active'

#   return

# # ###############################################################################  
# #
# # ###############################################################################
# def modify_generator_states(game):
#   generators = Generator.query.filter_by(id_game=game.id).all()
#   for generator in generators:

#     if generator.state == "new":
#       generator.state="building"
#       generator.build_turn -= 1

#     elif generator.state == "building":
#       generator.build_turn -= 1
#       if generator.build_turn <= 0:  #>= generator.generator_type.build_time:
#         generator.state="available"
#         generator.prod_turn += 1

#     elif generator.state == "available":
#       if generator.condition < 0.20:
#         generator.state = "unavailable"
#       else:
#         generator.prod_turn += 1

#     elif generator.state == "start_decom":
#       generator.state = "decommissioning"
#       generator.decom_turn -= 1

#     elif generator.state == "decommissioning":
#        generator.decom_turn -= 1
#        if generator.decom_turn <= 0:
#          generator.state = "decommissioned"

#   return

# ###############################################################################  
#
# ###############################################################################
def calculate_turn(game, mods):
  print(">"*80)
  print(f"starting turn {datetime.now().time()}")
  print(">"*80)
  state = run_turn(game, mods)
  print("<"*80)
  print(f"ending turn {datetime.now().time()}")
  print("<"*80)

  return state

# ###############################################################################  
#
# ###############################################################################
def finalize_turn(game, mods, state):

  game.turn_number += 1
  game.state = "playing"
  
  for company in game.companies:
      company.state = "view"
      company.show_QR = True

  db.session.commit()

# ###############################################################################  
#
# ###############################################################################
def add_costs_to_company(state):
  # this already happens within the ISO for now
  pass

# ###############################################################################  
#
# ###############################################################################
def add_population_growth(state):
  # for now, population growth is decided at the beginning of the game, and has no
  # feedback with what's going on in the game. Sometime down the line, this function
  # should be expanded to include those feedbacks
  pass

# ###############################################################################  
#
# ###############################################################################
# def age_generators(state, gid):

#   i = state['i']
#   generators = Generator.query.filter_by(id_game=gid).all()
#   for gen in generators:
#     if gen.state == 'building':
#       if gen.build_turn > 0:
#         gen.build_turn -= 1
#       if gen.build_turn <= 0:
#         gen.state = 'available'
#         gen.build_turn  = 0
#         set_state_vars(state, mods)
#         state = get_state_vars(state, mods, gid)
#     if gen.state == 'available' and gen.condition < 0.20:
#       gen.state = 'unavailable'
#       set_state_vars(state, mods)
#       state = get_state_vars(state, mods, gid)

#   return state

def caculate_generator_cost(generator, state):
  # this already happens within the ISO for now
  pass

# ###############################################################################  
#
# ###############################################################################
# def age_facilities(gid):
  
#   for facility in Facility.query.filter_by(id_game=gid).all():
#     if facility.state=='inactive' and facility.counter > 0:
#       facility.counter -= 1
#       if facility.counter == 0:
#         facility.state='active'


def calculate_facility_cost(facility, state):
  # this already happens within the ISO for now
  pass

def calculate_company_cost():
  pass

# ###############################################################################  
#
# ###############################################################################
# turn process
def run_turn(game, mods):
  state = {}
  state['i'] = game.turn_number * cons.hours_per_turn
  state = get_state_vars(state, mods, game.id)
  # mods = massage_mods(mods)

  filename = "history" + str(game.id) + ".txt"
  file = open(filename,'w')
  filedebug = open("debug.txt", 'w')

  file.write("+" * 80 +"\n")
  file.write(f"state = {state}")

  i = state['i']
 

  # filedebug.write(f"mods['ed'] = {mods['ed']}\n")
  # mods_squeeze = 
  # filedebug.write(f"mods_squeeze = {mods_squeeze}\n")
  # demand = np.sum(mods['ed'].squeeze()[:,i])
  # filedebug.write(f"demand = {demand}\n")

  check_facility_quarterly(game)
  check_generator_quarterly(game)
  quarterly_events(game, mods)

  for day in range(90):
    shout_game_turn_interval(game.id, {'statusMsg': 'Calculating days...', 'interval': day, 'total': 90})
    check_facility_daily(game, day)
    check_generator_daily(game, state, day)
    # file.write("+" * 80 +"\n")
    # file.write(f"day: {day} ----  {datetime.now().time()}\n")
    # file.write("+" * 80 + "\n")

    for hr in range(24):
      filedebug.write(f"hr({hr})...    {datetime.now().time()}\n")
      check_facility_hourly(game, hr)
      check_generator_hourly(game, state, hr)

      state = iso(mods, state, file, game.id)

      # filedebug.write("+" * 80 +"\n")
      # filedebug.write(f"i = {i}\n")
      # filedebug.write(f"state = {state}")

      state['i'] += 1

      # db.session.commit()
      # roll_for_events(game,db,mods,state)


    # Construction Expenses
  companies = Company.query.filter_by(id_game=game.id).all()
  for company in companies:

    facilities = Facility.query.filter_by(id_game=company.id_game, id_company=company.id).all()
    generators = ([facility.generators for facility in facilities])
    gs = []
    for gens in generators:
      gs += gens
    
    # fac_construction = db.session.query(db.func.sum(Facility.construction)).filter_by(id_game=gid, id_company=company.id).scalar()
    fac_construction = sum([fac.construction for fac in facilities])
    gen_construction = np.sum([gen.construction for gen in gs])

    company.balance += - (fac_construction + gen_construction)    

    
  db.session.commit()

  file.close()
  filedebug.close()
  return state


# ###############################################################################
#
# ###############################################################################
def iso(mods, state, file, gid):

  # file.write(f"\tiso start  {datetime.now().time()}\n")
  i           = state['i']
  demand = np.sum(mods['ed'].squeeze()[:,i])
  ng     = len(state['gens'])
  mc     = np.sum([state['opMaint_gen'], state['opMaint_fac'], state['fuel_costs']], axis=0)
  jj     = np.argsort(mc)
  supply = 0
  price  = 0
  kk     = 0
  
  for j in jj:
    if supply < demand:
      supply += state['availCap'][j]
      price   = mc[j]
      kk+=1

  onOff=[]
  profit=[]
  player_profit = {
    "1": [],
    "2": [],
    "3": [],
    "4": [],
    "5": []
  }

  gen_profit = np.zeros([len(state['gens'])],dtype='float')

  for j in range(ng):
    if mc[j] < price:
      profit = (price - state['opMaint_gen'][j] - state['opMaint_fac'][j] - state['fuel_costs'][j]) * state['availCap'][j]
      player_profit[state['pn'][j]] += [profit]
      gen_profit[j]         = profit
      state['dc'][j] += state['availCap'][j]
      term1  = state['availCap'][j]/float(state['nc'][j]*state['life'][j])
      term2  = term1*0.05
      #print(term1,term2)
      #print('before',state['cn'][j])
      state['cn'][j] -= term1*np.random.normal(term1,term2)
      #print('after',state['cn'][j])
      if state['cn'][j]<0.00: state['cn'][j]=0.0
      if state['cn'][j]>1.00: state['cn'][j]=1.0
      #exit()

    else:
      loss = ( state['opMaint_gen'][j] + state['opMaint_fac'][j] ) * state['availCap'][j]
      player_profit[state['pn'][j]] += [loss]
      gen_profit[j]         = loss

    if i%61==0:
      id   = state['gens'][j].id
      mt   = state['types'][j]
      if mt=='natural gas': mt = 'natgas'
      # file = open('log.txt','a')
      # file.write('gen %s %i %i %f %f %f %f %f %f %f %f\n' % (mt,i,id,state['dc'][j],state['cn'][j],state['opMaint_gen'][j],state['opMaint_fac'][j],state['fuel_costs'][j],gen_profit[j],state['aoc'][j],state['availCap'][j]) )
      # file.close()

  
  # construct_expenses = fac_construction + gen_construction
  for company in Company.query.filter_by(id_game=gid).all():
    company.balance += np.sum(player_profit[str(company.player_number)])

  # if i%61==0:
  #   # file=open('log.txt','a')
  #   # file.write('time %i %f %f %f\n' % (i,price,demand,np.sum(state['availCap'])) )
  #   # file.close()

  #   for j in range(5):
  #     # file=open('log.txt','a')
  #     # file.write('comp %i %i %f\n' % (i,j,np.sum(player_profit['%i'%(j+1)])) )
  #     # file.close()

  # file.write(f"\tiso end {datetime.now().time()}\n")
  return state

# ###############################################################################
#
# ###############################################################################
# def massage_mods(mods):

#   # we need to turn this into an numpy array for later calculations
#   mods['ed'] = np.array(mods['ed'])
  
#   return mods

# ###############################################################################
#
# ###############################################################################
def get_state_vars(state, mods, gid):
  i = state['i']

  gens        = Generator.query.filter(Generator.id_game == gid, Generator.build_turn == 0, Generator.state == 'available').all()
  ng          = len(gens)
  availCap    = np.zeros(ng, dtype='float')
  fuel_costs  = np.zeros(ng, dtype='float')
  opMaint_gen = np.zeros(ng, dtype='float')
  opMaint_fac = np.zeros(ng, dtype='float')
  dc          = np.zeros(ng, dtype='float')
  cn          = np.zeros(ng, dtype='float')
  nc          = np.zeros(ng, dtype='float')
  life        = np.zeros(ng, dtype='float')
  aoc         = np.zeros(ng, dtype='float')
  types       = np.zeros(ng, dtype='object')
  pn          = np.zeros(ng, dtype='object')

  for j in range(ng):
    jgen           = gens[j]
    fac            = jgen.facility
    facCap         = float(np.sum([kgen.generator_type.nameplate_capacity for kgen in fac.generators]))
    genCap         = float(jgen.generator_type.nameplate_capacity)
    genType        = jgen.generator_type
    facType        = fac.facility_type
    dc[j]          = jgen.duty_cycles
    cn[j]          = jgen.condition
    opMaint_gen[j] = 1000 * (genType.fixed_cost_operate / (cons.hours_per_year) * (1.0 / cn[j] ** 0.5))	# converts kW/y to kW/h
    opMaint_fac[j] = 1000 * (facType.fixed_cost_operate / (cons.hours_per_year) * (genCap/facCap))	# converts kW/y to kW/h
    nc[j]          = genType.nameplate_capacity * 1000.0				# convert from MW to kW
    availCap[j]    = genType.nameplate_capacity * 1000.0 * (0.8 + (0.2 * cn[j]))		# convert from MW to kW
    pn[j]          = str(fac.player_number)
    types[j]       = facType.maintype
    life[j]        = jgen.generator_type.lifespan * cons.hours_per_quarter         #90.0 * 24.0
    aoc[j]         = jgen.generator_type.fixed_cost_build / life[j]

    if types[j] in ['nuclear','coal','natural gas']:
      heat_cont     = float(genType.resource_type.energy_content)
      heat_rate     = float(genType.heat_rate)

    if   types[j] == 'nuclear':     fuel_costs[j] = mods['fp'][0][i] / (heat_cont/heat_rate)
    elif types[j] == 'coal':        fuel_costs[j] = mods['fp'][1][i] / (heat_cont/heat_rate)
    elif types[j] == 'natural gas': fuel_costs[j] = mods['fp'][2][i] / (heat_cont/heat_rate)
    elif types[j] == 'solar':       availCap[j]   = mods['sp'][i]*availCap[j]

  return ({
    'i':i,
    'gens':gens,
    'availCap':availCap,
    'fuel_costs':fuel_costs,
    'opMaint_gen':opMaint_gen,
    'opMaint_fac':opMaint_fac,
    'dc':dc,
    'cn':cn,
    'nc':nc,
    'life':life,
    'aoc':aoc,
    'types':types,
    'pn':pn
  })

# ###############################################################################  
#
# ###############################################################################
def set_state_vars(state, mods):
  gens = state['gens']
  for j in range(len(gens)):
    gens[j].duty_cycles = state['dc'][j]
    gens[j].condition   = state['cn'][j]
  db.session.add_all(gens)

# ###############################################################################  
#
# ###############################################################################
def coastal_length(x,y):
  d=0.0
  for i in range(len(x)-1):
    d += ((x[i]-x[i+1])**2+(y[i]-y[i+1])**2)**0.5
  return d

# ###############################################################################  
#
# ###############################################################################
def coastal_dist_to_xy(x,y,d0):
  d=0.0
  for i in range(len(x)-1):
    dd = ((x[i]-x[i+1])**2+(y[i]-y[i+1])**2)**0.5
    if (d+dd)>d0: break
    else: d+=dd
  x0 = x[i]+(x[i+1]-x[i])*(d0-d)/dd
  y0 = y[i]+(y[i+1]-y[i])*(d0-d)/dd
  return x0,y0

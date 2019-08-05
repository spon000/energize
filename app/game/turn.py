import numpy as np
# import pickle
# import math
# import time
# import scipy
# import scipy.signal
# import scipy.stats
# import matplotlib as mpl
# mpl.use('Agg')
# import matplotlib.pyplot as plt
from datetime import datetime 
from app import db
from app.models import Facility, Generator, City, Company, Game
from app.models import FacilityType, GeneratorType

# ###############################################################################  
#
# ###############################################################################
def initialize_turn(game, mods):
  pass

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
  add_costs_to_company(state)
  age_generators(game.id)
  age_facilities(game.id)


# ###############################################################################  
#
# ###############################################################################
def add_costs_to_company(state):
  pass

# ###############################################################################  
#
# ###############################################################################
def add_population_growth(state):
  pass

# ###############################################################################  
#
# ###############################################################################
def age_generators(gid):
  pass


def caculate_generator_cost(generator, state):
  pass

# ###############################################################################  
#
# ###############################################################################
def age_facilities(gid):
  pass


def calculate_facility_cost(facility, state):
  pass

# ###############################################################################  
#
# ###############################################################################
# turn process
def run_turn(game, mods):
  state = {}
  state['i'] = game.turn_number * 90 * 24
  state = get_state_vars(state, mods)
  
  filename = "history" + str(game.id) + ".txt"
  file = open(filename,'w')

  for day in range(90):
    file.write("+" * 80 +"\n")
    file.write(f"day: {day} \n")
    file.write("+" * 80 + "\n")

    for hr in range(24):
      file.write(f"hr({hr})... \n")
      state = iso(mods, state, file)
      state['i'] += 1

  file.close()
  return state


# ###############################################################################  
#
# ###############################################################################
def iso(mods, state, file):

  i      = state['i']
  demand = np.sum(np.array(mods['ed']).squeeze()[:,i])
  ng     = len(state['gens'])
  mc     = state['opMaint_gen']+state['opMaint_fac']+state['fuel_costs']
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

    if i%61==0 or True:
      id   = state['gens'][j].id
      mt   = state['types'][j]
      if mt=='natural gas': mt = 'natgas'
      # file = open('log.txt','a')
      file.write('gen %s %i %i %f %f %f %f %f %f %f %f\n' % (mt,i,id,state['dc'][j],state['cn'][j],state['opMaint_gen'][j],state['opMaint_fac'][j],state['fuel_costs'][j],gen_profit[j],state['aoc'][j],state['availCap'][j]) )
      # file.close()

  if i%61==0 or True:
    # file=open('log.txt','a')
    file.write('time %i %f %f %f\n' % (i,price,demand,np.sum(state['availCap'])) )
    # file.close()

    for j in range(5):
      # file=open('log.txt','a')
      file.write('comp %i %i %f\n' % (i,j,np.sum(player_profit['%i'%(j+1)])) )
      # file.close()

  return state


# ###############################################################################  
#
# ###############################################################################
def get_state_vars(state, mods):
  i = state['i']

  gens        = Generator.query.filter(Generator.build_turn == 0, Generator.state == 'available').all()
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
    opMaint_gen[j] = genType.fixed_cost_operate / (356.0*24.0) * (1.0/cn[j]**0.5)	# converts kW/y to kW/h
    opMaint_fac[j] = facType.fixed_cost_operate / (356.0*24.0) * (genCap/facCap)	# converts kW/y to kW/h
    nc[j]          = genType.nameplate_capacity * 1000.0				# convert from MW to kW
    availCap[j]    = genType.nameplate_capacity * 1000.0 * (0.8+0.2*cn[j])		# convert from MW to kW
    pn[j]          = str(fac.player_number)
    types[j]       = facType.maintype
    life[j]        = jgen.generator_type.lifespan * 90.0 * 24.0
    aoc[j]         = jgen.generator_type.fixed_cost_build / life[j]

    if types[j] in ['nuclear','coal','natural gas']:
      heat_cont     = float(genType.resource_type.energy_content)
      heat_rate     = float(genType.heat_rate)

    if   types[j] == 'nuclear':     fuel_costs[j] = mods['fp'][0][i] / (heat_cont/heat_rate)
    elif types[j] == 'coal':        fuel_costs[j] = mods['fp'][1][i] / (heat_cont/heat_rate)
    elif types[j] == 'natural gas': fuel_costs[j] = mods['fp'][2][i] / (heat_cont/heat_rate)
    elif types[j] == 'solar':       availCap[j]   = mods['sp'][i]*availCap[j]

  return {'i':i,
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
          'pn':pn}


# ###############################################################################  
#
# ###############################################################################
def set_state_vars(state, mods):
  gens = state['gens']
  for j in range(len(gens)):
    gens[j].duty_cycles = state['dc'][j]
    gens[j].condition   = state['cn'][j]
  db.session.add_all(gens)
  db.session.commit()









# def build_generators(state, mods, file):
#   i = state['i']
#   generators = Generator.query.all()
#   for gen in generators:
#     if gen.state == 'building':
#       if gen.build_turn>0:
#         gen.build_turn -= 1
#       if gen.build_turn<=0:
#         gen.state = 'available'
#         gen.build_turn  = 0
#         set_state_vars(db,state,mods)
#         state = get_state_vars(state,mods)
#     if gen.state == 'available' and gen.condition<0.20:
#       gen.state = 'unavailable'
#       set_state_vars(db,state,mods)
#       state = get_state_vars(state,mods)

#   if np.random.uniform(0,1)<(1.0/(24.0*90.0)):
#     # facs = Facility.query.all()
#     genTypes = GeneratorType.query.all()
#     facs = Facility.query.filter_by()
#     fac = np.random.choice(facs)
#     facType = fac.facility_type
#     genTypesThis = []
#     for genType in genTypes:
#       if genType.facility_type.id==facType.id:
#         genTypesThis += [genType]
#     genType  = np.random.choice(genTypesThis)
#     newGen = Generator(
#       id_type = genType.id,
#       id_game = fac.id_game,
#       id_facility = fac.id,
#       state = "building",
#       build_turn = genType.build_time*24*90,
#       start_build_date = "123456",
#       start_prod_date  = "123456"
#     )
#     db.session.add(newGen)
#     db.session.commit()

#     # file = open('log.txt','a')
#     file.write('comp %i %i %f\n' % (state['i'],fac.player_number,-newGen.generator_type.fixed_cost_build) )
#     # file.close()

#   return state

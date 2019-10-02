import numpy as np
from math import trunc
# import pickle
# import math
# import time
import scipy
import scipy.signal
import scipy.stats
# import matplotlib as mpl
# mpl.use('Agg')
# import matplotlib.pyplot as plt
from datetime import datetime 
from app import db, celery
from app.models import Facility, Generator, City, Company, Game, Prompt
from app.models import FacilityType, GeneratorType

from shapely.geometry import Point
from shapely.geometry.polygon import Polygon

from app.game.sio_outgoing import shout_game_turn_interval

# ###############################################################################  
#
# ###############################################################################
def initialize_turn(game, mods):
  modify_facility_states(game)
  modify_generator_states(game)
  
  return

# ###############################################################################  
#
# ###############################################################################  
def modify_facility_states(game):
  facilities = Facility.query.filter_by(id_game=game.id).all()
  for facility in facilities:

    if facility.state == "new":
      facility.state="building"
      facility.build_turn += 1

    elif facility.state == "building":
      facility.build_turn += 1
      if facility.build_turn >= facility.facility_type.build_time:
        facility.state="active"
        facility.prod_turn += 1

    elif facility.state == "active":
      facility.prod_turn += 1

  return

# ###############################################################################  
#
# ###############################################################################
def modify_generator_states(game):
  generators = Generator.query.filter_by(id_game=game.id).all()
  for generator in generators:

    if generator.state == "new":
      generator.state="building"
      generator.build_turn += 1

    elif generator.state == "building":
      generator.build_turn += 1
      if generator.build_turn >= generator.generator_type.build_time:
        generator.state="active"
        generator.prod_turn += 1

    elif generator.state == "active":
      if gen.condition < 0.20:
        generator.state = "inactive"
      else:
        generator.prod_turn += 1
      
    elif generator.state == "start_decom":
      generator.state = "decommissioning"
      generator.decom_turn -= 1

    elif generator.state == "decommissioning":
       generator.decom_turn -= 1
       if generator.decom_turn <= 0:
         generator.state = "decommissioned"

  return

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
def age_generators(state,gid):

  i = state['i']
  generators = Generator.query.all()
  for gen in generators:
    if gen.state == 'building':
      if gen.build_turn>0:
        gen.build_turn -= 1
      if gen.build_turn<=0:
        gen.state = 'available'
        gen.build_turn  = 0
        set_state_vars(db,state,mods)
        state = get_state_vars(state,mods)
    if gen.state == 'available' and gen.condition<0.20:
      gen.state = 'unavailable'
      set_state_vars(db,state,mods)
      state = get_state_vars(state,mods)

  return state

def caculate_generator_cost(generator, state):
  # this already happens within the ISO for now
  pass

# ###############################################################################  
#
# ###############################################################################
def age_facilities(gid):

  for facility in Facility.query.all():
    if facility.state=='inactive' and facility.counter > 0:
      facility.counter -= 1
      if facility.counter == 0:
        facility.state='active'


def calculate_facility_cost(facility, state):
  # this already happens within the ISO for now
  pass

# ###############################################################################  
#
# ###############################################################################
# turn process
def run_turn(game, mods):
  state = {}
  state['i'] = game.turn_number * 90 * 24
  state = get_state_vars(state, mods)
  mods = massage_mods(mods)

  filename = "history" + str(game.id) + ".txt"
  file = open(filename,'w')

  for day in range(90):
    shout_game_turn_interval(game.id, {'statusMsg': 'Calculating days...', 'interval': day, 'total': 90})
    # file.write("+" * 80 +"\n")
    # file.write(f"day: {day} ----  {datetime.now().time()}\n")
    # file.write("+" * 80 + "\n")

    for hr in range(24):
      # file.write(f"hr({hr})...    {datetime.now().time()}\n")
      state = iso(mods, state, file)
      state['i'] += 1

      # db.session.commit()
      # roll_for_events(game,db,mods,state)

  file.close()
  return state


# ###############################################################################
#
# ###############################################################################
def iso(mods, state, file):

  # file.write(f"\tiso start  {datetime.now().time()}\n")
  i      = state['i']
  demand = np.sum(mods['ed'].squeeze()[:,i])
  ng     = len(state['gens'])
  mc = np.sum([state['opMaint_gen'], state['opMaint_fac'], state['fuel_costs']], axis=0)
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

  for company in Company.query.all():
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
def massage_mods(mods):

  # we need to turn this into an numpy array for later calculations
  mods['ed'] = np.array(mods['ed'])
  
  return mods

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
    facCap         = float(np.sum([kgen.generator_type.nameplate_capacity for kgen in fac.generators if kgen.state == "available"]))
    genCap         = float(jgen.generator_type.nameplate_capacity)
    genType        = jgen.generator_type
    facType        = fac.facility_type
    dc[j]          = jgen.duty_cycles
    cn[j]          = jgen.condition
    opMaint_gen[j] = 1000 * (genType.fixed_cost_operate / (356.0*24.0) * (1.0/cn[j]**0.5))	# converts kW/y to kW/h
    opMaint_fac[j] = 1000 * (facType.fixed_cost_operate / (356.0*24.0) * (genCap/facCap))	# converts kW/y to kW/h
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
# roll_for_events():
#   
#   
#   this function runs every hour, so probabilities should be scaled accordingly
# ###############################################################################
def roll_for_events(game,db,mods,state):

  i = state['i']
  if game.turn_number%4==1:
    # Spring, nice weather, nothing bad ever happens in spring
    pass

  if game.turn_number%4==2:
    # Summer, 40% chance of heatwave
    # roll random number to decide if a new heatwave starts
    quarterlyProb = 1.5
    hourlyProb    = quarterlyProb / (90.0*24.0)
    if np.random.uniform(0,1)<hourlyProb or True:
      # roll random numbers to decide heatwave severity and duration, increase demand by 10-25% for 4-12 days
      dur  = 4+np.random.randint(9)
      peak = np.random.uniform(0.10,0.25)

      # create event object with message describing heatwave
      # push event notification to all companies
      # event = Prompt( id_type=1, description=desc, start=i, end=i+dur*24 )
      desc = 'A heatwave has struck and is expected to last for %i days, increasing energy demand by as much as %i percent' % (dur,np.ceil(peak*100))

      for company in Company.query.filter_by(id_game=game.id).all():
        event = Prompt(id_game=game.id, id_company=company.id, focus="company", category="warning", description=desc, start=i, end=i+dur*24)
        db.session.add(event)

      # event.companies = Company.query.filter_by(id_game=game.id).all()
      # create randomly fluctuating timeseries to represent increase in energy demand due to heat
      x1 = np.linspace(0,14,6)
      y1 = np.random.uniform(0.2,0.5,6)
      y1[0] = 0
      y1[-1] = 0
      y1 = y1*(1.0/(1+np.exp(-10*(x1-1))))*(1.0-1.0/(1+np.exp(-10*(x1-dur))))
      x2  = np.linspace(0,14,14*24)
      y2  = scipy.interpolate.interp1d(x1,y1,kind='cubic')(x2)
      y2 *= (1.0/(1+np.exp(-10*(x2-1))))*(1.0-1.0/(1+np.exp(-10*(x2-dur))))
      y2 /= np.max(y2)
      y2 *= peak
      y2 += 1.0
      # update the energy demand accordingly
      for jj in range(len(mods['ed'])):
        for kk in range(14*24):
          mods['ed'][jj][0][i+kk] *= y2[kk]
      # push event object to database
      # db.session.add(event)
      # db.session.commit()
      # in the future, the location of the heatwave would also be decided here
      # therefore the demand of individual cities might become too high for the transmission lines in some places
      # aint no tranmission network yet so we'll ignore that for now

  if game.turn_number%4==3:
    # Fall, 25% probability of hurricane
    # roll random number to decide if hurricane happens
    quarterlyProb = 2.00
    hourlyProb    = quarterlyProb / (90.0*24.0)
    if np.random.uniform(0,1)<hourlyProb or True:
      # roll random duration, location (has to be coastal)
      dur  = 4+np.random.randint(9)
      sev  = np.random.uniform(30,70)
      # determine set of facilities affected (ie knocked offline)
      x = [75,50,20,10,30,35,15,12,5,5]
      y = [120,105,100,90,85,75,55,40,20,5]
      cl = coastal_length(x,y)
      dc = np.random.uniform(0,cl)
      dS = dc-sev
      dN = dc+sev
      if dS<0: dS=0
      if dN>cl: dN=cl
      xc,yc=coastal_dist_to_xy(x,y,dc)
      xS,yS=coastal_dist_to_xy(x,y,dS)
      xN,yN=coastal_dist_to_xy(x,y,dN)
      xi = xc + sev*1.5
      yi = yc + np.random.normal(0,0.2*sev,1)
      polyx = [0, 0, xS, xi, xN, 0,  0]
      polyy = [yc,yS,yS, yi, yN, yN, yc]
      polygon = Polygon( zip(polyx,polyy) )
      for company in Company.query.all():
        # count facilities that are in the impacted polygon
        off_facs = []
        for facility in Facility.query.all():
          if company.player_number==facility.player_number:
            point = Point(facility.column, facility.row)
            if polygon.contains(point):
              off_facs += [facility]
        if len(off_facs)>0:
          desc = 'A hurricane has struck, and %i of your facilities are expected to be offline for %i days' % (len(off_facs),dur)
          event = Prompt( id_game=game.id, id_company=company.id, focus="company", category="danger", description=desc, start=game.turn_number, end=game.turn_number+dur)
          # event.companies += [company]
          db.session.add(event)
          # db.session.commit()
        else:
          desc = 'A hurricane has struck, none of your facilities were directly affected'
          event = Prompt(id_game=game.id, id_company=company.id, focus="company", category="information", description=desc, start=i, end=i+dur*24)
          # event.companies += [company]
          db.session.add(event)
          # db.session.commit()
      for facility in Facility.query.all():
        point = Point(facility.column, facility.row)
        if polygon.contains(point):
          facility.state='inactive'
          facility.counter=dur

      '''plt.figure()
      im = plt.imread("./app/static/img/world-map-240x120.png")
      implot = plt.imshow(im,origin='upper')
      plt.plot(x,y,c='b')
      plt.scatter(xS,yS,c='r')
      plt.scatter(xN,yN,c='r')
      plt.scatter(xi,yi,c='r')
      plt.plot( polyx, polyy, '--r' )
      polygon = Polygon( zip(polyx,polyy) )
      for city in City.query.all():
        point = Point(city.column, city.row)
        if polygon.contains(point):
          plt.scatter(city.column,city.row,s=20,c='red')
        plt.scatter(city.column,city.row,s=5,c='black')
      for facility in Facility.query.all():
        point = Point(facility.column, facility.row)
        if polygon.contains(point):
          plt.scatter(facility.column,facility.row,s=20,c='red')
        else:
          plt.scatter(facility.column,facility.row,s=20,c='black')
        plt.scatter(facility.column,facility.row,s=5,c='gray')
      plt.xlim([0,240])
      plt.ylim([0,120])
      plt.gca().invert_yaxis()
      plt.savefig('hurricane.eps',format='eps',bbox_inches='tight')
      plt.close()'''

    #desc = 'Blizzards are expected next quarter, consider weatherizing your facilities')
    #event = Event( title='Blizzard warning', desc=desc, start=game.turn_number, end=game.turn_number )
    #event.companies += Company.query.all()
    #db.session.add(event)
    #db.session.commit()

  if game.turn_number%4==0:
    # Winter, 25% probability of blizzard
    quarterlyProb = 0.75
    hourlyProb    = quarterlyProb / (90.0*24.0)
    if np.random.uniform(0,1)<hourlyProb or True:
      # roll random duration, location (has to be coastal)
      dur  = 4+np.random.randint(9)
      # determine set of facilities affected (ie knocked offline)
      polyx = [0, 0, 80, 160, 240,  240, 0]
      polyy = [0, np.random.uniform(20,60), np.random.uniform(20,60), np.random.uniform(20,60), np.random.uniform(20,60), 0, 0]
      polygon = Polygon( zip(polyx,polyy) )
      for company in Company.query.all():
        # count facilities that are in the impacted polygon
        off_facs = []
        for facility in Facility.query.all():
          if company.player_number==facility.player_number:
            point = Point(facility.column, facility.row)
            if polygon.contains(point) or facility.facility_type.maintype=='coal':
              off_facs += [facility]
        if len(off_facs)>0:
          desc = 'A blizzard has struck, and %i of your facilities are expected to be offline for %i days' % (len(off_facs),dur)
          event = Prompt( id_game=game.id, id_company=company.id, focus="company", category="danger", description=desc, start=i, end=i+dur*24)
          # event = Prompt( id_game=game.id, id_company=company.id, id_type=3, description=desc, start=i, end=i+dur*24 )
          db.session.add(event)
          # db.session.commit()
        else:
          desc = 'A blizzard has struck, none of your facilities were directly affected'
          event = Prompt( id_game=game.id, id_company=company.id, focus="company", category="information", description=desc, start=i, end=i+dur*24)
          # event = Prompt( id_game=game.id, id_company=company.id, id_type=3, description=desc, start=i, end=i+dur*24 )
          db.session.add(event)
          # db.session.commit()
      for facility in Facility.query.all():
        point = Point(facility.column, facility.row)
        if polygon.contains(point):
          facility.state='inactive'
          facility.counter=dur

      '''plt.figure()
      im = plt.imread("./app/static/img/world-map-240x120.png")
      implot = plt.imshow(im,origin='upper')
      plt.plot( polyx, polyy, '--r' )
      polygon = Polygon( zip(polyx,polyy) )
      for city in City.query.all():
        point = Point(city.column, city.row)
        if polygon.contains(point):
          plt.scatter(city.column,city.row,s=20,c='red')
        plt.scatter(city.column,city.row,s=5,c='black')
      for facility in Facility.query.all():
        point = Point(facility.column, facility.row)
        if polygon.contains(point) or facility.facility_type.maintype=='coal':
          plt.scatter(facility.column,facility.row,s=20,c='red')
        else:
          plt.scatter(facility.column,facility.row,s=20,c='black')
        plt.scatter(facility.column,facility.row,s=5,c='gray')
      plt.xlim([0,240])
      plt.ylim([0,120])
      plt.gca().invert_yaxis()
      plt.savefig('blizzard.eps',format='eps',bbox_inches='tight')
      plt.close()'''


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

def coastal_length(x,y):
  d=0.0
  for i in range(len(x)-1):
    d += ((x[i]-x[i+1])**2+(y[i]-y[i+1])**2)**0.5
  return d

def coastal_dist_to_xy(x,y,d0):
  d=0.0
  for i in range(len(x)-1):
    dd = ((x[i]-x[i+1])**2+(y[i]-y[i+1])**2)**0.5
    if (d+dd)>d0: break
    else: d+=dd
  x0 = x[i]+(x[i+1]-x[i])*(d0-d)/dd
  y0 = y[i]+(y[i+1]-y[i])*(d0-d)/dd
  return x0,y0

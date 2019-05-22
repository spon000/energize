import numpy as np
import math
import scipy
import scipy.stats
import matplotlib as mpl
mpl.use('Agg')
import matplotlib.pyplot as plt

from app import db
from app.models import Facility, Generator, City, Company, Game
from app.models import FacilityType, GeneratorType

def init_modifiers(cities):
  #t  = np.linspace(0,1*90,1*90*24)
  t  = np.linspace(0,1,1*24)
  # cc = cloud_cover(1*90*24)
  cc = cloud_cover(1*24)
  ri = rain_intensity(cc)
  su = sun_up(t)
  sp = solar_potential(cc,su)

  # fig, ax = plt.subplots(4,1)
  # ax[0].plot( t, cc )
  # ax[1].plot( t, ri )
  # ax[1].plot(t,0.1*np.ones(len(t)))
  # ax[1].plot(t,0.3*np.ones(len(t)))
  # ax[2].plot(t,su)
  # ax[3].plot(t,sp)
  # ax[0].set_xlim([0,7])
  # ax[1].set_xlim([0,7])
  # ax[2].set_xlim([0,7])
  # ax[3].set_xlim([0,7])
  # ax[0].set_ylim([-0.01,+1.01])
  # ax[1].set_ylim([-0.01,+0.35])
  # ax[2].set_ylim([-0.01,+1.01])
  # ax[3].set_ylim([-0.01,+1.01])
  # ax[0].set_ylabel('Cloud Cover [%]')
  # ax[1].set_ylabel('Rain Intensity [in/hr]')
  # ax[2].set_ylabel('Sun Up [%]')
  # ax[3].set_ylabel('Solar Potential [%]')
  # ax[3].set_xlabel('Time [days]')
  # plt.savefig('turn_ex1.png',format='png',bbox_inches='tight',dpi=300)
  # plt.savefig('turn_ex1.eps',format='eps',bbox_inches='tight')
  # plt.close()

  fp = fuel_prices(t)
  pg = pop_growth(t,cities)
  ed = energy_demand(t,pg,cc)

  # fig, ax = plt.subplots(2,1)
  # for g in pg: ax[0].plot( t, g )
  # for e in ed: ax[1].plot( t, e )
  # ax[0].set_xlabel('Time [years]')
  # ax[1].set_xlabel('Time [days]')
  # ax[0].set_ylabel('Population [millions]')
  # ax[1].set_ylabel('Demand [kWh]')
  # ax[1].set_xlim([0,7])
  # plt.savefig('turn_ex2.eps',format='eps',bbox_inches='tight')
  # plt.close()

  # plt.figure()
  # plt.plot( t, fp[0], label='Nuclear' )
  # plt.plot( t, fp[1], label='Coal' )
  # plt.plot( t, fp[2], label='Nat gas' )
  # plt.legend()
  # plt.xlabel('Time [years]')
  # plt.ylabel('Price [$/kWh]')
  # plt.savefig('turn_ex3.eps',format='eps',bbox_inches='tight')
  # plt.close()

  return {
    'cc' : cc,
    'ri' : ri,
    'su' : su,
    'sp' : sp,
    'fp' : fp,
    'pg' : pg,
    'ed' : ed
  }

def cloud_cover(nt):
  cc  = 0.5+np.cumsum(np.random.normal(0,0.25,nt))
  cc -= np.min(cc)
  cc /= np.max(cc)
  return cc

def rain_intensity(cc):
  rp  = 0.80*0.01**(1-cc)
  ri  = np.cumsum(np.random.normal(0,0.10,len(cc)))
  ri -= np.min(ri)
  ri /= np.max(ri)
  ri *= np.random.uniform(0.15,0.50)
  ri  = np.multiply(ri,rp)
  return ri

def sun_up(t):
  return 0.5+0.5*(2/np.pi)*np.arctan(np.sin(2*np.pi*(t-0.25)*1.0)/0.01)

def solar_potential(cc,su):
  return np.multiply( (1.0-0.8*cc), su )

def bounded_random_walk(min,max,nt):
  while True:
    rw = (min+max)/2.0+np.cumsum(np.random.normal(0,(max-min)*0.02,nt))
    if np.all(rw>min) and np.all(rw<max): break
  return rw

def fuel_prices(t):
  nuclear = bounded_random_walk(390/360000.0,2390/360000.0,len(t))
  coal    = bounded_random_walk(20/2460.0,50/2460.0,len(t))
  natgas  = bounded_random_walk(8/0.3/1000.0,26/0.3/1000.0,len(t))
  return [nuclear,coal,natgas]

def pop_growth(t,citiesPop):
  pg = []
  for city in citiesPop:
    pg     += [0]
    pg[-1]  = [city.population]
    gr      = bounded_random_walk(-0.0002,+0.0004,len(t)) / (24.0)
    for it in range(len(t)-1):
      pg[-1] += [pg[-1][-1] * (1+gr[it]) ]
  return pg

def energy_demand(t,pg,cc):
  ed=[]
  for cityPop in pg:
    ed += [1e-3*np.multiply(cityPop,(4+np.sin((t*24-6)*np.pi/12.0)+1.5*(1-cc)))]

  print ("*"*80)
  print (ed)
  return ed


############################################################
# turn process
def turn(generators, modifiers):
# def turn(gens,caps,costOn,costOff,fp,ed,sp):
  i=0
  # for day in range(90):
  for day in range(1):
    for hr in range(24):
      iso(generators, modifiers, i)
      i+=1  


def iso(gens, mods, i):  

  demand = np.sum(np.array(mods['ed'])[:,i])
  avail = []
  costF = []
  fuel_costs = []

  for j in range(len(gens)):
    fType = gens[j].facility.facility_type.maintype
    fCostOn = gens[j].generator_type.fixed_cost_operate / 8760.0   # 8,760 converts kw/y to kw/h
    gCapacity = gens[j].generator_type.nameplate_capacity * 1000.0  # convert to KW
    

    if fType == 'nuclear':
      # fixed cost + (fuel price / (energy content * efficiency))
      fuel_costs += [mods['fp'][0][i] / (gens[j].generator_type.resource_type.energy_content * 1)]
      costF += [fCostOn + (mods['fp'][0][i] / (gens[j].generator_type.resource_type.energy_content * 1))] 
      avail += [gCapacity]
    elif fType == 'coal':
      fuel_costs += [mods['fp'][0][i] / (gens[j].generator_type.resource_type.energy_content * 1)]
      costF += [fCostOn + (mods['fp'][1][i] / (gens[j].generator_type.resource_type.energy_content * 1))]
      avail += [gCapacity]
    elif fType == 'natural gas':
      fuel_costs += [mods['fp'][0][i] / (gens[j].generator_type.resource_type.energy_content * 1)]
      costF += [fCostOn + (mods['fp'][2][i] / (gens[j].generator_type.resource_type.energy_content * 1))]
      avail += [gCapacity]
    elif fType == 'solar':
      fuel_costs += [0]
      costF += [fCostOn]
      avail += [mods['sp'][i]*gCapacity]
    elif fType == 'wind':
      fuel_costs += [0]
      costF += [fCostOn]
      avail += [gCapacity]
    elif fType == 'hydro':
      fuel_costs += [0]
      costF += [fCostOn]
      avail += [gCapacity]

  jj     = np.argsort(costF)
  supply = 0
  price  = 0

  # print("-"*80)
  # print("costF = ", costF)
  # print("-"*80)
  # print(jj)

  for j in jj:
    if supply < demand:
      supply += avail[j]
      price   = costF[j]

  onOff=[]
  profit=[]
  player_profit = {
    "1": [],
    "2": [],
    "3": [],
    "4": [],
    "5": []
  }

  for j in range(len(gens)):
    player_num = str(gens[j].facility.player_number)
    fCostOn = gens[j].generator_type.fixed_cost_operate / 8760.0
    #fCostOff = fCostOn * 1.0
    if costF[j] < price: 
      player_profit[player_num] += [(price - fCostOn - fuel_costs[j]) * (avail[j] * 1e3)] 
    else: 
      player_profit[player_num] += [(-fCostOn) * (avail[j] * 1e3)]

  print("Iteration: " + str(i))
  column_headings = ["playnum", "price", "demand", "price*demand", "sum", "min", "max", "sumAvail"]
  print(" {: <10} {: <20} {: <20} {: <20} {: <20}  {: <20} {: <20} {: <20}".format(*column_headings))

  for pn in player_profit:
    row_data = [pn, str(price), str(demand), str(price*demand), str(np.sum(player_profit[pn])), str(np.min(player_profit[pn])), str(np.max(player_profit[pn])), str(np.sum(avail))]
    print(" {: <10} {: <20} {: <20} {: <20} {: <20} {: <20} {: <20} {: <20}".format(*row_data))

  # print(player_profit)  
  return None

##################################################################################
# main entry point
# genTypes  = np.array(['nuclear','coal','natgas','solar','hydro'])
# genProbs  = np.array([15.0,20.0,25.0,12.0,12.0])
# genProbs /= np.sum(genProbs)
# gens = np.random.choice(genTypes,50,p=genProbs)
# caps = np.random.uniform(20,800,len(gens))
# costOn  = np.random.uniform(0.01,0.15,len(gens))
# costOff = 0.5*costOn

# citiesPop = np.random.uniform(1,5,20)

# variables decoded:
# cc = cloud cover
# ri = rain intensity
# su = sun up
# sp = solar potential
# fp = fuel prices
# pg = population growth
# ed = energy demand

# genTypes = generator Types
# genProbs = ???
# costOn = ???
# costOff = ???

# [cc,ri,su,sp,fp,pg,ed] = start_game()
# turn(gens,caps,costOn,costOff,fp,ed,sp)

def calculate_quarter(generators, cities):
  modifiers = init_modifiers(cities)
  print("pg = ", modifiers["pg"][0][-1])
  print("ed = ", modifiers["ed"][0][-1])

  # for i in range(len(pg)):
  #   print("[" + str(math.floor(pg[i][-1])) +"]")
  #   cities[i].population = math.floor(pg[i][-1])

  # db.session.commit()
  # print("len of pg =", len(pg))
  
  turn(generators, modifiers)
  
  return None



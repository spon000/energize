import numpy as np
import pickle
import json
import logging
import time

from os import path
from collections import OrderedDict as od
# import math
# import time
# import scipy
# import scipy.signal
# import scipy.stats
# import matplotlib as mpl
# mpl.use('Agg')
# import matplotlib.pyplot as plt

# Setup logging parms
format = "%(asctime)s: %(filename)s: %(lineno)d: %(message)s"
logging.basicConfig(format=format, level=logging.INFO, datefmt="%H:%M:%S")

mods_filename_prefix = 'modifiers'
mods_filename_extension = '.pkl'

def init_modifiers(game, cities):

  # if modifiers file exists then load it instead of 
  # creating new one.
  if path.exists(get_filename(game.id)):
    return None
    
  logging.info("initializing Modifiers...")

  t  = np.linspace(0, 1, game.total_years * 4 * 90 * 24)

  cc = cloud_cover(t)
  ri = rain_intensity(cc)
  su = sun_up(t)
  sp = solar_potential(cc, su)

  fp = fuel_prices(t)
  pg = pop_growth(t, cities)
  ed = np.array(energy_demand(t, pg, su, cc))

  modifiers = {
    'cc':cc,
    'ri':ri,
    'su':su,
    'sp':sp,
    'fp':fp,
    'pg':pg,
    'ed':ed
  }

  mods_filename = get_filename(game.id)
  mods_file = open(mods_filename, 'wb')
  pickle.dump(modifiers, mods_file)
  mods_file.close()

  return modifiers

def get_filename(gid):
  # return mods_filename_prefix + str(gid) + mods_filename_extension
  return mods_filename_prefix + '1' + mods_filename_extension


def load_modifiers(game):
  mods_filename = get_filename(game.id)
  mods_file = open(mods_filename, 'rb')
  modifiers = pickle.load(mods_file)
  return modifiers


def cloud_cover(t):
  cc  = 0.5+np.cumsum(np.random.normal(0,0.25,len(t)))
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
  return 0.5+0.5*(2/np.pi)*np.arctan(np.sin(2*np.pi*(t*90*4-0.25)*1.0)/0.01)

def solar_potential(cc,su):
  return np.multiply( (1.0-0.8*cc), su )

def bounded_random_walk(min,max,nt):
  while True:
    rw = (min+max)/2.0+np.cumsum(np.random.normal(0,(max-min)*0.02,3000))
    if np.all(rw>min) and np.all(rw<max): break
  x0 = np.array(range(3000))*(nt/3000.0)
  x1 = np.array(range(nt))
  return np.interp(x1,x0,rw)

def fuel_prices(t):
  nuclear = bounded_random_walk(390,2390,len(t))
  coal    = bounded_random_walk(20/2000.0,50/2000.0,len(t))
  natgas  = bounded_random_walk(2/1000.0,6/1000.0,len(t))

  # plt.figure()
  # plt.plot(nuclear,label='nuclear')
  # plt.plot(coal / (12000.0/10465.0), label='coal')
  # plt.plot(natgas / (1010.0/7812.0), label='natgas')
  # plt.legend()
  # plt.savefig('fuels.eps',format='eps',bbox_inches='tight')
  # plt.close()
  return [nuclear,coal,natgas]

def pop_growth(t, citiesPop):
  cities = {}
  for city in citiesPop:
    cities[city.name] = [city.population]
    gr = bounded_random_walk(-0.02, +0.04, len(t)) / (90 * 4 * 24.0)
    for it in range(len(t)-1):
      cities[city.name] += [cities[city.name][-1] * (1 + gr[it])]
    
  # plt.figure()
  # plt.plot( t,np.sum(np.array(pg),axis=0) )
  # plt.savefig('pop_growth.eps',format='eps',bbox_inches='tight')
  # plt.close()
  return cities

def energy_demand(t, pg, su, cc):
  ed=[]
  for cityPop in pg:
    pop = pg[cityPop]
    ed += [0]
    ed[-1] = (0.65 * np.multiply(3.0 * np.array(pop, dtype='float'), (1.75 + 0.5 * np.sin(t * np.pi / (90.0 * 4.0)) + 0.5 * su + 0.15 * (1 - cc))))

  # plt.figure()
  # plt.plot( t,np.sum(np.array(ed).squeeze()/1.0e6,axis=0) )
  # plt.savefig('energy_demand.eps',format='eps',bbox_inches='tight')
  # plt.close()
  return ed

def debug_output_modifiers(state_i, mods):
  return (
    f"Modifiers for hour {state_i}:\n" +
    f"CC (Cloud Cover) = {mods['cc'][state_i]}\n" +
    f"RI (Rain Intensity) = {mods['ri'][state_i]}\n" +
    f"SU (Sun-up) = {mods['su'][state_i]}\n" +
    f"SP (Solar Potential) = {mods['sp'][state_i]}\n" +
    f"FP (Fuel Prices) - Nuclear = {mods['fp'][0][state_i]}\n" +
    f"FP (Fuel Prices) - Coal = {mods['fp'][1][state_i]}\n" +
    f"FP (Fuel Prices) - NatGas = {mods['fp'][2][state_i]}\n" +
    f"PG and ED (Population Growth and Energy Demand):\n" +
    "".join([f"PG & ED for city, {cityname}. PG = {mods['pg'][cityname][state_i]}, ED = {mods['ed'][idx][state_i]}\n" for idx, cityname in enumerate(mods['pg'])]) 
  )


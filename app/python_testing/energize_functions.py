import sys
# from header import *
import numpy as np

def clouds(year): return 0.6+0.1*np.sin(year*20)+0.1*np.sin(year*20*365)
def wind(year):   return 0.8+0.2*np.sin(year*20)
def rain(year):   return 0.8-0.2*np.sin(year*20)
def nuke(year):   return (year % 1.5)>(2.0/52.0)

def dist(n1, n2):
  return ((n1[0] - n2[0])**2 + (n1[1] - n2[1])**2)**0.5

def rng(G):
  for c1 in G.nodes():
    for c2 in G.nodes():
      d = dist(c1, c2)
      for possible_blocker in G.nodes():
        distToC1 = dist(possible_blocker, c1)
        distToC2 = dist(possible_blocker, c2)
        if distToC1 < d and distToC2 < d: break
      else:
        G.add_edge(c1, c2)

def demand_residential(var_mod=0,random_walk=0,spike_prob=0):
  t   = np.linspace(0,24,1000)
  eu  = 4+0.0*np.sin((t-6)*np.pi/12.0)
  mu  = np.random.normal(7.0,0.5*var_mod)
  vr  = np.random.normal(1.0,0.1*var_mod)
  mag = np.random.normal(1.0,0.1*var_mod)
  lam = np.random.normal(0.35,0.03*var_mod)
  eu += mag * np.exp( (lam/2.0) * (2.0*mu + lam*vr**2 - 2*t) ) * ( 1 - scipy.special.erf( (mu+lam*vr**2-t)/(2**0.5 * vr) ) )
  mu  = np.random.normal(5.0,0.5*var_mod)
  vr  = np.random.normal(1.0,0.1*var_mod)
  mag = np.random.normal(1.0,0.1*var_mod)
  lam = np.random.normal(0.5,0.05*var_mod)
  eu += (mag * np.exp( (lam/2.0) * (2.0*mu + lam*vr**2 - 2*t) ) * ( 1 - scipy.special.erf( (mu+lam*vr**2-t)/(2**0.5 * vr) ) ))[::-1]
  eu /= np.mean(eu)
  eu *= 4.5
  eu += random_walk*np.mean(eu)*0.001*np.cumsum(np.random.normal(0,1,1000))
  if np.random.uniform(0,1)<spike_prob:
    ts  = np.random.uniform(0,24)
    vr  = np.random.uniform(0.1,0.5)
    ts  = 15
    vr  = 0.18
    eu += 0.5*(np.max(eu)-np.min(eu)) * 1/(vr**2*2*math.pi)**0.5 * np.exp( -0.5 * (t-ts)**2 / (2*vr**2) )
  return t,eu

def demand_commercial(var_mod=0,random_walk=0,spike_prob=0):
  t   = np.linspace(0,24,1000)
  eu  = 4+0.4*np.sin((t-6)*np.pi/12.0)
  mu  = np.random.normal(8.0,0.5*var_mod)
  vr  = np.random.normal(1.0,0.1*var_mod)
  mag = np.random.normal(1.0,0.1*var_mod)
  lam = np.random.normal(0.25,0.025*var_mod)
  eu += mag * np.exp( (lam/2.0) * (2.0*mu + lam*vr**2 - 2*t) ) * ( 1 - scipy.special.erf( (mu+lam*vr**2-t)/(2**0.5 * vr) ) )
  mu  = np.random.normal(6.0,0.5*var_mod)
  vr  = np.random.normal(1.0,0.1*var_mod)
  mag = np.random.normal(1.0,0.1*var_mod)
  lam = np.random.normal(0.45,0.045*var_mod)
  eu += (mag * np.exp( (lam/2.0) * (2.0*mu + lam*vr**2 - 2*t) ) * ( 1 - scipy.special.erf( (mu+lam*vr**2-t)/(2**0.5 * vr) ) ))[::-1]
  eu /= np.mean(eu)
  eu *= 6.4
  eu += random_walk*np.mean(eu)*0.001*np.cumsum(np.random.normal(0,1,1000))
  if np.random.uniform(0,1)<spike_prob:
    ts  = np.random.uniform(0,24)
    vr  = np.random.uniform(0.1,0.5)
    eu += 0.3*(np.max(eu)-np.min(eu)) * 1/(vr**2*2*math.pi)**0.5 * np.exp( -0.5 * (t-ts)**2 / (2*vr**2) )
  return t,eu

def demand_agricultural(var_mod=0,random_walk=0,spike_prob=0):
  t   = np.linspace(0,24,1000)
  eu  = 4+0.4*np.sin((t-6)*np.pi/12.0)
  mu  = np.random.normal(5.0,0.5*var_mod)
  vr  = np.random.normal(1.0,0.1*var_mod)
  mag = np.random.normal(1.5,0.1*var_mod)
  lam = np.random.normal(0.10,0.001*var_mod)
  eu += mag * np.exp( (lam/2.0) * (2.0*mu + lam*vr**2 - 2*t) ) * ( 1 - scipy.special.erf( (mu+lam*vr**2-t)/(2**0.5 * vr) ) )
  mu  = np.random.normal(5.0,0.5*var_mod)
  vr  = np.random.normal(1.0,0.1*var_mod)
  mag = np.random.normal(1.0,0.1*var_mod)
  lam = np.random.normal(0.35,0.035*var_mod)
  eu += (mag * np.exp( (lam/2.0) * (2.0*mu + lam*vr**2 - 2*t) ) * ( 1 - scipy.special.erf( (mu+lam*vr**2-t)/(2**0.5 * vr) ) ))[::-1]
  eu /= np.mean(eu)
  eu *= 0.03
  eu += random_walk*np.mean(eu)*0.001*np.cumsum(np.random.normal(0,1,1000))
  if np.random.uniform(0,1)<spike_prob:
    ts  = np.random.uniform(0,24)
    vr  = np.random.uniform(0.1,0.5)
    eu += 0.3*(np.max(eu)-np.min(eu)) * 1/(vr**2*2*math.pi)**0.5 * np.exp( -0.5 * (t-ts)**2 / (2*vr**2) )
  return t,eu

def demand_industrial(var_mod=0,random_walk=0,spike_prob=0):
  t    = np.linspace(0,24,1000)

  base = 90
  eu   = np.ones(1000)*base

  k    = np.random.normal(3.0,0.3*var_mod)
  t0   = np.random.normal(7.0,0.5*var_mod)
  t1   = np.random.normal(17.0,0.5*var_mod)
  peak = np.random.normal(5.0,0.5*var_mod)
  eu  += peak*1/(1+np.exp(-k*(t-t0)))*(1- 1/(1+np.exp(-k*(t-t1))))

  mu  = np.random.normal(7.0,0.5*var_mod)
  vr  = np.random.normal(1.0,0.1*var_mod)
  mag = np.random.normal(0.5,0.1*var_mod)
  lam = 0.5
  eu += mag * np.exp( (lam/2.0) * (2.0*mu + lam*vr**2 - 2*t) ) * ( 1 - scipy.special.erf( (mu+lam*vr**2-t)/(2**0.5 * vr) ) )

  eu  /= np.mean(eu)
  eu  *= 95
  eu += 0.5*random_walk*np.mean(eu)*0.001*np.cumsum(np.random.normal(0,1,1000))
  if np.random.uniform(0,1)<spike_prob:
    ts  = np.random.uniform(0,24)
    vr  = np.random.uniform(0.1,0.5)
    eu += 0.3*(np.max(eu)-np.min(eu)) * 1/(vr**2*2*math.pi)**0.5 * np.exp( -0.5 * (t-ts)**2 / (2*vr**2) )
  return t,eu

def demand(cities):

  eu1 = np.zeros(1000)
  eu2 = np.zeros(1000)
  eu3 = np.zeros(1000)
  eu4 = np.zeros(1000)
  for city in cities:
    for cxa in city.cxas:
      for lxa in cxa.agent.lxas:
        if lxa.landUse.title=='Agricultural':
          t,eu = demand_agricultural(1,20)
          eu1 += eu * cxa.presence * lxa.percentage / 1.0e6
        if lxa.landUse.title=='Residential':
          t,eu = demand_residential(1,20,0.05)
          eu2 += eu * cxa.presence * lxa.percentage / 1.0e6
        if lxa.landUse.title=='Commercial':
          t,eu = demand_commercial(1,20)
          eu3 += eu * cxa.presence * lxa.percentage / 1.0e6
        if lxa.landUse.title=='Industrial':
          t,eu = demand_industrial(1,20)
          eu4 += eu * cxa.presence * lxa.percentage / 1.0e6

  return t,eu1+eu2+eu3+eu4


def demand_daily(cities):
  d = demand(cities)
  t = np.linspace(0,24,1000)
  return np.multiply(np.diff(t),d[1:])

def produce_random_nuclear():
  nc  = np.random.uniform(0.5,1.4,1)[0]
  mc  = 1.0 + 0.5/((nc+0.200)/1.20)
  mc *= np.random.normal(1,0.20,1)[0]
  cc  = 1.2+(0.3+nc*1.2)*np.random.normal(1,0.30,1)[0]
  return np.array([100,'nuclear',nc,mc,cc]).reshape(1,5)

def produce_random_coal():
  nc  = np.random.uniform(0.20,1.70,1)[0]
  mc  = 0.5 + 3/((nc+0.200)/1.20)
  mc *= np.random.normal(1,0.20,1)[0]
  cc  = 0.4+(0.35+nc*1.2)*np.random.normal(1,0.30,1)[0]
  return np.array([100,'coal',nc,mc,cc]).reshape(1,5)

def produce_random_natgas():
  nc  = np.random.uniform(0.05,3.70,1)[0]
  mc  = 0.5 + 2.1/((nc+0.200)/1.20)
  mc *= np.random.normal(1,0.40,1)[0]
  cc  = 0.1+(0.20+nc*0.6)*np.random.normal(1,0.30,1)[0]
  return np.array([100,'natgas',nc,mc,cc]).reshape(1,5)

def produce_random_oil():
  nc  = np.random.uniform(0.05,2.70,1)[0]
  mc  = 4 + 4.5/((nc+0.200)/1.20)
  mc *= np.random.normal(1,0.20,1)[0]
  cc  = 0.4+(0.3+nc*1.2)*np.random.normal(1,0.30,1)[0]
  return np.array([100,'oil',nc,mc,cc]).reshape(1,5)

def produce_random_hydro():
  nc  = np.random.uniform(1,20,1)[0]
  mc  = 1+1.0/((nc+0.200)/1.20)
  mc *= np.random.normal(1,0.20,1)[0]
  cc  = 0.25+(0.1+nc*0.3)*np.random.normal(1,0.30,1)[0]
  return np.array([100,'hydro',nc,mc,cc]).reshape(1,5)

def produce_random_solar():
  nc  = np.random.uniform(0.05,5,1)[0]
  mc  = 0.1 + 1/((nc+0.200)/1.20)
  mc *= np.random.normal(1,0.20,1)[0]
  cc  = 0.3+(0.5+nc*1.2)*np.random.normal(1,0.30,1)[0]
  return np.array([100,'solar',nc,mc,cc]).reshape(1,5)

def produce_random_wind():
  nc  = np.random.uniform(0.05,3,1)[0]
  mc  = 0.1 + 1.8/((nc+0.200)/1.20)
  mc *= np.random.normal(1,0.20,1)[0]
  cc  = 0.3+(0.5+nc*1.2)*np.random.normal(1,0.30,1)[0]
  return np.array([100,'wind',nc,mc,cc]).reshape(1,5)

def produce_random_mix(demand):
  gens = np.zeros([0,5])
  while True:
    r = np.random.uniform(0,1)
    if   r<0.10: gens = np.vstack([gens,produce_random_nuclear()])
    elif r<0.40: gens = np.vstack([gens,produce_random_coal()])
    elif r<0.70: gens = np.vstack([gens,produce_random_natgas()])
    elif r<0.80: gens = np.vstack([gens,produce_random_oil()])
    elif r<0.82: gens = np.vstack([gens,produce_random_hydro()])
    elif r<0.84: gens = np.vstack([gens,produce_random_solar()])
    elif r<0.86: gens = np.vstack([gens,produce_random_wind()])
    else:        pass

    sum= np.sum(np.array(gens[:,2],dtype='float'))
    if sum>=(demand*1.20): return gens

'''      i1 = np.where(gens[:,1]=='coal')[0]
      i2 = np.where(gens[:,1]=='nuclear')[0]
      i3 = np.where(gens[:,1]=='oil')[0]
      i4 = np.where(gens[:,1]=='natgas')[0]
      i5 = np.where(gens[:,1]=='hydro')[0]
      i6 = np.where(gens[:,1]=='solar')[0]
      i7 = np.where(gens[:,1]=='wind')[0]
      p_coal    = np.sum(np.array(gens[:,2],dtype='float')[i1]) / sum
      p_nuclear = np.sum(np.array(gens[:,2],dtype='float')[i2]) / sum
      p_oil     = np.sum(np.array(gens[:,2],dtype='float')[i3]) / sum
      p_natgas  = np.sum(np.array(gens[:,2],dtype='float')[i4]) / sum
      p_hydro   = np.sum(np.array(gens[:,2],dtype='float')[i5]) / sum
      p_solar   = np.sum(np.array(gens[:,2],dtype='float')[i6]) / sum
      p_wind    = np.sum(np.array(gens[:,2],dtype='float')[i7]) / sum'''

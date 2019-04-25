import numpy as np
import scipy
import scipy.stats
import matplotlib as mpl
mpl.use('Agg')
import matplotlib.pyplot as plt

def start_game():


  t  = np.linspace(0,1*90,1*90*24)
  cc = cloud_cover(1*90*24)
  ri = rain_intensity(cc)
  su = sun_up(t)
  sp = solar_potential(cc,su)

  fig, ax = plt.subplots(4,1)
  ax[0].plot( t, cc )
  ax[1].plot( t, ri )
  ax[1].plot(t,0.1*np.ones(len(t)))
  ax[1].plot(t,0.3*np.ones(len(t)))
  ax[2].plot(t,su)
  ax[3].plot(t,sp)
  ax[0].set_xlim([0,7])
  ax[1].set_xlim([0,7])
  ax[2].set_xlim([0,7])
  ax[3].set_xlim([0,7])
  ax[0].set_ylim([-0.01,+1.01])
  ax[1].set_ylim([-0.01,+0.35])
  ax[2].set_ylim([-0.01,+1.01])
  ax[3].set_ylim([-0.01,+1.01])
  ax[0].set_ylabel('Cloud Cover [%]')
  ax[1].set_ylabel('Rain Intensity [in/hr]')
  ax[2].set_ylabel('Sun Up [%]')
  ax[3].set_ylabel('Solar Potential [%]')
  ax[3].set_xlabel('Time [days]')
  plt.savefig('turn_ex1.png',format='png',bbox_inches='tight',dpi=300)
  plt.savefig('turn_ex1.eps',format='eps',bbox_inches='tight')
  plt.close()

  fp = fuel_prices(t)
  pg = pop_growth(t,citiesPop)
  ed = energy_demand(t,pg,cc)

  fig, ax = plt.subplots(2,1)
  for g in pg: ax[0].plot( t, g )
  for e in ed: ax[1].plot( t, e )
  ax[0].set_xlabel('Time [years]')
  ax[1].set_xlabel('Time [days]')
  ax[0].set_ylabel('Population [millions]')
  ax[1].set_ylabel('Demand [kWh]')
  ax[1].set_xlim([0,7])
  plt.savefig('turn_ex2.eps',format='eps',bbox_inches='tight')
  plt.close()

  plt.figure()
  plt.plot( t, fp[0], label='Nuclear' )
  plt.plot( t, fp[1], label='Coal' )
  plt.plot( t, fp[2], label='Nat gas' )
  plt.legend()
  plt.xlabel('Time [years]')
  plt.ylabel('Price [$/kWh]')
  plt.savefig('turn_ex3.eps',format='eps',bbox_inches='tight')
  plt.close()

  return cc,ri,su,sp,fp,pg,ed

def turn(gens,caps,costOn,costOff,fp,ed,sp):
  i=0
  for day in range(90):
    for hr in range(24):
      iso(gens,caps,costOn,costOff,fp,ed,sp,i)
      i+=1

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
    pg[-1]  = [city]
    gr      = bounded_random_walk(-0.015,+0.035,len(t)) / (24.0)
    for it in range(len(t)-1):
      pg[-1] += [pg[-1][-1] * (1+gr[it]) ]
  return pg

def energy_demand(t,pg,cc):
  ed=[]
  for cityPop in pg:
    ed += [1e-3*np.multiply(cityPop,(4+np.sin((t*24-6)*np.pi/12.0)+1.5*(1-cc)))]
  return ed

def iso(gens,caps,costOn,costOff,fp,ed,sp,i):

  demand = np.sum(np.array(ed)[:,i])

  avail = []
  costF = []
  for j in range(len(gens)):
    if   gens[j]=='nuclear':
      costF += [costOn[j] + fp[0][i]]
      avail += [caps[j]]
    elif gens[j]=='coal':
      costF += [costOn[j] + fp[1][i]]
      avail += [caps[j]]
    elif gens[j]=='natgas':
      costF += [costOn[j] + fp[2][i]]
      avail += [caps[j]]
    elif gens[j]=='solar':
      costF += [costOn[j]]
      avail += [sp[i]*caps[j]]
    elif gens[j]=='hydro':
      costF += [costOn[j]]
      avail += [caps[j]]

  jj    = np.argsort(costF)
  supply = 0
  price  = 0
  for j in jj:
    if supply<demand:
      supply += avail[j]
      price   = costF[j]

  onOff=[]
  profit=[]
  for j in range(len(gens)):
    if costF[j]<price: profit+=[(price-costOn)*avail[j]*1e3]
    else:              profit+=[(-costOff)*avail[j]*1e3]

  print (price, demand, price*demand, np.sum(profit), np.min(profit), np.max(profit))

##################################################################################
# main entry point
genTypes  = np.array(['nuclear','coal','natgas','solar','hydro'])
genProbs  = np.array([15.0,20.0,25.0,12.0,12.0])
genProbs /= np.sum(genProbs)
gens = np.random.choice(genTypes,50,p=genProbs)
caps = np.random.uniform(20,800,len(gens))
costOn  = np.random.uniform(0.01,0.15,len(gens))
costOff = 0.5*costOn

citiesPop = np.random.uniform(1,5,20)

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
cost
[cc,ri,su,sp,fp,pg,ed] = start_game()
turn(gens,caps,costOn,costOff,fp,ed,sp)

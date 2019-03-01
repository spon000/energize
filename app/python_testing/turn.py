import sys
from header import *
from energize_classes import *
from energize_functions import *

db_addr  = 'localhost'
db_user  = 'remote'
db_pswd  = 'geomech173'
db_title = 'energize'

engine  = sqlalchemy.create_engine('mysql+mysqldb://%s:%s@localhost/%s'%(db_user,db_pswd,db_title), echo=False)
Base.metadata.create_all(engine)

Session = sessionmaker()
Session.configure(bind=engine)
session = Session()

cities   = session.query(City).all()
agents   = session.query(Agent).all()
landUses = session.query(LandUse).all()

data = pickle.load(open('init.pkl','rb'))
gens = data['gens']
fuel_dict  = data['fuel_dict']
color_dict = data['color_dict']

types = np.array(gens[:,1])
nc = np.array(gens[:,2],dtype='float')
mc = np.array(gens[:,3],dtype='float')
cc = np.array(gens[:,4],dtype='float')

ns = np.linspace(0,1.5,len(np.where(gens[:,1]=='nuclear')[0]))

colors = np.array([ color_dict[type] for type in types ])

while True:
  rw1 = 1+np.cumsum(np.random.normal(0,0.002,10*90*24))
  if np.all(rw1>0.5) and np.all(rw1<1.5): break

while True:
  rw2 = 1+np.cumsum(np.random.normal(0,0.002,10*90*24))
  if np.all(rw2>0.5) and np.all(rw2<1.5): break

while True:
  rw3 = 1+np.cumsum(np.random.normal(0,0.002,10*90*24))
  if np.all(rw3>0.5) and np.all(rw3<1.5): break

while True:
  rw4 = 1+np.cumsum(np.random.normal(0,0.002,10*90*24))
  if np.all(rw4>0.5) and np.all(rw4<1.5): break

plt.figure()
plt.plot(rw1)
plt.plot(rw2)
plt.plot(rw3)
plt.plot(rw4)
plt.savefig('rw.eps',format='eps',bbox_inches='tight')
plt.close()

t1 = np.linspace(0,10,10*90*24)
d3 = np.zeros([0],dtype='float')
i=0
year=0
for quarter in range(10):
  t0=time.time()
  for day in range(90):

    t,eu1 = demand_residential(1,1,0.1)
    t,eu2 = demand_commercial(1,1,0.1)
    t,eu3 = demand_industrial(1,1,0.1)
    t,eu4 = demand_agricultural(1,1,0.1)
    eu  = eu1+eu2+eu3+eu4
    rs  = np.cumsum(24.0/1000.0*eu)
    rs0 = np.interp( range(25), t,rs )
    eu  = np.diff(rs0)
    d3  = np.concatenate([d3,eu])

    for hour in range(24):

      year+=1/(365*24)
      av = np.ones(gens.shape[0])
      av[np.where(gens[:,1]=='solar')[0]]   = clouds(year)
      av[np.where(gens[:,1]=='wind')[0]]    = wind(year)
      av[np.where(gens[:,1]=='hydro')[0]]   = rain(year)
      av[np.where(gens[:,1]=='nuclear')[0]] = nuke(year)

      fuel_dict['coal']    = rw1[i] * 30/2460.0
      fuel_dict['oil']     = rw2[i] * 105/1699.0
      fuel_dict['natgas']  = rw3[i] * 17/0.3/1000.0
      fuel_dict['nuclear'] = rw4[i] * 1390/360000.0
      i+=1
      fc = np.array([ fuel_dict[type]*100 for type in types ])
      print fc.shape, mc.shape
      ii = np.argsort(mc+fc)
      ac = np.multiply(nc,av)

#  print time.time()-t0

      if i%1000==0:
        print year, quarter, day, hour, i
        plt.figure(figsize=(16,8))

        ax1 = plt.subplot2grid((2,10), (0,0), rowspan=1, colspan=6)
        ax1.plot(t1[:i],d3[:i],c='r',label='Real Demand',zorder=3)
#        ax1.plot(t1[i:],dt3,c='k',label='Live Demand Forecast',zorder=2)
#        ax1.plot(t1[i:],ub3,'--',c='k',zorder=2)
#        ax1.plot(t1[i:],lb3,'--',c='k',zorder=2)
#        ax1.plot(t1,dt,c=[0.6,0.6,0.6],label='Prior Demand Forecast',zorder=1)
#        ax1.plot(t1,ub,'--',c=[0.6,0.6,0.6],zorder=1)
#        ax1.plot(t1,lb,'--',c=[0.6,0.6,0.6],zorder=1)
        ax1.legend()
        ax1.set_xlabel('Time [years]',fontsize=14)
        ax1.set_ylabel('Energy Demand [GW]',fontsize=14)
#        ax1.set_xlim([-1,21])
#        ax1.set_ylim([dmin,dmax])

        ax2 = plt.subplot2grid((2,10), (1,0), rowspan=1, colspan=6)
        ax2.scatter(np.cumsum(ac[ii]),(mc[ii]+cc[ii]+fc[ii]),marker='x',s=10,c=colors[ii],edgecolor='none')
        ax2.scatter(np.cumsum(ac[ii]),(mc[ii]+fc[ii]),s=20,c=colors[ii],edgecolor='none',zorder=1)
#        tp = np.interp( d3[i], np.cumsum(ac[ii]), (mc[ii]+fc[ii]) )
#        ax2.plot([d3[i],d3[i],-1],[0,tp,tp],'--',c=[0.6,0.6,0.6],zorder=0)
#        ax2.set_ylim([0,dmax1])
        ax2.set_xlabel('Cumulative Nameplate Capacity [MW]',fontsize=14)
#        ax2.set_ylabel('Costs [\xa2/kWh]',fontsize=14)

        ax3 = plt.subplot2grid((2,10), (0,6), colspan=2)
        ax3.plot( t1[:i], rw1[:i]*30, c=color_dict['coal'], label='Coal price [\$/ton]' )
#        ax3.plot( t1,30*1.1*(1+0.02+0.08**2)**t1, '--', c=color_dict['coal'] )
#        ax3.plot( t1,30*0.9*(1+0.02-0.08**2)**t1, '--', c=color_dict['coal'] )
#        ax3.plot( t1[i:], rw1[i]*30 * 1.02**(t1[i:]-t1[i]), '-',  c=color_dict['coal'] )
#        ax3.plot( t1[i:], rw1[i]*30 * 1.01**(t1[i:]-t1[i]), '--', c=color_dict['coal'] )
#        ax3.plot( t1[i:], rw1[i]*30 * 1.03**(t1[i:]-t1[i]), '--', c=color_dict['coal'] )
        ax3.set_xlim([-1,11])
        ax3.set_ylim([ np.min(rw1*30), np.max(rw1*30) ])
        ax3.set_xlabel('Time [years]',fontsize=14)
        ax3.yaxis.tick_right()
        ax3.legend(loc=2)

        ax4 = plt.subplot2grid((2,10), (1,6), colspan=2)
        ax4.plot( t1[:i], rw2[:i]*105, c=color_dict['oil'], label='Oil price [\$/bbl]' )
#        ax4.plot( t1,105*1.1*(1+0.02+0.08**2)**t1, '--', c=color_dict['oil'] )
#        ax4.plot( t1,105*0.9*(1+0.02-0.08**2)**t1, '--', c=color_dict['oil'] )
#        ax4.plot( t1[i:], rw2[i]*105 * 1.02**(t1[i:]-t1[i]), '-',  c=color_dict['oil'] )
#        ax4.plot( t1[i:], rw2[i]*105 * 1.01**(t1[i:]-t1[i]), '--', c=color_dict['oil'] )
#        ax4.plot( t1[i:], rw2[i]*105 * 1.03**(t1[i:]-t1[i]), '--', c=color_dict['oil'] )
        ax4.set_xlim([-1,11])
        ax4.set_ylim([ np.min(rw2*105), np.max(rw2*105) ])
        ax4.set_xlabel('Time [years]',fontsize=14)
        ax4.yaxis.tick_right()
        ax4.legend(loc=2)

        ax5 = plt.subplot2grid((2,10), (0,8), colspan=2)
        ax5.plot( t1[:i], rw3[:i]*17, c=color_dict['natgas'], label='Nat Gas price [\$/kft$^3$]' )
#        ax5.plot( t1,17*1.1*(1+0.02+0.08**2)**t1, '--', c=color_dict['natgas'] )
#        ax5.plot( t1,17*0.9*(1+0.02-0.08**2)**t1, '--', c=color_dict['natgas'] )
#        ax5.plot( t1[i:], rw3[i]*17 * 1.02**(t1[i:]-t1[i]), '-',  c=color_dict['natgas'] )
#        ax5.plot( t1[i:], rw3[i]*17 * 1.01**(t1[i:]-t1[i]), '--', c=color_dict['natgas'] )
#        ax5.plot( t1[i:], rw3[i]*17 * 1.03**(t1[i:]-t1[i]), '--', c=color_dict['natgas'] )
        ax5.set_xlim([-1,11])
        ax5.set_ylim([ np.min(rw3*17), np.max(rw3*17) ])
        ax5.set_xlabel('Time [years]',fontsize=14)
        ax5.yaxis.tick_right()
        ax5.legend(loc=2)

        ax6 = plt.subplot2grid((2,10), (1,8), colspan=2)
        ax6.plot( t1[:i], rw4[:i] * 1390, c=color_dict['nuclear'], label='UOx price [\$/kg]' )
#        ax6.plot( t1,1390*1.1*(1+0.02+0.08**2)**t1, '--', c=color_dict['nuclear'] )
#        ax6.plot( t1,1390*0.9*(1+0.02-0.08**2)**t1, '--', c=color_dict['nuclear'] )
#        ax6.plot( t1[i:], rw4[i]*1390 * 1.02**(t1[i:]-t1[i]), '-',  c=color_dict['nuclear'] )
#        ax6.plot( t1[i:], rw4[i]*1390 * 1.01**(t1[i:]-t1[i]), '--', c=color_dict['nuclear'] )
#        ax6.plot( t1[i:], rw4[i]*1390 * 1.03**(t1[i:]-t1[i]), '--', c=color_dict['nuclear'] )
        ax6.set_xlim([-1,11])
        ax6.set_ylim([ np.min(rw4*1390), np.max(rw4*1390) ])
        ax6.set_xlabel('Time [years]',fontsize=14)
        ax6.yaxis.tick_right()
        ax6.legend(loc=2)

        plt.tight_layout()
        plt.savefig('./figs/nameplateCap_marginalCostSorted3_%05i.png'%i,format='png',bbox_inches='tight')
        plt.close()

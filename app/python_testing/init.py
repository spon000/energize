import sys
from header import *
from energize_classes import *
from energize_functions import *

db_addr  = 'localhost'
db_user  = 'remote'
db_pswd  = 'geomech173'
db_title = 'energize'

con = MySQLdb.connect( db_addr, db_user, db_pswd )
cur = con.cursor()
cur.execute("DROP DATABASE IF EXISTS %s" % db_title)
con.commit()
cur.execute("CREATE DATABASE %s" % db_title)
cur.execute("USE %s" % db_title)
con.commit()
con.close()

engine  = sqlalchemy.create_engine('mysql+mysqldb://%s:%s@localhost/%s'%(db_user,db_pswd,db_title), echo=False)
Base.metadata.create_all(engine)

Session = sessionmaker()
Session.configure(bind=engine)
session = Session()

nCities = 50

xy = np.random.uniform(0,1000,[nCities,2])

G = nx.Graph()
for i in range(len(xy)):
  G.add_node( (xy[i,0],xy[i,1]), x=xy[i,0], y=xy[i,1])
rng(G)

pop = 10**np.random.uniform(np.log10(8e2),np.log10(8e6),[nCities])

cities=[]
for i in range(nCities):
  cities += [ City( title='City %i'%i, nPop=pop[i] ) ]

landUses=[]
landUses+=[ LandUse(title='Residential') ]
landUses+=[ LandUse(title='Commercial') ]
landUses+=[ LandUse(title='Industrial') ]
landUses+=[ LandUse(title='Agricultural') ]

agents=[]
agents+=[ Agent( title='Aggregated' ) ]
agents+=[ Agent( title='Agriculture' ) ]
agents+=[ Agent( title='Mining' ) ]
agents+=[ Agent( title='Chemical' ) ]
agents+=[ Agent( title='Manufacturing' ) ]
agents+=[ Agent( title='High Tech' ) ]
agents+=[ Agent( title='Shipping' ) ]
agents+=[ Agent( title='Construction' ) ]

LandUse_X_Agent(agent=agents[0],landUse=landUses[0],intensity=1.0,percentage=0.56)
LandUse_X_Agent(agent=agents[0],landUse=landUses[1],intensity=1.0,percentage=0.38)
LandUse_X_Agent(agent=agents[0],landUse=landUses[2],intensity=1.0,percentage=0.03)
LandUse_X_Agent(agent=agents[0],landUse=landUses[3],intensity=1.0,percentage=0.03)

LandUse_X_Agent(agent=agents[1],landUse=landUses[0],intensity=1.0,percentage=0.002)
LandUse_X_Agent(agent=agents[1],landUse=landUses[1],intensity=1.0,percentage=0.001)
LandUse_X_Agent(agent=agents[1],landUse=landUses[2],intensity=1.0,percentage=0.001)
LandUse_X_Agent(agent=agents[1],landUse=landUses[3],intensity=1.0,percentage=0.996)

LandUse_X_Agent(agent=agents[2],landUse=landUses[2],intensity=1.0,percentage=1.0)
LandUse_X_Agent(agent=agents[3],landUse=landUses[2],intensity=1.0,percentage=1.0)
LandUse_X_Agent(agent=agents[4],landUse=landUses[2],intensity=1.0,percentage=1.0)
LandUse_X_Agent(agent=agents[5],landUse=landUses[2],intensity=1.0,percentage=1.0)
LandUse_X_Agent(agent=agents[6],landUse=landUses[2],intensity=1.0,percentage=1.0)
LandUse_X_Agent(agent=agents[7],landUse=landUses[2],intensity=1.0,percentage=1.0)

b = np.array([154,92,11,922]) * np.sum(pop) / 360e6 * 1e6

A = np.array([	[0.56,0.38,0.03,0.03],
		[0.002,0.001,0.001,0.976],
		[0,0,1,0],
		[0,0,1,0],
		[0,0,1,0],
		[0,0,1,0],
		[0,0,1,0],
		[0,0,1,0]	],dtype='float').T

x = scipy.optimize.nnls(A,b)[0]

P = np.random.uniform(1,4,[nCities,len(agents)])
for i in range(len(agents)):
  P[:,i] /= np.sum(P[:,i])
  P[:,i] *= x[i]

P[:,1]*100

print np.sum(pop)
print b
print np.dot(A,np.sum(P,axis=0))

for i in range(nCities):
  for j in range(len(agents)):
    City_X_Agent(city=cities[i],agent=agents[j],presence=P[i,j])

demand(cities)


c = [np.log10(cities[i].nPop) for i in range(nCities)]
norm = mpl.colors.Normalize( vmin=np.min(c), vmax=np.max(c) )
cmap = cm.ScalarMappable( norm=norm, cmap=mpl.cm.jet_r )

plt.figure()
sc=plt.scatter(c,c,s=10,c=c)
plt.close()
pos = {n: (n[0], n[1]) for n in G.nodes()}

plt.figure(figsize=(10,5))
ax1 = plt.subplot2grid((3,6), (0,0), rowspan=3,colspan=4)
nx.draw_networkx_edges(G, pos=pos)
for i in range(nCities):
  value = np.log10(cities[i].nPop)
  plt.scatter(xy[i,0],xy[i,1],s=30,c=cmap.to_rgba(value),edgecolor='none')
cb = plt.colorbar( sc, ticks=[3,4,5,6] )
cb.ax.set_yticklabels([ '1k', '10k', '100k', '1m'])
cb.set_label('Population',fontsize=22)
plt.xlabel('Easting [m]',fontsize=18)
plt.ylabel('Northing [m]',fontsize=18)
ax1.axis('equal')

sizes  = [0.78,0.22]
labels = ['Agriculture','Other']
ax2 = plt.subplot2grid((3,6), (0,5))
ax2.pie(sizes,labels=labels,startangle=90, textprops={'fontsize':10})
ax2.axis('equal')

ch = np.random.choice(range(nCities),3,replace=False)
labels = [agents[j].title for j in range(len(agents))]
sizes  = [cities[ch[1]].cxas[j].presence for j in range(len(agents))]

del labels[1]
del sizes[1]
sizes     = np.random.uniform(5,30,7)
sizes[0]  = 0
sizes[3] *= 1.5
sizes    /= np.sum(sizes)
sizes    *= 40
sizes[0]  = 60

ax3 = plt.subplot2grid((3,6), (1,5))
ax3.pie(sizes,labels=labels,startangle=75, textprops={'fontsize':10})
ax3.axis('equal')

plt.savefig('rng.eps',format='eps',bbox_inches='tight')
plt.close()
exit()

nn=15

plt.figure(figsize=(10,7))

ax1 = plt.subplot2grid((2,2), (0,0))
t,eu = demand_residential(0,0,0)
ax1.plot(t,eu,zorder=1,c='r',linewidth=2.0)
ax1.set_xlabel('Time of day [hours]')
ax1.set_ylabel('Energy demand [kW/acre]')
ax1.set_title('Residential')
ax1.set_xlim([-1,25])

ax2 = plt.subplot2grid((2,2), (1,0))
t,eu = demand_commercial(0,0,0)
ax2.plot(t,eu,zorder=1,c='r',linewidth=2.0)
ax2.set_xlabel('Time of day [hours]')
ax2.set_ylabel('Energy demand [kW/acre]')
ax2.set_title('Commercial')
ax2.set_xlim([-1,25])

ax3 = plt.subplot2grid((2,2), (0,1))
t,eu = demand_industrial(0,0,0)
ax3.plot(t,eu,zorder=1,c='r',linewidth=2.0)
ax3.set_xlabel('Time of day [hours]')
ax3.set_ylabel('Energy demand [kW/acre]')
ax3.set_title('Industrial')
ax3.set_xlim([-1,25])

ax4 = plt.subplot2grid((2,2), (1,1))
t,eu = demand_agricultural(0,0,0)
ax4.plot(t,eu,zorder=1,c='r',linewidth=2.0)
ax4.set_xlabel('Time of day [hours]')
ax4.set_ylabel('Energy demand [kW/acre]')
ax4.set_title('Agricultural')
ax4.set_xlim([-1,25])

plt.tight_layout()
plt.savefig('eu_fns1.eps',format='eps',bbox_inches='tight')
plt.close()


plt.figure(figsize=(10,7))

ax1 = plt.subplot2grid((2,2), (0,0))
for i in range(nn):
  t,eu = demand_residential(1,0,0)
  ax1.plot(t,eu,color='gray',zorder=1)
t,eu = demand_residential(0,0,0)
ax1.plot(t,eu,zorder=1,c='r',linewidth=2.0)
ax1.set_xlabel('Time of day [hours]')
ax1.set_ylabel('Energy demand [kW/acre]')
ax1.set_title('Residential')
ax1.set_xlim([-1,25])

ax2 = plt.subplot2grid((2,2), (1,0))
for i in range(nn):
  t,eu = demand_commercial(1,0,0)
  ax2.plot(t,eu,color='gray',zorder=1)
t,eu = demand_commercial(0,0,0)
ax2.plot(t,eu,zorder=1,c='r',linewidth=2.0)
ax2.set_xlabel('Time of day [hours]')
ax2.set_ylabel('Energy demand [kW/acre]')
ax2.set_title('Commercial')
ax2.set_xlim([-1,25])

ax3 = plt.subplot2grid((2,2), (0,1))
for i in range(nn):
  t,eu = demand_industrial(1,0,0)
  ax3.plot(t,eu,color='gray',zorder=1)
t,eu = demand_industrial(0,0,0)
ax3.plot(t,eu,zorder=1,c='r',linewidth=2.0)
ax3.set_xlabel('Time of day [hours]')
ax3.set_ylabel('Energy demand [kW/acre]')
ax3.set_title('Industrial')
ax3.set_xlim([-1,25])

ax4 = plt.subplot2grid((2,2), (1,1))
for i in range(nn):
  t,eu = demand_agricultural(1,0,0)
  ax4.plot(t,eu,color='gray',zorder=0)
t,eu = demand_agricultural(0,0,0)
ax4.plot(t,eu,zorder=1,c='r',linewidth=2.0)
ax4.set_xlabel('Time of day [hours]')
ax4.set_ylabel('Energy demand [kW/acre]')
ax4.set_title('Agricultural')
ax4.set_xlim([-1,25])

plt.tight_layout()
plt.savefig('eu_fns2.eps',format='eps',bbox_inches='tight')
plt.close()


plt.figure(figsize=(10,7))

ax1 = plt.subplot2grid((2,2), (0,0))
for i in range(nn):
  t,eu = demand_residential(1,1,0)
  ax1.plot(t,eu,color='gray',zorder=1)
t,eu = demand_residential(0,0,0)
ax1.plot(t,eu,zorder=1,c='r',linewidth=2.0)
ax1.set_xlabel('Time of day [hours]')
ax1.set_ylabel('Energy demand [kW/acre]')
ax1.set_title('Residential')
ax1.set_xlim([-1,25])

ax2 = plt.subplot2grid((2,2), (1,0))
for i in range(nn):
  t,eu = demand_commercial(1,1,0)
  ax2.plot(t,eu,color='gray',zorder=1)
t,eu = demand_commercial(0,0,0)
ax2.plot(t,eu,zorder=1,c='r',linewidth=2.0)
ax2.set_xlabel('Time of day [hours]')
ax2.set_ylabel('Energy demand [kW/acre]')
ax2.set_title('Commercial')
ax2.set_xlim([-1,25])

ax3 = plt.subplot2grid((2,2), (0,1))
for i in range(nn):
  t,eu = demand_industrial(1,1,0)
  ax3.plot(t,eu,color='gray',zorder=1)
t,eu = demand_industrial(0,0,0)
ax3.plot(t,eu,zorder=1,c='r',linewidth=2.0)
ax3.set_xlabel('Time of day [hours]')
ax3.set_ylabel('Energy demand [kW/acre]')
ax3.set_title('Industrial')
ax3.set_xlim([-1,25])

ax4 = plt.subplot2grid((2,2), (1,1))
for i in range(nn):
  t,eu = demand_agricultural(1,1,0)
  ax4.plot(t,eu,color='gray',zorder=0)
t,eu = demand_agricultural(0,0,0)
ax4.plot(t,eu,zorder=1,c='r',linewidth=2.0)
ax4.set_xlabel('Time of day [hours]')
ax4.set_ylabel('Energy demand [kW/acre]')
ax4.set_title('Agricultural')
ax4.set_xlim([-1,25])

plt.tight_layout()
plt.savefig('eu_fns3.eps',format='eps',bbox_inches='tight')
plt.close()


plt.figure(figsize=(10,7))

ax1 = plt.subplot2grid((2,2), (0,0))
for i in range(nn):
  t,eu = demand_residential(1,1,0.15)
  ax1.plot(t,eu,color='gray',zorder=1)
t,eu = demand_residential(0,0,0)
ax1.plot(t,eu,zorder=1,c='r',linewidth=2.0)
ax1.set_xlabel('Time of day [hours]')
ax1.set_ylabel('Energy demand [kW/acre]')
ax1.set_title('Residential')
ax1.set_xlim([-1,25])

ax2 = plt.subplot2grid((2,2), (1,0))
for i in range(nn):
  t,eu = demand_commercial(1,1,0.15)
  ax2.plot(t,eu,color='gray',zorder=1)
t,eu = demand_commercial(0,0,0)
ax2.plot(t,eu,zorder=1,c='r',linewidth=2.0)
ax2.set_xlabel('Time of day [hours]')
ax2.set_ylabel('Energy demand [kW/acre]')
ax2.set_title('Commercial')
ax2.set_xlim([-1,25])

ax3 = plt.subplot2grid((2,2), (0,1))
for i in range(nn):
  t,eu = demand_industrial(1,1,0.15)
  ax3.plot(t,eu,color='gray',zorder=1)
t,eu = demand_industrial(0,0,0)
ax3.plot(t,eu,zorder=1,c='r',linewidth=2.0)
ax3.set_xlabel('Time of day [hours]')
ax3.set_ylabel('Energy demand [kW/acre]')
ax3.set_title('Industrial')
ax3.set_xlim([-1,25])

ax4 = plt.subplot2grid((2,2), (1,1))
for i in range(nn):
  t,eu = demand_agricultural(1,1,0.15)
  ax4.plot(t,eu,color='gray',zorder=0)
t,eu = demand_agricultural(0,0,0)
ax4.plot(t,eu,zorder=1,c='r',linewidth=2.0)
ax4.set_xlabel('Time of day [hours]')
ax4.set_ylabel('Energy demand [kW/acre]')
ax4.set_title('Agricultural')
ax4.set_xlim([-1,25])

plt.tight_layout()
plt.savefig('eu_fns4.eps',format='eps',bbox_inches='tight')
plt.close()


t,eu = demand(cities)

eu1=np.zeros(1000)
eu2=np.zeros(1000)
eu3=np.zeros(1000)
eu4=np.zeros(1000)
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

d_min = np.min(eu1+eu2+eu3+eu4)
d_max = np.max(eu1+eu2+eu3+eu4)
print 'initial demand', d_max

plt.figure()

plt.fill_between(t,eu4+eu1+eu3,eu1+eu2+eu3+eu4,color='r',alpha=0.6)
plt.fill_between(t,eu4+eu1,eu4+eu1+eu3,color='g',alpha=0.6)
plt.fill_between(t,eu1,eu4+eu1,color='b',alpha=0.6)
plt.fill_between(t,np.zeros(len(t)),eu1,color='c',alpha=0.6)


plt.plot(t,eu2+eu1+eu4+eu3,c='r',linewidth=1.5,label='Residential')
plt.plot(t,eu1+eu4+eu3,c='g',linewidth=1.5,label='Commercial')
plt.plot(t,eu1+eu4,c='b',linewidth=1.5,label='Industrial')
plt.plot(t,eu1,c='c',linewidth=1.5,label='Agricultural')

plt.xlabel('Time [hours]')
plt.ylabel('Energy Demand [GW]')
plt.legend(loc=3)
plt.savefig('demand.png',format='png',bbox_inches='tight',dpi=600)
plt.close()

color_dict = { 'coal':'red', 'nuclear':'magenta', 'oil':'black', 'natgas':'orange','hydro':'blue','solar':'yellow','wind':'green' }
fuel_dict  = { 'coal':30/2460.0, 'nuclear':1390/360000.0, 'oil':105/1699.0, 'natgas':17/0.3/1000,'hydro':0,'solar':0,'wind':0 }
gens  = produce_random_mix(d_max*1.3)

session.add_all(cities)
session.add_all(agents)
session.add_all(landUses)
session.commit()
session.close()

pickle.dump({'gens':gens,'fuel_dict':fuel_dict,'color_dict':color_dict},open('init.pkl','wb'))

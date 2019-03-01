import numpy as np
import matplotlib as mpl
mpl.use('Agg')
import matplotlib.pyplot as plt
import scipy
import scipy.signal

nt = 1500
t = np.linspace(0,7,nt)
d = 0.01
f = 1
su = 0.5+0.5*(2/np.pi)*np.arctan(np.sin(2*np.pi*(t-0.25)*f)/d)

cc  = 0.5+np.cumsum(np.random.normal(0,0.10,nt))
cc -= np.min(cc)
cc /= np.max(cc)
cc *= np.random.uniform(0.4,1.0)
cc += np.random.uniform(0.05,0.5)
cc /= np.max(cc)
rp  = 0.80*0.005**(1-cc)

ri  = np.cumsum(np.random.normal(0,0.10,nt))
ri -= np.min(ri)
ri /= np.max(ri)
ri *= np.random.uniform(0.05,0.50)
ri  = np.multiply(ri,rp)

so = np.multiply(1-cc,su)

plt.figure()

f, ax = plt.subplots(4,1)

ax[0].plot(t,cc)
ax[1].plot(t,ri)
ax[1].plot(t,0.1*np.ones(len(t)))
ax[1].plot(t,0.3*np.ones(len(t)))
ax[2].plot(t,su)
ax[3].plot(t,so)

ax[0].set_ylabel('Cloud Cover [%]')
ax[1].set_ylabel('Rain Intensity [in/hr]')
ax[2].set_ylabel('Sun Up [%]')
ax[3].set_ylabel('Solar Potential [%]')

ax[3].set_xlabel('Time [days]')

ax[0].set_ylim([0,1])
#ax[1].set_ylim([0,1])
ax[2].set_ylim([0,1])
ax[3].set_ylim([0,1])

if np.max(ri)>0.32: ax[1].set_ylim([0,np.max(ri)])
else:               ax[1].set_ylim([0,0.32])

plt.savefig('test.eps',format='eps',bbox_inches='tight')
plt.close()

t = np.linspace(0,5,10000)
d = 0.1
f = 1
cl = 0.1*(2/np.pi)*np.arctan(np.sin(2*np.pi*(t-0.25)*f)/d)
rw = np.cumsum(np.random.normal(0,0.002,len(t)))
dt = t*(rw[-1]-rw[0])/np.max(t)

plt.figure()
#plt.plot(t,rw)
#plt.plot(t,dt)
plt.plot(t,0.5+cl+rw-dt)
plt.xlabel('Time [yr]',fontsize=18)
plt.savefig('test2.eps',format='eps',bbox_inches='tight')
plt.close()

plt.figure()
cc = np.linspace(0,1,1000)
ri = 0.80*0.03**(1-cc)
rp = 0.80*0.03**(1-cc)
rp
plt.plot(cc,ri)
plt.xlabel('Cloud Cover',fontsize=18)
plt.ylabel('Rain Potential',fontsize=18)
plt.xlim([0,1])
plt.ylim([0,1])
plt.savefig('calibration1.eps',format='eps',bbox_inches='tight')
plt.close()

plt.figure()

#rs = np.linspace(0,3000,1000)	# mill m3
#rh = rs/227			# divide by km2, get meters
#pe = 				# 

#plt.scatter(rs,ec)
#plt.xlabel('Reservoir Storage [mill m$^3$]',fontsize=18)
#plt.ylabel('Potential Energy [MW]',fontsize=18)
#plt.savefig('calibration2.eps',format='eps',bbox_inches='tight')
#plt.close()

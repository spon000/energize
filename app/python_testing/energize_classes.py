import sys
from header import *

Base = declarative_base()

class City(Base):
  __tablename__ = 'city'
  id            = Column(Integer, primary_key=True)
  title         = Column(String(64))
  nPop          = Column(Float)
  cxas          = relationship( 'City_X_Agent', back_populates='city' )

class LandUse(Base):
  __tablename__ = 'landUse'
  id            = Column(Integer, primary_key=True)
  title         = Column(String(64))
  lxas          = relationship( 'LandUse_X_Agent', back_populates='landUse' )

class Agent(Base):
  __tablename__ = 'agent'
  id            = Column(Integer, primary_key=True)
  title         = Column(String(64))
  cxas          = relationship( 'City_X_Agent',    back_populates='agent' )
  lxas          = relationship( 'LandUse_X_Agent', back_populates='agent' )

class LandUse_X_Agent(Base):
  __tablename__ = 'lxa'
  id_landUse    = Column(Integer, ForeignKey('landUse.id'), primary_key=True )
  id_agent      = Column(Integer, ForeignKey('agent.id'),   primary_key=True )
  percentage    = Column(Float)
  intensity     = Column(Float)
  landUse       = relationship( 'LandUse', back_populates='lxas' )
  agent         = relationship( 'Agent',   back_populates='lxas' )

class City_X_Agent(Base):
  __tablename__ = 'cxa'
  id_city       = Column(Integer, ForeignKey('city.id'),  primary_key=True )
  id_agent      = Column(Integer, ForeignKey('agent.id'), primary_key=True )
  presence      = Column(Float)
  city          = relationship( 'City',  back_populates='cxas' )
  agent         = relationship( 'Agent', back_populates='cxas' )

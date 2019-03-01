
from app import db
from app.models import City
from app.game.start_cities import start_cities

def init_cities():
  if db.engine.dialect.has_table(db.engine, City.__tablename__):
    City.__table__.drop(db.engine)
  
  City.__table__.create(db.engine)
  for city in start_cities:
    newcity = City(
      name=city['name'], 
      population=city['population'], 
      daily_consumption=city['daily_consumption'], 
      column=city['column'],
      row=city['row'],
      layer=city['layer']
    )
    db.session.add(newcity)
  db.session.commit()
  return 0


from app import db
from app.models import City
from app.game.start_cities import start_cities

def init_cities(game_id):

  print("init cities")
  num_cities = City.query.count()
  if num_cities == 0:
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

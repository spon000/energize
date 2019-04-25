from app import db
from app.models import Facility, Generator
from app.game.start_facilities import start_facilities
from app.game.start_generators import start_generators

def init_facilities(game_id):
  # Initialize Facilities for the beginning of the game and the generators in those 
  # facilities.

  # facilities:
  # if db.engine.dialect.has_table(db.engine, Facility.__tablename__):
  #   Facility.__table__.drop(db.engine)
  
  # Facility.__table__.create(db.engine)
  print("init facilities")
  num_facilities = Facility.query.filter_by(id_game=game_id).count()
  if num_facilities == 0:
    for index, facility in enumerate(start_facilities):
      newfacility = Facility(
        id_type = facility['id_type'],
        id_game = game_id,
        name = "Facility #" + str(index),
        state = facility['state'],
        player_number = facility['player'],
        start_build_date = facility['start_build_date'],
        start_prod_date = facility['start_prod_date'],
        column = facility['column'],
        row = facility['row'],
        layer = facility['layer']
      )
      db.session.add(newfacility)
  
  # generators:
  # if db.engine.dialect.has_table(db.engine, Generator.__tablename__):
  #   Generator.__table__.drop(db.engine)
    
    # Generator.__table__.create(db.engine)
  print("init generators")
  num_generators = Generator.query.filter_by(id_game=game_id).count()
  if num_generators == 0:
    for generator in start_generators:
      newgenerator = Generator(
        id_type = generator['id_type'],
        id_game = game_id,
        id_facility = generator['id_facility'],
        state = generator['state'],
        start_build_date = generator['start_build_date'],
        start_prod_date = generator['start_prod_date']
      )
      db.session.add(newgenerator)

  # Commit (write to database) all the added records.
  db.session.commit()
  return 0

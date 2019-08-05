from app import create_app
from app import config_sqllite
from app import db, bcrypt
from app.models import Game, Company, Facility, Generator, City, User
from app.models import FacilityType, GeneratorType, PowerType, ResourceType
from app.game.supply_type_defs import facility_types, generator_types, power_types, resource_types
from app.game.init_game import init_game_models
from turn import calculate_quarter

##############################################################################
def main():
  app = create_app()

  # get context from app
  ctx = app.app_context()
  ctx.push()

  # delete all tables
  db.drop_all()

  # Recreate fresh tables.
  init_table(User, db)
  init_table(Game, db)
  init_table(Company, db)
  init_table(City, db)
  init_table(PowerType, db)
  init_table(ResourceType, db)
  init_table(FacilityType, db)
  init_table(GeneratorType, db)
  init_table(Facility, db)
  init_table(Generator, db)

  # Create dummy user
  u1 = User(
    password = bcrypt.generate_password_hash("122130124032").decode('utf-8'),
    companies_max = 5
  )
  db.session.add(u1)
  db.session.commit()

  pop_table()
  game = create_game("run turn")
  init_game_models(game)

  generators = Generator.query.all()
  cities = City.query.all()

  calculate_quarter(generators, cities)
    
  #
  ctx.pop()
  return 0





##############################################################################

def init_table(tableClass, db):
  # drop() deletes a table. Need to check to see if it exists.
  if db.engine.dialect.has_table(db.engine, tableClass.__tablename__):
    tableClass.__table__.drop(db.engine)

  # create() creates new table if it doesn't exist
  tableClass.__table__.create(db.engine)
  return 0



##############################################################################

def pop_table():
 # Uncomment to populate supply type tables
  for facility_type in facility_types:
    ft = FacilityType(
      maintype = facility_type['maintype'],
      subtype = facility_type['subtype'],
      name = facility_type['name'],
      build_time = facility_type['build_time'],
      minimum_area = facility_type['minimum_area'],
      fixed_cost_build = facility_type['fixed_cost_build'],
      fixed_cost_operate = facility_type['fixed_cost_operate'],
      marginal_cost_build = facility_type['marginal_cost_build'],
      marginal_cost_operate = facility_type['marginal_cost_build'],
      decomission_cost = facility_type['decomission_cost'],
      description = facility_type['description']
    )
    db.session.add(ft)

  #
  for generator_type in generator_types:
    gt = GeneratorType(
      id_facility_type = generator_type['id_facility_type'],
      id_power_type = generator_type['id_power_type'],
      id_resource_type = generator_type['id_resource_type'],
      build_time = generator_type['build_time'],
      nameplate_capacity = generator_type['nameplate_capacity'],
      efficiency = generator_type['efficiency'],
      continuous = generator_type['continuous'],
      lifespan = generator_type['lifespan'],
      fixed_cost_build = generator_type['fixed_cost_build'],
      fixed_cost_operate = generator_type['fixed_cost_operate'],
      variable_cost_operate = generator_type['variable_cost_operate'],
      decomission_cost = generator_type['decomission_cost']
    )
    db.session.add(gt)

  #
  for power_type in power_types:
    pt = PowerType(
      name = power_type['maintype'],
      description = power_type['description']
    )
    db.session.add(pt)

  #
  for resource_type in resource_types:
    rt = ResourceType(
      name = resource_type['name'],
      unit = resource_type['unit'],
      available = resource_type['available'],
      average_price = resource_type['average_price'],
      energy_content = resource_type['energy_content']
    )
    db.session.add(rt)  

  db.session.commit()


##############################################################################
def create_game(name):
  game = Game(name=name)
  db.session.add(game)
  db.session.commit()
  return game


###############################################################################
# Invoke main() first
if __name__ == '__main__':
  # Need to supply the application context when running this script.
  # with app.app_context():
  main()  

###############################################################################################

from app import create_app
from app import db
from app.models import Game, Company, Facility, Generator, City, User
from app.models import FacilityType, GeneratorType, PowerType, ResourceType
from app.game.supply_type_defs import facility_types, generator_types, power_types, resource_types

##############################################################################
def main():
  app = create_app()

  #
  ctx = app.app_context()
  ctx.push()

  # Recreate fresh tables. 
  init_table(User, db)
  init_table(City, db)
  init_table(Game, db)
  init_table(Company, db)
  init_table(Facility, db)
  init_table(Generator, db)

  # Uncomment to recreate supply type tables
  init_table(FacilityType, db)
  init_table(GeneratorType, db)
  init_table(PowerType, db)
  init_table(ResourceType, db)

  # Uncomment to populate supply type tables
  for facility_type in facility_types:
    ft = FacilityType(
      label = facility_type['label'],
      build_time = facility_type['build_time'],
      minimum_area = facility_type['minimum_area'],
      fixed_cost_build = facility_type['fixed_cost_build'],
      fixed_cost_operate = facility_type['fixed_cost_operate'],
      marginal_cost_build = facility_type['marginal_cost_build'],
      marginal_cost_operate = facility_type['marginal_cost_build'],
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
      lifespan = generator_type['lifespan']
    )
    db.session.add(gt)

  #
  for power_type in power_types:
    pt = PowerType(
      label = power_type['label'],
      description = power_type['description']
    )
    db.session.add(pt)

  #
  for resource_type in resource_types:
    rt = ResourceType(
      name = resource_type['name']
    )
    db.session.add(rt)

  # commit all the additions to the database.
  db.session.commit()

  #
  ctx.pop()
  return 0

################################################################################
def init_table(tableClass, db):
  # drop() deletes a table. Need to check to see if it exists.
  if db.engine.dialect.has_table(db.engine, tableClass.__tablename__):
    tableClass.__table__.drop(db.engine)

  # create() creates new table if it doesn't exist
  tableClass.__table__.create(db.engine)
  return 0

###############################################################################
# Invoke main() first
if __name__ == '__main__':
  # Need to supply the application context when running this script.
  # with app.app_context():
  main()


from app import db
from flask_login import current_user
from app.models import User, Game, City, Company, Facility, Generator, FacilityType, GeneratorType
from app.game.start_cities import start_cities
from app.game.start_facilities import start_facilities
from app.game.start_generators import start_generators
from app.game.supply_type_defs import facility_types, generator_types, power_types, resource_types
from app.game.modifiers import init_modifiers
from app.game.history import init_history_table

#######################################################################################
# Main function
#######################################################################################
def init_game_models(game):
  
  # Add companies
  init_companies(game)

  # Add types.
  # init_types(game)

  # Add cities.
  init_cities(game)

  # Add facilities.
  init_facilities(game)

  # Add generators.
  init_generators(game)

  # create modifiers table for all the iterations of the game.
  # cities = City.query.all()
  # init_modifiers(game, cities)

  # Generate empty history table (file)
  init_history_table(game)
   
  return True

#######################################################################################
# Sub functions
#######################################################################################

#######################################################################################
# Create companies that will play in the game
# these are dummy companies (dummy user associated) 
# until a real user joins the game and randomly selects
# a company to play.
def init_companies(game):

  # check if companies already exist for this game
  num_avail_companies = Company.query.filter_by(id_game=game.id).count()

  if num_avail_companies == 0:
    for i in range(1, game.companies_max+1):
      company = Company(name="Company #" + str(i), id_game=game.id, id_user=1, player_number=i, connected_to_game=0)
      db.session.add(company)

  # Commit (write to database) all the added records.
  db.session.commit()
  return True

#######################################################################################
# Populate facility and generator type tables.
# def init_types(game):
#   num_factypes = FacilityType.query.filter_by(id_game=game.id).count()
#   num_gentypes = GeneratorType.query.filter_by(id_game=game.id).count()

#   if num_factypes == 0:
#     for factype in facility_types:
#       ft = FacilityType(
#         id_game = game.id,
#         maintype = factype['maintype'],
#         subtype = factype['subtype'],
#         name = factype['name'],
#         build_time = factype['build_time'],
#         minimum_area = factype['minimum_area'],
#         fixed_cost_build = factype['fixed_cost_build'],
#         fixed_cost_operate = factype['fixed_cost_operate'],
#         marginal_cost_build = factype['marginal_cost_build'],
#         marginal_cost_operate = factype['marginal_cost_build'],
#         decomission_cost = factype['decomission_cost'],
#         description = factype['description']
#       )
#       db.session.add(ft)

#   if num_gentypes == 0:
#     for gentype in generator_types:
#       gt = GeneratorType(
#         id_game = game.id,
#         id_facility_type = gentype['id_facility_type'],
#         id_power_type = gentype['id_power_type'],
#         id_resource_type = gentype['id_resource_type'],
#         build_time = gentype['build_time'],
#         nameplate_capacity = gentype['nameplate_capacity'],
#         efficiency = gentype['efficiency'],
#         continuous = gentype['continuous'],
#         lifespan = gentype['lifespan'],
#         fixed_cost_build = gentype['fixed_cost_build'],
#         fixed_cost_operate = gentype['fixed_cost_operate'],
#         variable_cost_operate = gentype['variable_cost_operate'],
#         decomission_cost = gentype['decomission_cost']
#       )
#       db.session.add(gt)

#   # Commit (write to database) all the added records.
#   db.session.commit()     
#   return True

#######################################################################################
# Populate city table.
def init_cities(game):
  num_cities = City.query.filter_by(id_game=game.id).count()

  if num_cities == 0:
    for city in start_cities:
      newcity = City(
        id_game=game.id,
        name=city['name'],
        population=city['population'], 
        daily_consumption=city['daily_consumption'], 
        column=city['column'],
        row=city['row'],
        layer=city['layer']
      )
      db.session.add(newcity)

    # Commit (write to database) all the added records.      
    db.session.commit()  
  return True

#######################################################################################
# Populate facility table.
def init_facilities(game):
  num_facilities = Facility.query.filter_by(id_game=game.id).count()

  companies = Company.query.filter_by(id_game=game.id).all()

  if num_facilities == 0:
    for index, facility in enumerate(start_facilities):
      newfacility = Facility(
        id_type = facility['id_type'],
        id_game = game.id,
        id_company = next((company.id for company in companies if facility['player'] == company.player_number), None),
        # The fid is used to assign the initial generators to the initial facilities. It's only used when creating a new
        # game.
        fid = facility['fid'],
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
      db.session.commit()

      # since currently Facility has no lifespan, find longest lifespan of compatible GeneratorTypes
      lspan_max=0
      for genType in genTypes:
        if genType.facility_type.id==newfacility.id_type:
          lspan = genType.lifespan
          if lspan>lspan_max: lspan_max=lspan
      # draw an age from a Poisson distribution such that "most" generators are about 2/3 through their lifespan
      # ensure that the age doesn't exceed the GeneratorType lifespan
      while True:
        age = np.random.poisson(lspan_max*90.0*24.0*0.66, size=1)[0]
        if age<(lspan_max*90*24): break
      newfacility.start_prod_date  = -age
      newfacility.start_build_date = -age - int(newfacility.facility_type.build_time)*90.0*24.0

    # Commit (write to database) all the added records.
    db.session.commit()

  return True

#######################################################################################
# Populate generator table.
def init_generators(game):
  num_generators = Generator.query.filter_by(id_game=game.id).count()

  if num_generators == 0:
    for generator in start_generators:
      facility = Facility.query.filter_by(fid=generator['id_facility'],id_game=game.id).first()
      newgenerator = Generator(
        id_type = generator['id_type'],
        id_game = game.id,
        id_facility = facility.id,
        state = generator['state'],
        start_build_date = generator['start_build_date'],
        start_prod_date = generator['start_prod_date']
      )

      # find the age of the facility, and lifespan of the generator
      # draw age from Poisson distribution, ensuring that it does not exceed facility age or generator lifespan
      facility_age = abs(int(Facility.query.filter_by(fid=generator['id_facility'],id_game=game.id).first().start_build_date))
      genType = GeneratorType.query.filter_by(id=generator['id_type']).first()
      genType_lspan = float(genType.lifespan)*90.0*24.0
      genType_buildTime = float(genType.build_time) * 90.0*24.0
      while True:
        age = np.random.poisson(genType_lspan*0.66, size=1)[0]
        print(age,genType_lspan,facility_age)
        if age<genType_lspan and age<facility_age: break
      newgenerator.start_prod_date  = -age
      newgenerator.start_build_date = -age - genType_buildTime
      db.session.add(newgenerator)

  # Commit (write to database) all the added records.
  db.session.commit()  
  return True




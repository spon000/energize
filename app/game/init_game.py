import numpy as np
import math
import json
import logging
import time

from sqlalchemy import func
from app import db
from flask_login import current_user
from app.models import User, Game, City, Company, Facility, Generator, FacilityType, GeneratorType
from app.game.start_cities import start_cities
from app.game.start_facilities import start_facilities
from app.game.start_generators import start_generators
from app.game.supply_type_defs import facility_types, generator_types, power_types, resource_types
from app.game.modifiers import init_modifiers
from app.game.history import init_history_table

# Functions
from app.game.utils import date_to_hours, hours_to_date, date_to_date_str
# Constants
from app.game.utils import hours_per_turn, hours_per_year

from app.gamesio.routes import force_run_turn


# Setup logging parms
format = "%(asctime)s: %(filename)s: %(lineno)d: %(message)s"
logging.basicConfig(format=format, level=logging.INFO, datefmt="%H:%M:%S")

#######################################################################################
# init_game function populates tables with game data.
#######################################################################################
def init_game(game):
  # Set the game state to 'inializing'.
  game.state="initializing"
  db.session.commit()

  # seed the randomizer
  np.random.seed()
  
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
  cities = City.query.filter_by(id_game=game.id).all()
  init_modifiers(game, cities)

  # Generate empty history table (file)
  #init_history_table(game)

  # Everything is done. Set the state to 'new' and return
  game.state="new"
  db.session.commit()

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
      company = Company(name="Company #" + str(i), id_game=game.id, id_user=1, player_number=i)
      db.session.add(company)

  # Commit (write to database) all the added records.
  db.session.commit()
  return True

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
      facility_type = FacilityType.query.filter_by(id=facility['id_type']).first()
      new_facility = Facility(
        id_type = facility['id_type'],
        id_game = game.id,
        id_company = next((company.id for company in companies if facility['player'] == company.player_number), None),
        # The fid is used to assign the initial generators to the initial facilities. It's only used when creating a new
        # game.
        fid = facility['fid'],
        name = "Facility #" + str(facility['fid']),
        state = facility['state'],
        player_number = facility['player'],
        build_turn = facility_type.build_time,
        prod_turn = facility_type.lifespan,
        decom_turn = facility_type.decom_time,
        column = facility['column'],
        row = facility['row'],
        layer = facility['layer']
      )

      # Add record to database cache. Doesn't get written until commit() is invoked.
      db.session.add(new_facility)
  
      # since currently Facility has no lifespan, find longest lifespan of compatible GeneratorTypes
      # lifespan_max = db.session.query(db.func.max(GeneratorType.lifespan)).filter_by(id_facility_type=new_facility.id_type).scalar()
      
      # draw an age from a Poisson distribution such that "most" generators are about 2/3 through their lifespan
      age_hours = (int(np.random.poisson(lam=(facility_type.lifespan * .66), size=1)[0]) * hours_per_turn)

      # ensure that the age doesn't exceed the GeneratorType lifespan
      if age_hours > (facility_type.lifespan * hours_per_turn):
        age_hours = facility_type.lifespan * hours_per_turn 

      prod_date_hours = game.sim_start_date - age_hours
      new_facility.build_turn = 0
      new_facility.prod_turn = facility_type.lifespan - int(age_hours / hours_per_turn)

      # logging.info(
      #   f"{'-'*80}\n"
      #   f"age_hours = {age_hours}\n"
      #   f"facility lifespan = {facility_type.lifespan}\n"
      #   f"facility age (in turns)  = {int(age_hours / hours_per_turn)}\n"
      #   f"facility age (in years) = {int( age_hours / hours_per_year)}\n"
      # )

      new_facility.start_prod_date  = prod_date_hours
      new_facility.start_build_date = prod_date_hours - (facility_type.build_time * hours_per_turn)

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
      generator_type = GeneratorType.query.filter_by(id=generator['id_type']).first()
      new_generator = Generator(
        id_type = generator['id_type'],
        id_game = game.id,
        id_facility = facility.id,
        build_turn = generator_type.build_time,
        prod_turn = generator_type.lifespan,
        decom_turn = generator_type.decom_time,         
        state = generator['state']
      )

      # Add record to database cache. Doesn't get written until commit() is invoked.
      db.session.add(new_generator)

      genType_buildTime_hours = generator_type.build_time * hours_per_turn
      genType_lspan_hours = generator_type.lifespan * hours_per_turn

      # draw age from Poisson distribution, ensuring that it does not exceed facility age or generator lifespan
      age_hours = (int(np.random.poisson(generator_type.lifespan * 0.66, 1)[0]) * hours_per_turn)


      if (age_hours > genType_lspan_hours):
        age_hours = genType_lspan_hours
        
      prod_date_hours = game.sim_start_date - age_hours
      new_generator.build_turn = 0
      new_generator.prod_turn = generator_type.lifespan - int(age_hours / hours_per_turn)

      # logging.info(
      #   f"{'-'*80}\n"
      #   f"facility_prod_date = {facility.start_prod_date}\n"
      #   f"generator_prod_date = {hours_to_date(prod_date_hours)}\n\n"
      #   f"gnerator_age_hours = {age_hours}\n"
      # )

      new_generator.start_prod_date  = prod_date_hours
      new_generator.start_build_date = prod_date_hours - genType_buildTime_hours

      # Get a random condition for generators already built.
      condition = np.random.poisson(lam=(50), size=1)[0]
      new_generator.condition = condition / 100

  # Commit (write to database) all the added records.
  db.session.commit()

  return True




from random import choice, seed
from flask import Blueprint, flash, url_for, redirect, render_template, request, jsonify
from flask_login import login_required, current_user
from flask_socketio import send
import json
import math 
import numpy as np

from sqlalchemy import func
from sqlalchemy.orm.session import make_transient
from app import db 
from app.models import User, Game, Company, Facility, Generator, City, FacilityType, GeneratorType, PowerType, ResourceType, Prompt, PromptType
from app.models import FacilitySchema, GeneratorSchema, FacilityModificationSchema, GeneratorModificationSchema, CitySchema, CompanySchema, GameSchema, FacilityTypeSchema, PromptSchema, PromptTypeSchema
from app.models import GeneratorTypeSchema, PowerTypeSchema, ResourceTypeSchema, FacilityModificationTypeSchema, GeneratorModificationType, GeneratorModificationTypeSchema
from app.game.init_game import init_game_models
from app.game.utils import format_date, convert_to_money_string, get_age, turns_to_hours, get_current_game_date, add_commas_to_number
from app.game.modifiers import load_modifiers
from app.game.prompts import assign_prompt
from app.game.sio_outgoing import shout_game_turn_complete, shout_new_facility, shout_update_facility, shout_delete_facility
from app.gamesio.routes import force_run_turn

game = Blueprint('game', __name__)
#################################################################################  
# initgame: load game models with starting data
@game.route("/cgame/<int:gid>/<name>", methods=["GET", "POST"])
@login_required
def initgame(gid, name):
  game = Game.query.filter_by(id=gid).first()

  if game == None:
    flash(f'Error creating game (code:010)','danger')  
    return render_template("title.html")

  if game.state != "initializing":
    flash(f'Error creating game (code:011)','danger')
    return render_template("title.html")

  if init_game_models(game) == True:
    game.state = "new"
    db.session.commit()
    print("-"*80)
    print("creating game...")
    force_run_turn(json.dumps({'gameId': game.id, 'initialTurn': True}))
  else:
    flash(f'Error creating game (code:012)','danger')
    return render_template("title.html")    

  return redirect(url_for('game.joingame' , gid=gid, name=name))

#################################################################################  
# joingame: Join an eligible game 
@game.route("/jgame/<int:gid>/<name>", methods=["GET", "POST"])
@login_required
def joingame(gid, name):
  game = Game.query.filter_by(id=gid).first()
  
  # Get all the ai companies in this game. They are eligible for a human player to take control.
  ai_companies = Company.query.filter(Company.id_game == game.id, Company.player_type == "ai").all()
   
  # If there aren't any ai companies then the game is full of human players already.
  if len(ai_companies) == 0:
    flash(f'This game is full. Try joining another game.','danger')
    return render_template("title.html")
  
  # if the number of ai companies is the max number of companies than this game is new.
  # if len(ai_companies) == game.companies_max:
  #   game.state = "new"
  #   db.session.commit()


  # if game.state == "runturn":
  #   return render_template("initgamewait.jinja", name=name, gid=game.id)

  # get a random ai company and assign it to the player.
  seed()
  assigned_company = choice(ai_companies)
  assigned_company.name = name
  assigned_company.player_type = "human"
  assigned_company.id_user = current_user.id
  company_facilities = Facility.query.filter_by(id_game=game.id,id_company=assigned_company.id).all()

  for facility in company_facilities:
    facility.name = assigned_company.name + " (facility #" + str(facility.id) + ")"
    
  prompt = assign_prompt('welcome', game, assigned_company, {'resolved': True}, [assigned_company.name])

  db.session.add(prompt)
  db.session.commit()    

  return redirect(url_for('game.loadgame', gid=gid))

#################################################################################  
# loadgame: Load into the main game screen.
@game.route("/game/<int:gid>", methods=["GET", "POST"])
@login_required
def loadgame(gid):
  game = Game.query.filter_by(id=gid).first()
  if game == None:
    flash(f'This game doesn\'t exist', 'danger')
    return render_template("title.html")

  company = Company.query.filter(Company.id_game == game.id, Company.id_user == current_user.id).first()

  if company == None: 
    flash(f'You\'re not playing in this game', 'danger')
    return render_template("title.html")

  balance = '${:,}'.format(int(company.balance))
  db.session.commit()

  return render_template(
    "game.jinja", 
    company=company, 
    game=game, 
    balance=balance, 
    current_game_date=format_date(get_current_game_date(game), "Y Q"),
    format_money=convert_to_money_string
  )

# ###############################################################################  
#
# ###############################################################################
@game.route("/facilities", methods=["GET", "POST"])
@login_required
def facilities():

  gid = request.args.get('gid', None)
  facilities = Facility.query.filter_by(id_game=gid).all()
  facilities_schema = FacilitySchema(many=True)
  serialized_facilities = facilities_schema.dump(facilities).data
  return jsonify({'facilities': serialized_facilities})

# ###############################################################################  
#
# ###############################################################################
@game.route("/generators", methods=["GET", "POST"])
@login_required
def generators():

  gid = request.args.get('gid', None)
  generators = Generator.query.filter_by(id_game=gid).all()
  generators_schema = GeneratorSchema(many=True)
  serialized_generators = generators_schema.dump(generators).data
  return jsonify({'generators': serialized_generators})

# ###############################################################################  
#
# ###############################################################################
@game.route("/gamedata", methods=["GET", "POST"])
@login_required
def game_data():

  gid = request.args.get('gid', None)
  game = Game.query.filter_by(id=gid).first()
  game_schema = GameSchema()
  serialized_game = game_schema.dump(game).data
  return jsonify({'game': serialized_game})

# ###############################################################################  
#
# ###############################################################################
@game.route("/currentdate", methods=["GET", "POST"])
@login_required
def current_date():

  gid = request.args.get('gid', None)

  game = Game.query.filter_by(id=gid).first()
  current_date = get_current_game_date(game)

  return jsonify({'currentDate': current_date})


# ###############################################################################  
#
# ###############################################################################
@game.route("/playercompany", methods=["GET", "POST"])
@login_required
def player_company():

  gid = request.args.get('gid', None)

  company = Company.query.filter_by(id_user=current_user.id, id_game=gid).first()
  company_schema = CompanySchema()
  serialized_company = company_schema.dump(company).data

  return jsonify({'company': serialized_company})

# ###############################################################################  
#
# ###############################################################################  
@game.route("/playercompanyevents", methods=["GET", "POST"])
@login_required
def player_company_events():

  gid = request.args.get('gid', None)

  company = Company.query.filter_by(id_user=current_user.id, id_game=gid).first()
  company_prompts = company['prompts']
  prompt_types = dict()

  prompt_type_schema = PromptTypeSchema()
  for prompt in company_prompts:
    pt = PromptType.query.filter_by(id=prompt.id_type).first()
    serialized_prompt_type = prompt_type_schema.dump(pt).data
    prompt_types[str(prompt.id_type)] = serialized_prompt_type
 
  prompt_schema = PromptSchema(many=True)
  serialized_prompts = prompt_schema.dump(company_prompts).data

  return jsonify({'prompts': serialized_prompts, 'prompt_types': prompt_types} )
# ###############################################################################  
#
# ###############################################################################  
@game.route("/company", methods=["GET", "POST"])
@login_required
def company():

  gid = request.args.get('gid', None)
  company = Company.query.filter_by(id_user=current_user.id, id_game=gid).first()
 
  if request.method == 'GET':
    company_schema = CompanySchema()
    serialized_company = company_schema.dump(company).data
    return jsonify({'player_company': serialized_company})
  else:
    company.state = request.args.get('pcstate')
    db.session.commit()

    if company.state == "turn":
      companies_ready = Company.query.filter_by(id_game=gid, state="turn").count()

      if companies_ready == 1:
        return redirect(url_for('game.runturn', gid=gid))
      else:
        return "Waiting For Players"

    else:
      return ("Success - state = " + company.state)

# ###############################################################################  
#
# ###############################################################################
@game.route("/companies", methods=["GET", "POST"])
@login_required
def companies():

  gid = request.args.get('gid', None)
  companies = Company.query.filter_by(id_game=gid).all()
  companies_schema = CompanySchema()
  serialized_companies = company_schema.dump(companies).data
  return jsonify({'companies': serialized_companies})

# ###############################################################################  
#
# ###############################################################################
@game.route("/cities", methods=["GET", "POST"])
@login_required
def cities():

  gid = request.args.get('gid', None)
  cities = City.query.filter_by(id_game=gid).all()
  cities_schema = CitySchema(many=True)
  serialized_cities = cities_schema.dump(cities).data
  return jsonify({'cities': serialized_cities})

# ###############################################################################  
#
# ###############################################################################
@game.route("/generatortypes", methods=["GET", "POST"])
@login_required
def generator_types():
  generator_types = GeneratorType.query.all()
  generator_types_schema = GeneratorTypeSchema(many=True)
  serialized_generator_types = generator_types_schema.dump(generator_types).data
  return jsonify({'generator_types': serialized_generator_types})

# ###############################################################################  
#
# ###############################################################################
@game.route("/powertypes", methods=["GET", "POST"])
@login_required
def power_types():
  power_types = PowerType.query.all()
  power_types_schema = PowerTypeSchema(many=True)
  serialized_power_types = power_types_schema.dump(power_types).data
  
  return jsonify({'power_types': serialized_power_types})


# ###############################################################################  
#
# ###############################################################################
# @game.route("/playergenerators", methods=["GET"])
# @login_required
# def player_generators():
#   gid = request.args.get('gid', None)
#   company = Company.query.filter_by(id_game=gid, id_user=current_user.id).first()
#   facilities = Facility.query.filter_by(id_game=gid, id_company=company.id)
  
#   facility_capacities = list()
#   for facility in facilities:
#     elegible_generators = list(filter(lambda generator : generator.state != 'available', facility.generators))
#     print("*"*80)
#     print(elegible_generators)
#     print("\n")

#     facility_capacities.append({
#       "facility_id": str(facility.id),
#       "facility_capacity": str((sum(list(gen.generator_type.nameplate_capacity for gen in elegible_generators)))),
#     })

#   print("*"*80)
#   print(facility_capacities)
#   print("\n")
 
#   return jsonify(facility_capacities)

# ###############################################################################  
#
# ###############################################################################
@game.route("/playerfacility", methods=["GET"])
@login_required
def player_facility():

  gid = request.args.get('gid', None)
  fid = request.args.get('fid', None)
  owned_facility = False

  facility = Facility.query.filter_by(id=fid).first()
  facility_schema = FacilitySchema()
  facility_serialized = facility_schema.dump(facility).data

  company = facility.company
  company_schema = CompanySchema()
  company_serialized = company_schema.dump(company).data

  if company.user.id == current_user.id:
    owned_facility = True

  facility_type = facility.facility_type
  facility_type_schema = FacilityTypeSchema()
  facility_type_serialized = facility_type_schema.dump(facility_type).data

  generators = Generator.query.filter_by(id_facility=facility.id, id_game=gid).all()
  generators_schema = GeneratorSchema(many=True)
  generators_serialized = generators_schema.dump(generators).data

  generator_modifications = [{'id': gen.id, 'mods': gen.modifications} for gen in generators]
  generator_modifications_schema = GeneratorModificationSchema(many=True)
  generator_modifications_serialized = generator_modifications_schema.dump(generator_modifications).data

  generator_types = GeneratorType.query.filter_by(id_facility_type=facility_type.id).all()
  generator_types_schema = GeneratorTypeSchema(many=True)
  generator_types_serialized = generator_types_schema.dump(generator_types).data

  power_types = [gen_type.power_type for gen_type in generator_types]
  power_type_schema = PowerTypeSchema(many=True)
  power_type_serialized = power_type_schema.dump(power_types).data

  resource_types = [gen_type.resource_type for gen_type in generator_types]
  resource_type_schema = ResourceTypeSchema(many=True)
  resource_type_serialized = resource_type_schema.dump(resource_types).data

  generator_modification_types = GeneratorModificationType.query.filter_by(id_facility_type=facility.id_type).all()
  generator_modification_types_schema = GeneratorModificationTypeSchema(many=True)
  generator_modification_types_serialized = generator_modification_types_schema.dump(generator_modification_types).data

  return jsonify({
    'owned_facility': owned_facility,
    'company': company_serialized,
    'facility': facility_serialized,
    'facility_type': facility_type_serialized,
    'generators': generators_serialized,
    'modifications': generator_modifications_serialized,
    'generator_types': generator_types_serialized,
    'power_types': power_type_serialized,
    'resource_types': resource_type_serialized,
    'modification_types': generator_modification_types_serialized
  })
  
# ###############################################################################  
#
# ###############################################################################
@game.route("/playerfacilities", methods=["GET"])
@login_required
def player_facilities():

  gid = request.args.get('gid', None)
  company = Company.query.filter_by(id_game=gid, id_user=current_user.id).first()

  facilities = Facility.query.filter_by(id_game=gid, id_company=company.id).all()
  facilities_schema = FacilitySchema(many=True)
  facilities_serialized = facilities_schema.dump(facilities).data

  facility_capacities = list()
  for facility in facilities:
    elegible_generators = list(filter(lambda generator : generator.state == 'available' or generator.state == 'unavailable', facility.generators))
    building_generators = list(filter(lambda generator : generator.state == 'new' or generator.state == 'building', facility.generators))
    facility_capacities.append({
      "facility_id": str(facility.id),
      "facility_capacity": str((sum(list(gen.generator_type.nameplate_capacity for gen in elegible_generators)))),
      "facility_build_capacity": str((sum(list(gen.generator_type.nameplate_capacity for gen in building_generators)))),
    })

  return jsonify({
    'facilities': facilities_serialized,
    'facility_capacities': facility_capacities,
  })

# ###############################################################################  
#
# ###############################################################################
@game.route("/newfacility", methods=["GET", "POST"])
@login_required
def new_facility():
  gid = request.args.get('gid', None)
  row = request.args.get('row', None)
  col = request.args.get('col', None)

  company = Company.query.filter_by(id_game=gid, id_user=current_user.id).first()
 
  newFacility = Facility(
    id_game=gid, 
    id_type=9, 
    id_company=company.id,
    column=col,
    row=row,
    player_number=company.player_number
  )
  db.session.add(newFacility)
  db.session.commit()

  newFacility.name = newFacility.name + str(newFacility.id)
  db.session.commit()
  
  facility_schema = FacilitySchema()
  facility_serialized = facility_schema.dump(newFacility).data

  # Broadcast to other players so their maps will be updated.
  shout_new_facility(gid, facility_serialized)

  return jsonify({
    'facility': facility_serialized
  })

# ###############################################################################  
#
# ###############################################################################
@game.route("/updatefacilitytype", methods=["GET", "POST"])
@login_required
def updateFacilityType():
  gid = request.args.get('gid', None)
  fid = request.args.get('fid', None)
  ftype = request.args.get('type', None)
 

  company = Company.query.filter_by(id_game=gid, id_user=current_user.id).first()
  facility_type = FacilityType.query.filter_by(id=int(ftype)).first()
  facility = Facility.query.filter_by(id=fid, id_game=gid).first()
  facility.id_type = int(ftype);
  facility.build_turn = facility_type.build_time
  facility.prod_turn = facility_type.lifespan
  facility.decom_turn = facility_type.decom_time
  facility.start_build_date = get_current_game_date(company.game) + turns_to_hours(1)
  facility.start_prod_date = get_current_game_date(company.game) + turns_to_hours(facility_type.build_time)

  db.session.commit()

  facility_schema = FacilitySchema()
  facility_serialized = facility_schema.dump(facility).data

  # print(f"hello {facility_serialized}")

  # Broadcast to other players so their maps will be updated.
  shout_update_facility(gid, facility_serialized)

  return jsonify({
    'facility': facility_serialized
  })

# ###############################################################################  
#
# ###############################################################################
@game.route("/updatefacility", methods=["GET", "POST"])
@login_required
def update_facility():
  gid = request.args.get('gid', None)
  fid = request.args.get('fid', None)
  facility_updates = json.loads(request.args.get('facility', None))
  # facility_updates = json.loads(request.args.get('facility', None))

  bad_key_fields = ['id', 'id_type', 'id_company', 'id_game']

  print(f"*"*80)
  print(f"facility = {facility_updates}")
  print(f"*"*80)

  facility = Facility.query.filter_by(id=fid, id_game=gid).first()
  facility_update_keys = list(facility_updates.keys())

  for fu_key in facility_update_keys:
    if fu_key not in bad_key_fields:
      facility[fu_key] = facility_updates[fu_key]

  db.session.commit()

  facility_schema = FacilitySchema()
  facility_serialized = facility_schema.dump(facility).data

  return jsonify({
    'facility': facility_serialized
  })

# ###############################################################################  
#
# ###############################################################################
@game.route("/deletefacility", methods=["GET", "POST"])
@login_required
def deleteFacility():
  gid = request.args.get('gid', None)
  fid = request.args.get('fid', None)

  generators = Generator.query.filter_by(id_facility=fid, id_game=gid).all()
  if (generators):
    for gen in generators:
      db.session.delete(gen)

  facility = Facility.query.filter_by(id=fid, id_game=gid).first()
  facility_schema = FacilitySchema()
  facility_serialized = facility_schema.dump(facility).data

  db.session.delete(facility)
  db.session.commit()

  # Broadcast to other players so their maps will be updated.
  shout_delete_facility(gid, facility_serialized)

  return jsonify({
    'facility': facility_serialized,
    'status': 'deleted'
  })

# ###############################################################################  
#
# ###############################################################################
@game.route("/viewfacility", methods=["GET", "POST"])
@login_required
def viewfacility():

  gid = request.args.get('gid', None)
  fid = request.args.get('fid', None)
  game = Game.query.filter_by(id=gid).first()
  facility = Facility.query.filter_by(id=fid, id_game=gid).first()
  # print(f"*"*80)
  # print(f"{facility}")
  facility_capacity = sum(gen.generator_type.nameplate_capacity for gen in facility.generators) or 0
  power_type = facility.generators[0].generator_type.power_type.name if facility.generators else "Undefined"
  facility_age = get_age(game, facility.start_prod_date)
  if facility.state == "new":
    facility_age = "Ready for Construction"
  elif facility_age < 0:
    facility_age = "Under Construction"
  else:
    
    if facility_age == 1:
      facility_age = str(facility_age) + " year"
    else:
      facility_age = str(facility_age) + " years"

  return render_template(
    "viewfacility.html", 
    facility=facility, 
    facility_type=facility.facility_type,
    facility_age = facility_age,
    power_type=power_type,
    faccap=facility_capacity
  )

# ###############################################################################  
#
# ###############################################################################
@game.route("/newgenerators", methods=["GET", "POST"])
@login_required
def new_generators():  
  gid = request.args.get('gid', None)
  fid = request.args.get('fid', None)
  ftid = request.args.get('ftid', None)
  generators = json.loads(request.args.get('gens', None))

  game = Game.query.filter_by(id=gid).first()
  facility = Facility.query.filter_by(id=fid,id_game=gid).first()
  facility_schema = FacilitySchema()
  facility_serialized = facility_schema.dump(facility).data
  default_generator_type = GeneratorType.query.filter_by(id_facility_type=ftid).first()

  for gen in generators:

    # Check to see if key is in dictionary
    if 'id_type' not in gen:
      gen_type_id = default_generator_type.id
    else:
      gen_type_id = gen['id_type']

    generator_type = GeneratorType.query.filter_by(id=gen_type_id).first()
    defined_gens = list()

    generator = Generator(
      id_game=gid,
      id_facility=fid,
      id_type=generator_type.id,
      start_build_date=get_current_game_date(game),
      build_turn=generator_type.build_time,
      prod_turn=generator_type.lifespan,
      decom_turn=generator_type.decom_time
    )
    gen_keys = list(gen.keys())
    for key in gen_keys:
      generator[key] = gen[key]

    db.session.add(generator)
    db.session.commit()

    generator_schema = GeneratorSchema()
    generator_serialized = generator_schema.dump(generator).data
    # print(f"-"*80)
    # print(f"generator = {generator}")
    defined_gens.append(generator_serialized)    

  return jsonify({
    'facility': facility_serialized,
    'generators': defined_gens
  })

# ###############################################################################  
#
# ###############################################################################
@game.route("/updategenerators", methods=["GET", "POST"])
@login_required
def update_generators():
  gid = request.args.get('gid', None)
  fid = request.args.get('fid', None)
  generator_updates = json.loads(request.args.get('gens', None))
  print(f"*"*80)
  print(f"generators = {generator_updates}")
  print(f"*"*80)
  bad_key_fields = ['id', 'id_game', 'id_facility'] 

  updated_generators = []
  for gen in generator_updates:
    bad_key_fields = ['id', 'id_game', 'id_facility'] 
    generator = Generator.query.filter_by(id=gen['id'], id_game=gid).first()
    generator_update_keys = list(gen.keys())

    if generator.state != "new":
      bad_key_fields.append('id_type')
  
    for gu_key in generator_update_keys:
      if gu_key not in bad_key_fields:
        # print(f"*"*80)
        # print(f"gu_key = '{gu_key}'")
        generator[gu_key] = gen[gu_key]

        if gu_key == 'id_type':
          generator_type = GeneratorType.query.filter_by(id=gen['id_type']).first()
          generator.build_turn=generator_type.build_time
          generator.prod_turn=generator_type.lifespan
          generator.decom_turn=generator_type.decom_time
  
    db.session.commit()
    generator_schema = GeneratorSchema()
    generator_serialized = generator_schema.dump(generator).data
    updated_generators.append(generator_serialized)

  return jsonify({
    'generators': updated_generators
  })

# ###############################################################################  
#
# ###############################################################################
@game.route("/updateglobalbidpolicy", methods=["GET", "POST"])
@login_required
def update_global_bid_policy():
  gid = request.args.get('gid', None)
  option = request.args.get('option', None)
  company = Company.query.filter_by(id_game=gid, id_user=current_user.id).first()

  company.global_bid_policy = option
  db.session.commit()

  return jsonify({'status': 'success'})

# ###############################################################################  
#
# ###############################################################################
@game.route("/updateglobalmaintpolicy", methods=["GET", "POST"])
@login_required
def update_global_maint_policy():
  gid = request.args.get('gid', None)
  option = request.args.get('option', None)
  company = Company.query.filter_by(id_game=gid, id_user=current_user.id).first()

  company.global_maintenance_policy = option
  db.session.commit()

  return jsonify({'status': 'success'})

# ###############################################################################  
#
# ###############################################################################
@game.route("/deletegenerator", methods=["GET", "POST"])
@login_required
def delete_generator(): 
  gid = request.args.get('gid', None)
  genId = request.args.get('genid', None)

  generator = Generator.query.filter_by(id=genId, id_game=gid).first()
  # print(f"*"*80)
  # print(f"{generator}")
  db.session.delete(generator)
  db.session.commit()

  return jsonify({'status': 'success'})

# ###############################################################################  
#
# ###############################################################################
@game.route("/viewcity", methods=["GET", "POST"])
@login_required
def viewcity():
  gid = request.args.get('gid', None)
  city_id = request.args.get('cid', None)
  city = City.query.get(city_id)

  return render_template("viewcity.html", commaNumber=add_commas_to_number, city=city)

# ###############################################################################  
#
# ###############################################################################
@game.route("/facilitytypes", methods=["GET", "POST"])
@login_required
def facility_types():
  gid = request.args.get('gid', None)

  facility_types = FacilityType.query.all()
  facility_types_schema = FacilityTypeSchema(many=True)
  facility_types_serialized = facility_types_schema.dump(facility_types).data

  generator_types = GeneratorType.query.all()
  generator_types_schema = GeneratorTypeSchema(many=True)
  generator_types_serialized = generator_types_schema.dump(generator_types).data

  power_types = PowerType.query.all()
  power_types_schema = PowerTypeSchema(many=True)
  power_types_serialized = power_types_schema.dump(power_types).data

  resource_types = ResourceType.query.all()
  resource_types_schema = ResourceTypeSchema(many=True)
  resource_types_serialized = resource_types_schema.dump(resource_types).data

  return jsonify({
    'facility_types': facility_types_serialized,
    'generator_types': generator_types_serialized,
    'power_types': power_types_serialized,
    'resource_types': resource_types_serialized
  })

# ###############################################################################  
#
# ###############################################################################
@game.route("/generatordetailhtml", methods=["GET", "POST"])
@login_required
def generator_detail_html():
  gid = request.args.get('gid', None)
  game = Game.query.filter_by(id=gid).first()
  genid = request.args.get('genid', None)
  generator = Generator.query.filter_by(id=genid, id_game=gid).first()
  start_prod_date = generator.start_prod_date

  if generator.state == "building":
    start_prod_date = get_current_game_date(game) + turns_to_hours(generator.build_turn) 

  eol_date_hours = get_current_game_date(game) + turns_to_hours(generator.build_turn) + turns_to_hours(generator.prod_turn)

  return render_template(
    "viewgenerator.html", 
    generator=generator,
    format_money=convert_to_money_string,
    production_date=format_date(start_prod_date, "Y Q"),
    end_of_life_date=format_date(eol_date_hours, "Y Q"),
  )  

# ###############################################################################  
#
# ###############################################################################
@game.route("/portfoliohtml", methods=["GET", "POST"])
@login_required
def portfolio_html():
  gid = request.args.get('gid', None)
  company = Company.query.filter_by(id_game=gid, id_user=current_user.id).first()
  facilities = Facility.query.filter_by(id_game=gid, id_company=company.id, state="active").all()

  generators = list()
  generators += (facility.generators for facility in facilities)

  # print(f"*"*80)
  # print(f"generator[0] = {generators[0]}")
  # print(f"generator[0].generator_type = {generators[0].generator_type}")

  return render_template(
    "viewportfolio.jinja",
    format_money=convert_to_money_string,
    company=company,
    bid_options=[
      {'name':"MC", 'disabled': False},
      {'name':"LCOE", 'disabled': False},
      {'name':"Fixed", 'disabled': True},
    ],
    maint_options=["Routine", "Proactive", "Reactive"]
  )
# ###############################################################################  
#
# ###############################################################################
@game.route("/quarterlyhtml", methods=["GET", "POST"])
@login_required
def quarterly_html():
  gid = request.args.get('gid', None)
  company = Company.query.filter_by(id_game=gid, id_user=current_user.id).first()
  facilities = Facility.query.filter_by(id_game=gid, id_company=company.id).all()
  generators = ([facility.generators for facility in facilities])
  gs = []
  for gens in generators:
    gs += gens

  # So the QR will not show up after every browser reload.
  company.show_QR = False
  db.session.commit()

  # fac_construction = db.session.query(db.func.sum(Facility.construction)).filter_by(id_game=gid, id_company=company.id).scalar()
  fac_construction = sum([fac.construction for fac in facilities])
  gen_construction = np.sum([gen.construction for gen in gs])
  
  return render_template(
    "viewquarterly.html",
    format_money=convert_to_money_string,
    fac_const=fac_construction,
    gen_const=gen_construction,
    company=company
  )

# ###############################################################################  
#
# ###############################################################################
@game.route("/turnbuttonhtml", methods=["GET", "POST"])
@login_required
def turn_button_html():
  gid = request.args.get('gid', None)
  game = Game.query.filter_by(id=gid).first()
  company = Company.query.filter_by(id_game=gid, id_user=current_user.id).first()

  return render_template("nextturnbutton.jinja", company=company, game=game)

# ###############################################################################  
#
# ###############################################################################
@game.route("/turnrunningdialoghtml", methods=["GET", "POST"])
@login_required
def turn_running_dialog_html():
  gid = request.args.get('gid', None)
  game = Game.query.filter_by(id=gid).first()

  return render_template("runningturn.html")

# ###############################################################################  
#
# ###############################################################################
@game.route("/eventdetailshtml", methods=["GET", "POST"])
@login_required
def event_details_html():
  gid = request.args.get('gid', None)
  prompt_id = request.args.get('prmtid', None)

  game = Game.query.filter_by(id=gid).first()
  prompt = Prompt.query.filter_by(id=prompt_id).first()

  return render_template("eventdetails.html", prompt=prompt, format_date=format_date)  
  

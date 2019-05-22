from random import choice, seed
from flask import Blueprint, flash, url_for, redirect, render_template, request, jsonify
from flask_login import login_required, current_user
from flask_socketio import send
from app import sio 
from app import db 
from app.models import User, Game, Company, Facility, Generator, City, FacilityType, GeneratorType, PowerType
from app.models import FacilitySchema, GeneratorSchema, CitySchema, CompanySchema, GameSchema, FacilityTypeSchema, GeneratorTypeSchema, PowerTypeSchema, ResourceTypeSchema
from app.game.init_game import init_game_models
from app.game.utils import get_current_game_date
from app.game.run_turn import calculate_quarter
# from app.game.runturn import runturn

game = Blueprint('game', __name__)

#################################################################################  
# initgame: load game models with starting data
@game.route("/cgame/<int:gid>", methods=["GET", "POST"])
@login_required
def initgame(gid):
  game = Game.query.filter_by(id=gid).first()

  if game == None:
    flash(f'Error creating game (code:010)','danger')  
    return render_template("title.html")

  if game.game_state != "initializing":
    flash(f'Error creating game (code:011)','danger')
    return render_template("title.html")

  if init_game_models(game) == True:
    game.game_state = "new"
    db.session.commit()
  else:
    flash(f'Error creating game (code:012)','danger')
    return render_template("title.html")    

  return redirect(url_for('game.joingame' , gid=gid))

#################################################################################  
# joingame: Join an eligible game 
@game.route("/jgame/<int:gid>", methods=["GET", "POST"])
@login_required
def joingame(gid):
  game = Game.query.filter_by(id=gid).first()
  company = Company.query.filter_by(id=current_user.current_company).first()
  
  if company.state != "new":
    flash(f"This company can\'t be used for this game.", "danger")
    return render_template("title.html")

  dummy_companies = Company.query.filter(Company.id_game == game.id, Company.id_user == 1).all()

  # We need to make sure two players don't get the same player_number.
  # There might be a better way, but I'll figure it out later. For now, 
  # if the random dummy company is picked it will immediately 
  # be assigned user id of 0 so it won't be chosen as a dummy
  # company by another player. 
  if len(dummy_companies) == 0:
    game.game_state = "playing"
    db.session.commit()
  else:
    seed()
    dc = choice(dummy_companies)
    dc.id_user = None
    db.session.commit()
    company.player_number = dc.player_number
    company.id_game = dc.id_game
    Facility.query.filter_by(id_company=dc.id).update({Facility.id_company: company.id}, synchronize_session=False)
    db.session.delete(dc)
    db.session.commit()    

  if game.game_state == "playing":
    flash(f'This game is full. Try joining another game.','danger')
    db.session.delete(company)
    db.session.commit()
    return render_template("title.html")

  return redirect(url_for('game.loadgame' , gid=gid))

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

  budget = '${:,.2f}'.format(company.budget)
  current_game_date = get_current_game_date(game)
  if company.state == 'new':
    company.state = 'view'
  db.session.commit()

  return render_template("game.html", company=company, game=game, budget=budget, facilities=facilities, cgd=current_game_date)


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
@game.route("/facilitytypes", methods=["GET", "POST"])
@login_required
def facility_types():
  facility_types = FacilityType.query.all()
  facility_types_schema = FacilityTypeSchema(many=True)
  serialized_facility_types = facility_types_schema.dump(facility_types).data
  return jsonify({'facility_types': serialized_facility_types})

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
@game.route("/playerfacility", methods=["GET"])
@login_required
def player_facility():

  gid = request.args.get('gid', None)
  fid = request.args.get('fid', None)

  facility = Facility.query.filter_by(id=fid).first()
  facility_schema = FacilitySchema()
  facility_serialized = facility_schema.dump(facility).data

  company = facility.company
  company_schema = CompanySchema()
  company_serialized = company_schema.dump(company).data

  facility_type = facility.facility_type
  facility_type_schema = FacilityTypeSchema()
  facility_type_serialized = facility_type_schema.dump(facility_type).data

  generators = Generator.query.filter_by(id_facility=fid, id_game=gid).all()
  generators_schema = GeneratorSchema(many=True)
  generators_serialized = generators_schema.dump(generators).data

  generator_types = GeneratorType.query.filter_by(id_facility_type=facility_type.id).all()
  generator_types_schema = GeneratorTypeSchema(many=True)
  generator_types_serialized = generator_types_schema.dump(generator_types).data

  gen_type_list = [gen_type.id for gen_type in generator_types]
  print("-"*80)
  print(gen_type_list)

  power_types = [gen_type.power_type for gen_type in generator_types]
  power_type_schema = PowerTypeSchema(many=True)
  power_type_serialized = power_type_schema.dump(power_types).data

  resource_types = [gen_type.resource_type for gen_type in generator_types]
  resource_type_schema = ResourceTypeSchema(many=True)
  resource_type_serialized = resource_type_schema.dump(resource_types).data

  return jsonify({
    'company': company_serialized,
    'facility': facility_serialized,
    'facility_type': facility_type_serialized,
    'generators': generators_serialized,
    'generator_types': generator_types_serialized,
    'power_types': power_type_serialized,
    'resource_types': resource_type_serialized
  })
  
# ###############################################################################  
#
# ###############################################################################
@game.route("/playerfacilities", methods=["GET"])
@login_required
def player_facilities():

  gid = request.args.get('gid', None)
  company = Company.query.filter_by(id_game=gid, id_user=current_user.id).first()

  facility = Facility.query.filter_by(id_game=gid, id_company=company.id).all()
  facility_schema = FacilitySchema(many=True)
  facility_serialized = facility_schema.dump(facility).data
 
  return jsonify({'facility': facility_serialized})

# ###############################################################################  
#
# ###############################################################################
@game.route("/buildfacility", methods=["GET", "POST"])
@login_required
def buildfacility():
  pass

# ###############################################################################  
#
# ###############################################################################
@game.route("/updatefacility", methods=["GET", "POST"])
@login_required
def updatefacility():
  pass

# ###############################################################################  
#
# ###############################################################################
@game.route("/viewfacility", methods=["GET", "POST"])
@login_required
def viewfacility():

  gid = request.args.get('gid', None)
  fid = request.args.get('fid', None)
  facility = Facility.query.filter_by(id=fid, id_game=gid).first()
  facility_capacity = sum(gen.generator_type.nameplate_capacity for gen in facility.generators)
  generator_type = facility.generators[0].generator_type
 
  return render_template("viewfacility.html", facility=facility, facility_type=facility.facility_type, generator_type=generator_type, faccap=facility_capacity)

# ###############################################################################  
#
# ###############################################################################
@game.route("/viewcity", methods=["GET", "POST"])
@login_required
def viewcity():
  gid = request.args.get('gid', None)
  city_id = request.args.get('cid', None)
  city = City.query.get(city_id)
  return render_template("viewcity.html", city=city)

# ###############################################################################  
#
# ###############################################################################
@game.route("/runturn", methods=["GET", "POST"])
@login_required
def runturn():

  gid = request.args.get('gid', None)
  game = Game.query.filter_by(id=gid).first()
  gens = game.generators
  cities = game.cities
  calculate_quarter(gens, cities)

  return "Done running turn."
  


##################################################################
# Old Code - Delete when you think appropriate


# @game.route("/facility_types")
# @login_required
# def facility_types():
#   facility_types = FacilityType.query.all()
#   facility_types_schema = FacilityTypeSchema(many=True)
#   serialized_facility_types = facility_types_schema.dump(facility_types).data
#   return jsonify({'facility_types': serialized_facility_types})  

# @game.route("/generator_types")
# @login_required
# def generator_types():
#   generator_types = GeneratorType.query.all()
#   generator_types_schema = GeneratorTypeSchema(many=True)
#   serialized_generator_types = generator_types_schema.dump(generator_types).data
#   return jsonify({'generator_types': serialized_generator_types})





# def loadgame(status):
#   print ("status = ", status)
#   company = Company.query.filter_by(id=current_user.current_company).first()
#   game = Game.query.filter_by(id=company.id_game).first()
#   num_companies = Company.query.filter_by(id_game=game.id).count()
#   company.connected_to_game = 1

#   if status == 'new':
#     if num_companies == 1:
#       initgame(game.id)

#     player_facilities = Facility.query.filter_by(player_number=company.player_number).all()
#     for player_facility in player_facilities:
#       player_facility.id_company = company.id

#   db.session.commit()
#   budget = '${:,.2f}'.format(company.budget)
#   current_game_date = get_current_game_date(game)
#   print("current_game_date = ", current_game_date)
#   return render_template("game.html", company=company, game=game, budget=budget, facilities=facilities, cgd=current_game_date)
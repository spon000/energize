from flask import Blueprint, flash, url_for, redirect, render_template, request, jsonify
from flask_login import login_required, current_user
from flask_socketio import send
from app import sio 
from app import db 
from app.models import User, Game, Company, Facility, Generator, City, FacilityType, GeneratorType, PowerType
from app.models import FacilitySchema, GeneratorSchema, CitySchema, CompanySchema, GameSchema, FacilityTypeSchema, GeneratorTypeSchema, PowerTypeSchema
from app.game.initgame import initgame
from app.game.utils import get_current_game_date
from app.game.run_turn import calculate_quarter
# from app.game.runturn import runturn

game = Blueprint('game', __name__)

# ###############################################################################  
#
# ###############################################################################
@game.route("/game", defaults={'status': 'new'}, methods=["GET", "POST"])
@game.route("/game/<status>", methods=["GET", "POST"])
@login_required
def startgame(status):
  print ("status = ", status)
  company = Company.query.filter_by(id=current_user.current_company).first()
  game = Game.query.filter_by(id=company.id_game).first()
  num_companies = Company.query.filter_by(id_game=game.id).count()
  company.connected_to_game = 1

  if status == 'new':
    if num_companies == 1:
      initgame(game.id)

    player_facilities = Facility.query.filter_by(player_number=company.player_number, id_game=game.id).all()
    for player_facility in player_facilities:
      player_facility.id_company = company.id

  db.session.commit()
  budget = '${:,.2f}'.format(company.budget)
  current_game_date = get_current_game_date(game)
  print("current_game_date = ", current_game_date)
  return render_template("game.html", company=company, game=game, budget=budget, facilities=facilities, cgd=current_game_date)


# ###############################################################################  
#
# ###############################################################################
@game.route("/facilities", methods=["GET", "POST"])
@login_required
def facilities():
  facilities = Facility.query.all()
  facilities_schema = FacilitySchema(many=True)
  serialized_facilities = facilities_schema.dump(facilities).data
  return jsonify({'facilities': serialized_facilities})

# ###############################################################################  
#
# ###############################################################################
@game.route("/generators", methods=["GET", "POST"])
@login_required
def generators():
  generators = Generator.query.all()
  generators_schema = GeneratorSchema(many=True)
  serialized_generators = generators_schema.dump(generators).data
  return jsonify({'generators': serialized_generators})

# ###############################################################################  
#
# ###############################################################################
@game.route("/gamedata", methods=["GET", "POST"])
@login_required
def game_data():
  company = Company.query.filter_by(id=current_user.current_company).first()
  game = Game.query.filter_by(id=company.id_game).first()
  game_schema = GameSchema()
  serialized_game = game_schema.dump(game).data
  return jsonify({'game': serialized_game})

# ###############################################################################  
#
# ###############################################################################
@game.route("/company", methods=["GET", "POST"])
@login_required
def company():
  company = Company.query.filter_by(id=current_user.current_company).first()
  game = Game.query.filter_by(id=company.id_game).first()
 
  if request.method == 'GET':
    company_schema = CompanySchema()
    serialized_company = company_schema.dump(company).data
    return jsonify({'player_company': serialized_company})
  else:
    company.state = request.args.get('pcstate')
    db.session.commit()
    if company.state == "turn":
      companies_ready = Company.query.filter_by(id_game=game.id, state="turn").count()
      if companies_ready == 1:
        return redirect(url_for('game.runturn'))
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
  companies = Company.query.all()
  companies_schema = CompanySchema()
  serialized_companies = company_schema.dump(companies).data
  return jsonify({'companies': serialized_companies})

# ###############################################################################  
#
# ###############################################################################
@game.route("/cities", methods=["GET", "POST"])
@login_required
def cities():
  cities = City.query.all()
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
@game.route("/playerfacility/<int:facility_id>", methods=["GET", "POST"])
@login_required
def player_facility(facility_id):

  company = Company.query.filter_by(id=current_user.current_company).first()
  game = Game.query.filter_by(id=company.id_game).first()
  
  facility = Facility.query.filter_by(id=facility_id).all()
  facility_schema = FacilitySchema(many=True)
  facility_serialized = facility_schema.dump(facility).data

  generators = Generator.query.filter_by(id_facility=facility_id).all()
  generators_schema = GeneratorSchema(many=True)
  generators_serialized = generators_schema.dump(generators).data

  return jsonify({'facility': facility_serialized, 'generators': generators_serialized})


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
@game.route("/viewfacility/<int:facility_id>", methods=["GET", "POST"])
@login_required
def viewfacility(facility_id):
  facility = Facility.query.get(facility_id)
  # generators = Generator.query.get(facility_id)
  facility_type = FacilityType.query.get(facility.id_type)
  generator_type = GeneratorType.query.get(facility.generators[0].id_type)
  return render_template("viewfacility.html", facility=facility, facility_type=facility_type, generator_type=generator_type)

# ###############################################################################  
#
# ###############################################################################
@game.route("/viewcity/<int:city_id>", methods=["GET", "POST"])
@login_required
def viewcity(city_id):
  city = City.query.get(city_id)
  return render_template("viewcity.html", city=city)

# ###############################################################################  
#
# ###############################################################################
@game.route("/runturn", methods=["GET", "POST"])
@login_required
def runturn():
  gens = Generator.query.all()
  cities = City.query.all()
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
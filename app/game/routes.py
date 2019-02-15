from flask import Blueprint, render_template, request, jsonify
from flask_login import login_required, current_user
from app import db 
from app.models import User, Game, Company, Facility, City, FacilityType, GeneratorType, PowerType
from app.models import FacilitySchema, GeneratorSchema, CitySchema, CompanySchema, GameSchema, FacilityTypeSchema, GeneratorTypeSchema, PowerTypeSchema
from app.game.initgame import initgame

game = Blueprint('game', __name__)

@game.route("/game", methods=["GET", "POST"])
@login_required
def newgame():
  company = Company.query.filter_by(id=current_user.current_company).first()
  game = Game.query.filter_by(id=company.id_game).first()
  num_companies = Company.query.filter_by(id_game=game.id).count()

  if num_companies == 1:
    initgame()

  player_facilities = Facility.query.filter_by(player_number=company.player_number).all()
  for player_facility in player_facilities:
    player_facility.id_company = company.id

  db.session.commit()
  budget = '${:,.2f}'.format(company.budget)
  return render_template("game.html", company=company, game=game, budget=budget, facilities=facilities)

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

@game.route("/facilities", methods=["GET", "POST"])
@login_required
def facilities():
  facilities = Facility.query.all()
  facilities_schema = FacilitySchema(many=True)
  serialized_facilities = facilities_schema.dump(facilities).data
  return jsonify({'facilities': serialized_facilities})

@game.route("/generators", methods=["GET", "POST"])
@login_required
def generators():
  generators = Generator.query.all()
  generators_schema = GeneratorSchema(many=True)
  serialized_generators = generators_schema.dump(generators).data
  return jsonify({'generators': serialized_generators})

@game.route("/gamedata", methods=["GET", "POST"])
@login_required
def game_data():
  company = Company.query.filter_by(id=current_user.current_company).first()
  game = Game.query.filter_by(id=company.id_game).first()
  game_schema = GameSchema()
  serialized_game = game_schema.dump(game).data
  return jsonify({'game': serialized_game})

@game.route("/company", methods=["GET", "POST"])
@login_required
def company():
  company = Company.query.filter_by(id=current_user.current_company).first()  
  if request.method == 'GET':
    company_schema = CompanySchema()
    serialized_company = company_schema.dump(company).data
    return jsonify({'player_company': serialized_company})
  else:
    company.state = request.args.get('pcstate');
    db.session.commit()
    return "success"

@game.route("/companies", methods=["GET", "POST"])
@login_required
def companies():
  companies = Company.query.all()
  companies_schema = CompanySchema()
  serialized_companies = company_schema.dump(companies).data
  return jsonify({'companies': serialized_companies})

@game.route("/cities", methods=["GET", "POST"])
@login_required
def cities():
  cities = City.query.all()
  cities_schema = CitySchema(many=True)
  serialized_cities = cities_schema.dump(cities).data
  return jsonify({'cities': serialized_cities})


############################################################
@game.route("/facilitytypes", methods=["GET", "POST"])
@login_required
def facility_types():
  facility_types = FacilityType.query.all()
  facility_types_schema = FacilityTypeSchema(many=True)
  serialized_facility_types = facility_types_schema.dump(facility_types).data
  return jsonify({'facility_types': serialized_facility_types})

@game.route("/generatortypes", methods=["GET", "POST"])
@login_required
def generator_types():
  generator_types = GeneratorType.query.all()
  generator_types_schema = GeneratorTypeSchema(many=True)
  serialized_generator_types = generator_types_schema.dump(generator_types).data
  return jsonify({'generator_types': serialized_generator_types})

@game.route("/powertypes", methods=["GET", "POST"])
@login_required
def power_types():
  power_types = PowerType.query.all()
  power_types_schema = PowerTypeSchema(many=True)
  serialized_power_types = power_types_schema.dump(power_types).data
  return jsonify({'power_types': serialized_power_types})


###############################################################
@game.route("/buildfacility", methods=["GET", "POST"])
@login_required
def buildfacility():
  pass

@game.route("/updatefacility", methods=["GET", "POST"])
@login_required
def updatefacility():
  pass

@game.route("/viewfacility/<int:facility_id>", methods=["GET", "POST"])
@login_required
def viewfacility(facility_id):
  facility = Facility.query.get(facility_id)
  facility_type = FacilityType.query.get(facility.id_type)
  generator_type = GeneratorType.query.get(facility.generators[0].id_type)
  return render_template("viewfacility.html", facility=facility, facility_type=facility_type, generator_type=generator_type)

@game.route("/viewcity/<int:city_id>", methods=["GET", "POST"])
@login_required
def viewcity(city_id):
  city = City.query.get(city_id)
  return render_template("viewcity.html", city=city)

##################################################################
@game.route("/runturn", methods=["GET", "POST"])
@login_required
def runturn():
  pass




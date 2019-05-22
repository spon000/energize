from datetime import datetime
from app import db, ma, login_manager
from flask_login import UserMixin


@login_manager.user_loader
def load_user(user_id):
  return User.query.get(int(user_id))

#########################################################################################
# User Model
class User(db.Model, UserMixin):
  id = db.Column(db.Integer, primary_key=True)
 
  # Data
  username = db.Column(db.String(20), unique=True, nullable=False, default='JohnDoe')
  email = db.Column(db.String(120), unique=True, nullable=False, default='jd@gmail.com')
  image_file = db.Column(db.String(20), nullable=False, default='default.png')
  password = db.Column(db.String(60), nullable=False)
  companies_max = db.Column(db.Integer, nullable=False, default=4)
  current_company = db.Column(db.Integer, nullable=False, default=0)
  
  # Relational data
  companies = db.relationship('Company')

  # Methods
  def __repr__(self):
    return f"User('{self.username}', {self.email}, '{self.image_file}')" 

#########################################################################################
# Game Model
class Game(db.Model):
  id = db.Column(db.Integer, primary_key=True)

  # Data
  date_create = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
  name = db.Column(db.String(30), nullable=False, default='Game #')
  companies_max = db.Column(db.Integer, nullable=False, default=5)
  companies_joined = db.Column(db.Integer, default=0)
  companies_ready = db.Column(db.Integer, default=0)
  game_state = db.Column(db.Enum("initializing", "new", "runturn", "waiting", "playing", "finished"), default="initializing")
  turn_number = db.Column(db.Integer, default=1)
  start_quarter = db.Column(db.Integer, default=1)
  start_year = db.Column(db.Integer, default=2019)

  # Relational data
  companies = db.relationship('Company', lazy=True)
  facilities = db.relationship('Facility', lazy=True)
  generators = db.relationship('Generator', lazy=True)
  cities = db.relationship('City', lazy=True)
    
  # Methods
  def __repr__(self):
    return f"Game('{self.name}', '{self.companies_max}', '{self.generators}')"

#########################################################################################
# Company Model
class Company(db.Model):
  id = db.Column(db.Integer, primary_key=True)

  # Foreign keys
  id_game = db.Column(db.Integer, db.ForeignKey('game.id'), nullable=True)
  id_user = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)

  # Data
  player_number = db.Column(db.Integer, nullable=False)
  name = db.Column(db.String(30), nullable=False, default='Company #')
  score = db.Column(db.Integer, nullable=False, default=0)
  budget = db.Column(db.Float, nullable=False, default=10000)
  quarter_net = db.Column(db.Float, default=0)
  global_bid_policy = db.Column(db.Enum("high", "medium", "low"), default="medium")
  state = db.Column(db.Enum("new", "view", "build", "turn", "ready"), default="new")
  cost_operational = db.Column(db.Float, default=0)
  connected_to_game = db.Column(db.Integer, nullable=False, default=0)

  # Relational data
  facilities = db.relationship('Facility')
  game = db.relationship('Game')
  user = db.relationship('User')

  # Methods
  def __repr__(self):
    return f"Company( \
      'company name: {self.name}\n', \
      'score: {self.score}\n', \
      'company id: {self.id}\n', \
      'game id: {self.id_game}\n', \
      'player num: {self.player_number}\n', \
      'user id: {self.id_user}\n', \
      'connected: {self.connected_to_game}\n', \
    )"

#########################################################################################
# Facility Model
class Facility(db.Model):
  id = db.Column(db.Integer, primary_key=True)

  # Foreign keys
  id_type = db.Column(db.Integer, db.ForeignKey('facility_type.id'), nullable=False)
  id_company = db.Column(db.Integer, db.ForeignKey('company.id'))
  id_game = db.Column(db.Integer, db.ForeignKey('game.id'), nullable=False)

  # Data
  fid = db.Column(db.Integer)
  name = db.Column(db.String(30), default="Facility #")
  state = db.Column(db.Enum("new", "abandoned", "paused", "building", "active", "inactive"), default="new")
  player_number = db.Column(db.Integer)
  build_turn = db.Column(db.Integer, default=0)
  start_build_date = db.Column(db.String(20))
  start_prod_date = db.Column(db.String(20))
  column = db.Column(db.Integer, default=0)
  row = db.Column(db.Integer, default=0)
  layer = db.Column(db.Integer, default=2)
  area = db.Column(db.Float)

  # Relational data
  facility_type = db.relationship('FacilityType')
  generators = db.relationship('Generator')
  company = db.relationship('Company')
  game = db.relationship('Game')

  # Methods
  def __repr__(self):
    return f"Facility('{self.name}', '{self.id_type}', '{self.player_number}', '{self.state}')"

#########################################################################################
# Generator Model
class Generator(db.Model):
  id = db.Column(db.Integer, primary_key=True)

  # Foreign key
  id_type = db.Column(db.Integer, db.ForeignKey('generator_type.id'), nullable=False)
  id_facility = db.Column(db.Integer, db.ForeignKey('facility.id'), nullable=False)
  id_game = db.Column(db.Integer, db.ForeignKey('game.id'), nullable=False)

  # Data
  state = db.Column(db.Enum("new", "building", "available", "unavailable"), default="new")
  build_turn = db.Column(db.Integer, default=0)
  start_build_date = db.Column(db.String(20))
  start_prod_date = db.Column(db.String(20))
  local_bid_policy = db.Column(db.Enum("option1", "option2", "option3"), default="option2")
  bid_policy_value = db.Column(db.Float, default=0)
  extension = db.Column(db.Float, default=0)

  # Relational Data
  generator_type = db.relationship('GeneratorType')
  facility = db.relationship('Facility')

  # Methods
  def __repr__(self):
    return f"Generator( \
      'Id: {self.id}\n')" 
      # 'Type Id: {self.id_type}\n', \
      # 'Type: {self.generator_type}\n', \
      # 'Facility Id: {self.id_facility}\n', \
      # 'Facility: {self.facility}\n', \
      # 'Game Id: {self.id_game}\n', \
      # 'State: {self.state}\n', \
    # )"

    # return f"Generator('{self.id_type}', '{self.id_facility}', '{self.state}')"

#########################################################################################
# Generator Model
class City(db.Model):
  id = db.Column(db.Integer, primary_key=True)

  # Foreign keys
  id_game = db.Column(db.Integer, db.ForeignKey('game.id'), nullable=False)

  # Data
  name = db.Column(db.String(30), nullable=False)
  previous_population = db.Column(db.Integer)
  population = db.Column(db.Integer, nullable=False)
  daily_consumption = db.Column(db.Integer, nullable=False)
  column = db.Column(db.Integer)
  row = db.Column(db.Integer)
  layer = db.Column(db.Integer)

###############################################################################################
# Facility Type Model
class FacilityType(db.Model):
  id = db.Column(db.Integer, primary_key=True)

  # Foreign keys
  # id_game = db.Column(db.Integer, db.ForeignKey('game.id'), nullable=False)

  # Data
  maintype = db.Column(db.String(15), nullable=False)
  subtype = db.Column(db.String(10))
  name = db.Column(db.String(25))
  build_time = db.Column(db.Integer)
  minimum_area = db.Column(db.Float) 
  fixed_cost_build = db.Column(db.Float)
  fixed_cost_operate = db.Column(db.Float)
  marginal_cost_build = db.Column(db.Float)
  marginal_cost_operate = db.Column(db.Float, default=0)
  decomission_cost = db.Column(db.Float)
  description = db.Column(db.Text)

  # Relational Data
  # game = db.relationship('Game')

###############################################################################################
# Generator Type Model
class GeneratorType(db.Model):
  id = db.Column(db.Integer, primary_key=True)

  # Foreign keys
  id_facility_type = db.Column(db.Integer, db.ForeignKey('facility_type.id'), nullable=False)
  id_power_type = db.Column(db.Integer, db.ForeignKey('power_type.id'), nullable=False)
  id_resource_type = db.Column(db.Integer, db.ForeignKey('resource_type.id'), nullable=False)
  # id_game = db.Column(db.Integer, db.ForeignKey('game.id'), nullable=False)

  # Data
  nameplate_capacity = db.Column(db.Integer, nullable=False) 
  build_time = db.Column(db.Integer)
  efficiency = db.Column(db.Float)
  continuous = db.Column(db.Boolean, default=True)
  lifespan = db.Column(db.Integer)
  fixed_cost_build = db.Column(db.Float)
  fixed_cost_operate = db.Column(db.Float)
  variable_cost_operate = db.Column(db.Float)  
  decomission_cost = db.Column(db.Float)     

  # Relational Data
  facility_type = db.relationship('FacilityType')
  generators = db.relationship('Generator')
  power_type = db.relationship('PowerType')
  resource_type = db.relationship('ResourceType')
  # game = db.relationship('Game')

  # Methods
  def __repr__(self):
    return ( 
      f"GeneratorType -->\n" +
      f"ID: {self.id}\n" +
      f"Facility Type Id: {self.id_facility_type}\n" +
      f"Power Type Id: {self.id_power_type}\n" +
      f"Power Type : {self.power_type.maintype}\n" +
      f"Resource Type: {self.id_resource_type}"
    )


###############################################################################################
# Static models. These will not change during gameplay.
###############################################################################################

###############################################################################################
# Power Type Model
class PowerType(db.Model):
  id = db.Column(db.Integer, primary_key=True)

  # Data
  name = db.Column(db.String(20))
  description = db.Column(db.Text)


###############################################################################################
# Resource Type Model  
class ResourceType(db.Model):
  id = db.Column(db.Integer, primary_key=True)

  # Data
  name = db.Column(db.String(20))
  unit = db.Column(db.String(20))
  available = db.Column(db.Boolean, default=True)
  average_price = db.Column(db.Float, default=0.0)
  energy_content = db.Column(db.Float, default= 0.0)


########################################################################################
# Schemas to be used with Marshmallow for serializing objects.
# https://www.youtube.com/watch?v=kRNXKzfYrPU

# Schema for Game
class GameSchema(ma.ModelSchema):
  class Meta:
    model = Game

# Schema for Company
class CompanySchema(ma.ModelSchema):
  class Meta:
    model = Company

# Schema for Facility 
class FacilitySchema(ma.ModelSchema):
  class Meta:
    model = Facility

# Schema for Generator
class GeneratorSchema(ma.ModelSchema):
  class Meta:
    model = Generator

# Schema for City
class CitySchema(ma.ModelSchema):
  class Meta:
    model = City  

# Schema for FacilityType
class FacilityTypeSchema(ma.ModelSchema):
  class Meta:
    model = FacilityType

# Schema for GeneratorType
class GeneratorTypeSchema(ma.ModelSchema):
  class Meta:
    model = GeneratorType

# Schema for PowerType
class PowerTypeSchema(ma.ModelSchema):
  class Meta:
    model = PowerType

# Schema for ResourceType
class ResourceTypeSchema(ma.ModelSchema):
  class Meta:
    model = ResourceType





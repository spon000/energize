from datetime import datetime
from app import db, ma, login_manager
from flask_login import UserMixin


@login_manager.user_loader
def load_user(user_id):
  return User.query.get(int(user_id))

# Game Models
class Game(db.Model):
  id = db.Column(db.Integer, primary_key=True)
  date_create = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
  name = db.Column(db.String(30), nullable=False, default='Game #')
  companies = db.relationship('Company', backref='game', lazy=True)
  companies_max = db.Column(db.Integer, nullable=False, default=5)
  companies_joined = db.Column(db.Integer, default=0)
  companies_ready = db.Column(db.Integer, default=0)
  game_state = db.Column(db.Enum("new", "adding", "waiting","playing","finished"), default="new")
  turn_number = db.Column(db.Integer, default=0)
  current_quarter = db.Column(db.Integer, nullable=False, default=1)
  current_year = db.Column(db.Integer, nullable=False, default=2019)
    
  def __repr__(self):
    return f"Game('{self.name}', '{self.companies_max}')"

class Company(db.Model):
  id = db.Column(db.Integer, primary_key=True)
  id_game = db.Column(db.Integer, db.ForeignKey('game.id'), nullable=False)
  id_user = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
  facilities = db.relationship('Facility', backref='company', lazy=True)
  player_number = db.Column(db.Integer, nullable=False)
  name = db.Column(db.String(30), nullable=False, default='Company #')
  score = db.Column(db.Integer, nullable=False, default=0)
  budget = db.Column(db.Float, nullable=False, default=10000)
  state = db.Column(db.Enum("view", "build", "turn", "ready"), default="view")
  cost_operational = db.Column(db.Float)

  def __repr__(self):
    return f"Company('company name: {self.name}', 'score: {self.score}', 'company id: {self.id}', 'game id: {self.id_game}', 'user id: {self.id_user}')"

class Facility(db.Model):
  id = db.Column(db.Integer, primary_key=True)
  id_type = db.Column(db.Integer, db.ForeignKey('facility_type.id'), nullable=False)
  id_company = db.Column(db.Integer, db.ForeignKey('company.id'))
  name = db.Column(db.String(30), default="Facility #")
  state = db.Column(db.Enum("planning", "stalled", "building", "active", "inactive"), default="planning")
  player_number = db.Column(db.Integer)
  build_turn = db.Column(db.Integer, default=0)
  start_build_date = db.Column(db.String(20))
  start_prod_date = db.Column(db.String(20))
  column = db.Column(db.Integer, default=0)
  row = db.Column(db.Integer, default=0)
  layer = db.Column(db.Integer, default=2)
  area = db.Column(db.Float)
  generators = db.relationship('Generator', backref='facility', lazy=True)

  def __repr__(self):
    return f"Facility('{self.name}', '{self.id_type}', '{self.player_number}', '{self.state}')"

class Generator(db.Model):
  id = db.Column(db.Integer, primary_key=True)
  id_type = db.Column(db.Integer, db.ForeignKey('generator_type.id'))
  id_facility = db.Column(db.Integer, db.ForeignKey('facility.id'))
  state = db.Column(db.Enum("planning", "building", "available", "unavailable"), default="planning")
  build_turn = db.Column(db.Integer, default=0)
  start_build_date = db.Column(db.String(20))
  start_prod_date = db.Column(db.String(20))
  
  extension = db.Column(db.Float, default=0)

  def __repr__(self):
    return f"Generator('{self.id_type}', '{self.id_facility}', '{self.state}')"

class City(db.Model):
  id = db.Column(db.Integer, primary_key=True)
  name = db.Column(db.String(30), nullable=False)
  population = db.Column(db.Integer, nullable=False)
  daily_consumption = db.Column(db.Integer, nullable=False)
  column = db.Column(db.Integer)
  row = db.Column(db.Integer)
  layer = db.Column(db.Integer)


###############################################################################################
# Supply Type Tables. Not modified during a game.
class FacilityType(db.Model):
  id = db.Column(db.Integer, primary_key=True)
  maintype = db.Column(db.String(15), nullable=False)
  subtype = db.Column(db.String(10))
  name = db.Column(db.String(25))
  build_time = db.Column(db.Integer)
  minimum_area = db.Column(db.Float) 
  fixed_cost_build = db.Column(db.Float)
  fixed_cost_operate = db.Column(db.Float)
  marginal_cost_build = db.Column(db.Float)
  marginal_cost_operate = db.Column(db.Float)
  description = db.Column(db.Text)
  facilities = db.relationship('Facility', backref='facility_type', lazy=True)

class GeneratorType(db.Model):
  id = db.Column(db.Integer, primary_key=True)
  id_facility_type = db.Column(db.Integer, db.ForeignKey('facility_type.id'))
  id_power_type = db.Column(db.Integer, db.ForeignKey('power_type.id'))
  id_resource_type = db.Column(db.Integer, db.ForeignKey('resource_type.id'))
  facility_type = db.relationship('FacilityType')
  power_type = db.relationship('PowerType')
  resource_type = db.relationship('ResourceType')
  generators = db.relationship('Generator', backref='generator_type', lazy=True)
  build_time = db.Column(db.Integer)
  nameplate_capacity = db.Column(db.Integer, nullable=False)
  efficiency = db.Column(db.Float)
  continuous = db.Column(db.Boolean, default=True)  
  lifespan = db.Column(db.Integer)

class PowerType(db.Model):
  id = db.Column(db.Integer, primary_key=True)
  maintype = db.Column(db.String(20))
  description = db.Column(db.Text)

class ResourceType(db.Model):
  id = db.Column(db.Integer, primary_key=True)
  name = db.Column(db.String(20))

#########################################################################################
# User table
class User(db.Model, UserMixin):
  id = db.Column(db.Integer, primary_key=True)
  companies = db.relationship('Company', backref='user', lazy=True)
  username = db.Column(db.String(20), unique=True, nullable=False, default='JohnDoe')
  email = db.Column(db.String(120), unique=True, nullable=False, default='jd@gmail.com')
  image_file = db.Column(db.String(20), nullable=False, default='default.png')
  password = db.Column(db.String(60), nullable=False)
  companies_max = db.Column(db.Integer, nullable=False, default=1)
  current_company = db.Column(db.Integer, nullable=False, default=0)
  
  def __repr__(self):
    return f"User('{self.username}', {self.email}, '{self.image_file}')" 


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





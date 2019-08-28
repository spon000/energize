from datetime import datetime
from app import db, ma, login_manager
from flask_login import UserMixin


@login_manager.user_loader
def load_user(user_id):
  return User.query.get(int(user_id))


# prompt_x_company = db.Table('prompt_x_company',
#   db.Column('prompt_id',  db.Integer, db.ForeignKey('prompt.id'),  primary_key=True),
#   db.Column('company_id', db.Integer, db.ForeignKey('company.id'), primary_key=True))

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

  # Allows you to access object properties as an associative array ex: generator['state']
  def __getitem__(self, key):
    return getattr(self, key)
  
  # Allows you to assign values to object properties as an associative array ex: generator['state'] = "new"
  def __setitem__(self, key, value):
    setattr(self, key, value)
      
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
  turn_number = db.Column(db.Integer, default=0)
  zero_year = db.Column(db.Integer, default=1920)

  # 853920 hours from the year 1920 = 2018:10:1:0 (yyyy:mm:dd:hh)  
  sim_start_date = db.Column(db.Integer, default=853920) 
  start_quarter = db.Column(db.Integer, default=4)
  start_year = db.Column(db.Integer, default=2018)
  total_years = db.Column(db.Integer, default=50)

  # Relational data
  companies = db.relationship('Company', lazy=True)
  facilities = db.relationship('Facility', lazy=True)
  generators = db.relationship('Generator', lazy=True)
  cities = db.relationship('City', lazy=True)
    
  # Methods

  # Allows you to access object properties as an associative array ex: generator['state']
  def __getitem__(self, key):
    return getattr(self, key)
  
  # Allows you to assign values to object properties as an associative array ex: generator['state'] = "new"
  def __setitem__(self, key, value):
    setattr(self, key, value)

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
  player_type = db.Column(db.Enum("ai", "human"), default="ai")
  name = db.Column(db.String(30), nullable=False, default='Company #')
  score = db.Column(db.Integer, nullable=False, default=0)
  balance = db.Column(db.Float, nullable=False, default=1000000000)
  quarter_net = db.Column(db.Float, default=0)
  global_bid_policy = db.Column(db.Enum("MC", "LCOE", "Fixed"), default="MC")
  global_maintenance_policy = db.Column(db.Enum("Routine", "Proactive", "Reactive"), default="Routine")
  state = db.Column(db.Enum("view", "build", "turn", "ready"), default="view")
  cost_operational = db.Column(db.Float, default=0)
  connected_to_game = db.Column(db.Integer, nullable=False, default=0)

  # Relational data
  
  game = db.relationship('Game')
  user = db.relationship('User')
  facilities = db.relationship('Facility')
  prompts = db.relationship( 'Prompt')

  # Methods

  # Allows you to access object properties as an associative array ex: generator['state']
  def __getitem__(self, key):
    return getattr(self, key)
  
  # Allows you to assign values to object properties as an associative array ex: generator['state'] = "new"
  def __setitem__(self, key, value):
    setattr(self, key, value)

  def __repr__(self):
    return (
      f"Company -\n"
      f"\tId: {self.id}\n"
      f"\tGame Id: {self.id_game}\n"
      f"\tUser Id: {self.id_user}\n"
      f"\tPlayer Num: {self.player_number}\n"
      f"\tPlayer Type: {self.player_type}\n"
      f"\tName: {self.name}\n"
      f"\tState: {self.state}\n"
      f"\tBalance: {self.balance}\n"
    )


#########################################################################################
# Facility Model
class Facility(db.Model):
  id = db.Column(db.Integer, primary_key=True)

  # Foreign keys
  id_type = db.Column(db.Integer, db.ForeignKey('facility_type.id'), nullable=False, default=9)
  id_company = db.Column(db.Integer, db.ForeignKey('company.id'))
  id_game = db.Column(db.Integer, db.ForeignKey('game.id'), nullable=False)

  # Data
  fid = db.Column(db.Integer)
  name = db.Column(db.String(30), default="Facility #")
  state = db.Column(db.Enum("new", "abandoned", "paused", "building", "active", "inactive"), default="new")
  player_number = db.Column(db.Integer)
  build_turn = db.Column(db.Integer, default=0)
  prod_turn = db.Column(db.Integer, default=0)
  decom_turn = db.Column(db.Integer, default=0)
  start_build_date = db.Column(db.Integer, default=0)
  start_prod_date = db.Column(db.Integer, default=0)
  end_prod_date = db.Column(db.Integer, default=0)
  om_cost = db.Column(db.Float, default=0)
  revenue = db.Column(db.Float,default=0)
  column = db.Column(db.Integer, default=0)
  row = db.Column(db.Integer, default=0)
  layer = db.Column(db.Integer, default=2)
  area = db.Column(db.Float)
  counter = db.Column(db.Integer,default=0)

  # Relational data
  facility_type = db.relationship('FacilityType')
  generators = db.relationship('Generator')
  company = db.relationship('Company')
  game = db.relationship('Game')
  modifications = db.relationship('FacilityModification')


  # Methods

  # Allows you to access object properties as an associative array ex: generator['state']
  def __getitem__(self, key):
    return getattr(self, key)
  
  # Allows you to assign values to object properties as an associative array ex: generator['state'] = "new"
  def __setitem__(self, key, value):
    setattr(self, key, value)

  def __repr__(self):
    return (
      f"Facility -\n"
      f"\tId: {self.id}\n"
      f"\tGame Id: {self.id_game}\n"
      f"\tCompany Id: {self.id_company}\n"
      f"\tState: {self.state}\n"
      f"\tType Id: {self.id_type}\n"
      f"\tType: {self.facility_type}\n"
      f"\tGenerators: {self.generators}\n\n"
    )

#########################################################################################
# Generator Model
class Generator(db.Model):
  id = db.Column(db.Integer, primary_key=True)

  # Foreign key
  id_type = db.Column(db.Integer, db.ForeignKey('generator_type.id'), nullable=False)
  id_facility = db.Column(db.Integer, db.ForeignKey('facility.id'), nullable=False)
  id_game = db.Column(db.Integer, db.ForeignKey('game.id'), nullable=False)

  # Data
  state = db.Column(db.Enum("new", "building", "paused", "available", "unavailable", "decommissioning", "decommissioned"), default="new")
  state_note = db.Column(db.String(30))
  duty_cycles = db.Column(db.Float, default=0)
  condition = db.Column(db.Float, default=1.0)
  build_turn = db.Column(db.Integer, default=0)
  prod_turn = db.Column(db.Integer, default=0)
  decom_turn = db.Column(db.Integer, default=0)
  start_build_date = db.Column(db.Integer, default=0)
  start_prod_date = db.Column(db.Integer, default=0)
  end_prod_date = db.Column(db.Integer, default=0)
  local_bid_policy = db.Column(db.Enum("Company Wide", "MC", "LCOE", "Fixed"), default="Company Wide")
  local_maintenance_policy = db.Column(db.Enum("Company Wide", "Routine", "Proactive", "Reactive"), default="Company Wide")
  bid_policy_value = db.Column(db.Float, default=0)
  om_cost = db.Column(db.Float, default=0)
  revenue = db.Column(db.Float, default=0)
  extension = db.Column(db.Float, default=0)
  
  
  # Relational Data
  generator_type = db.relationship('GeneratorType')
  facility = db.relationship('Facility')
  modifications = db.relationship('GeneratorModification')

  # Methods

  # Allows you to access object properties as an associative array ex: generator['state']
  def __getitem__(self, key):
    return getattr(self, key)
  
  # Allows you to assign values to object properties as an associative array ex: generator['state'] = "new"
  def __setitem__(self, key, value):
    setattr(self, key, value)

  def __repr__(self):
    return (
      f"Generator -\n"
      f"\tId: {self.id}\n"
      f"\tGame Id: {self.id_game}\n"
      f"\tState: {self.state}\n"
      f"\tFacility Id: {self.id_facility}\n"
      f"\tFacility: {self.facility}\n"
      f"\tType Id: {self.id_type}\n"
      f"\tType: {self.generator_type}\n"
    )

#########################################################################################
# GeneratorModification Model
class GeneratorModification(db.Model):
  id = db.Column(db.Integer, primary_key=True)

  # Foreign keys
  id_type = db.Column(db.Integer, db.ForeignKey('generator_modification_type.id'), nullable=False)
  id_generator = db.Column(db.Integer, db.ForeignKey('generator.id'), nullable=False)
  id_game = db.Column(db.Integer, db.ForeignKey('game.id'), nullable=False)

  # Data
  complete = db.Column(db.Boolean, default=False)

  # Relational Data
  modification_type = db.relationship('GeneratorModificationType')
  generators = db.relationship('Generator')

# Allows you to access object properties as an associative array ex: generator['state']
  def __getitem__(self, key):
    return getattr(self, key)
  
  # Allows you to assign values to object properties as an associative array ex: generator['state'] = "new"
  def __setitem__(self, key, value):
    setattr(self, key, value)

  def __repr__(self):
    return (
      f"GeneratorModification -\n"
      f"\tId: {self.id}\n"
      f"\tType Id: {self.id_type}\n"
      f"\tGenerator Id: {self.id_generator}\n"
      f"\tGame Id: {self.id_game}\n"
      f"\tComplete: {self.complete}\n"
      f"\tMofication Type: {self.generator_modification_type}\n"
      f"\tGenerators: {self.generators}\n"
    )  

#########################################################################################
# FacilityModification Model
class FacilityModification(db.Model):
  id = db.Column(db.Integer, primary_key=True)

  # Foreign keys
  id_type = db.Column(db.Integer, db.ForeignKey('facility_modification_type.id'), nullable=False)
  id_facility = db.Column(db.Integer, db.ForeignKey('facility.id'), nullable=False)
  id_game = db.Column(db.Integer, db.ForeignKey('game.id'), nullable=False)

  # Data
  complete = db.Column(db.Boolean, default=False)

  # Relational Data
  modification_type = db.relationship('FacilityModificationType')
  facilities = db.relationship('Facility')

# Allows you to access object properties as an associative array ex: generator['state']
  def __getitem__(self, key):
    return getattr(self, key)
  
  # Allows you to assign values to object properties as an associative array ex: generator['state'] = "new"
  def __setitem__(self, key, value):
    setattr(self, key, value)

  def __repr__(self):
    return (
      f"FacilityModification -\n"
      f"\tId: {self.id}\n"
      f"\tType Id: {self.id_type}\n"
      f"\tfacility Id: {self.id_facility}\n"
      f"\tGame Id: {self.id_game}\n"
      f"\tComplete: {self.complete}\n"
      f"\tMofication Type: {self.facility_modification_type}\n"
      f"\tFacilitys: {self.facilitys}\n"
    )      



#########################################################################################
# City Model
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


# Events Models...
#########################################################################################
# Prompt Model
class Prompt(db.Model):
  id = db.Column(db.Integer, primary_key=True)

  # Foreign keys
  id_type = db.Column(db.Integer, db.ForeignKey('prompt_type.id'), nullable=False)
  id_company = db.Column(db.Integer, db.ForeignKey('company.id'), nullable=False)
  id_game = db.Column(db.Integer, db.ForeignKey('game.id'), nullable=False)  

  # Data
  read = db.Column(db.Boolean, default=False)
  resolved = db.Column(db.Boolean, default=False)
  response = db.Column(db.Integer)
  description = db.Column(db.String(300))
  start = db.Column(db.Integer)
  end = db.Column(db.Integer)

  # Relational Data
  prompt_type = db.relationship('PromptType')
  companies = db.relationship( 'Company')

#########################################################################################
# PromptType Model
class PromptType(db.Model):
  id = db.Column(db.Integer, primary_key=True)

  # Foreign keys

  # Data
  title = db.Column(db.String(50))
  image = db.Column(db.String(20), nullable=False, default='default.png')

  # Relational Data
 


###############################################################################################
# Facility Type Model
class FacilityType(db.Model):
  id = db.Column(db.Integer, primary_key=True)

  # Data
  maintype = db.Column(db.String(15), nullable=False)
  subtype = db.Column(db.String(10))
  name = db.Column(db.String(25))
  build_time = db.Column(db.Integer)
  lifespan = db.Column(db.Integer)
  maximum_capacity = db.Column(db.Integer)
  maximum_generators = db.Column(db.Integer)
  decom_time = db.Column(db.Integer)
  minimum_area = db.Column(db.Float)
  fixed_cost_build = db.Column(db.Float)
  fixed_cost_operate = db.Column(db.Float)
  marginal_cost_build = db.Column(db.Float)
  marginal_cost_operate = db.Column(db.Float, default=0)
  decomission_cost = db.Column(db.Float)
  description = db.Column(db.Text)

  # Relational Data
  modification_types = db.relationship('FacilityModificationType')

###############################################################################################
# Generator Type Model
class GeneratorType(db.Model):
  id = db.Column(db.Integer, primary_key=True)

  # Foreign keys
  id_facility_type = db.Column(db.Integer, db.ForeignKey('facility_type.id'), nullable=False)
  id_power_type = db.Column(db.Integer, db.ForeignKey('power_type.id'), nullable=False)
  id_resource_type = db.Column(db.Integer, db.ForeignKey('resource_type.id'), nullable=False)
  
  # Data
  nameplate_capacity = db.Column(db.Integer, nullable=False) 
  build_time = db.Column(db.Integer)
  decom_time = db.Column(db.Integer)
  heat_rate = db.Column(db.Float)
  continuous = db.Column(db.Boolean, default=True)
  lifespan = db.Column(db.Integer)
  fixed_cost_build = db.Column(db.Float)
  fixed_cost_operate = db.Column(db.Float)
  variable_cost_operate = db.Column(db.Float)  
  decomission_cost = db.Column(db.Float)     

  # Relational Data
  facility_type = db.relationship('FacilityType')
  power_type = db.relationship('PowerType')
  resource_type = db.relationship('ResourceType')
  modification_types = db.relationship('GeneratorModificationType')

  # Methods
  def __repr__(self):
    return ( 
      f"GeneratorType -->\n" +
      f"ID: {self.id}\n" +
      f"Facility Type Id: {self.id_facility_type}\n" +
      f"Power Type Id: {self.id_power_type}\n" +
      f"Power Type : {self.power_type.name}\n" +
      f"Resource Type: {self.id_resource_type}\n" +
      f"Lifespan: {self.lifespan}"
    )


###############################################################################################
# Facility Modification Type Model
class FacilityModificationType(db.Model):
  id = db.Column(db.Integer, primary_key=True)

# Foreign keys
  id_facility_type = db.Column(db.Integer, db.ForeignKey('facility_type.id'), nullable=False)

  # Data
  marginal_area = db.Column(db.Float)
  marginal_cost_build = db.Column(db.Float)
  marginal_cost_operate = db.Column(db.Float)
  name = db.Column(db.String(64))
  description = db.Column(db.String(256))
  value = db.Column(db.Float)

  # Relational Data
  facility_type = db.relationship('FacilityType')

  # Methods
  def __repr__(self):
    return ( 
      f"FacilityModificationType -->\n"
      f"ID: {self.id}\n"
      f"Name: {self.name}\n"
      f"Value: {self.value}\n"
      f"Facility Type Id: {self.id_facility_type}\n"
      f"Facility Type: {self.facility_type}\n" 
    )

###############################################################################################
# Generator Modification Type Model
class GeneratorModificationType(db.Model):
  id = db.Column(db.Integer, primary_key=True)

# Foreign keys
  id_generator_type = db.Column(db.Integer, db.ForeignKey('generator_type.id'), nullable=False)

  # Data
  marginal_area = db.Column(db.Float)
  marginal_cost_build = db.Column(db.Float)
  marginal_cost_operate = db.Column(db.Float)
  name = db.Column(db.String(64))
  description = db.Column(db.String(256))
  value = db.Column(db.Float)

  # Relational Data
  generator_type = db.relationship('GeneratorType')

  # Methods
  def __repr__(self):
    return ( 
      f"GeneratorModificationType -->\n"
      f"ID: {self.id}\n"
      f"Name: {self.name}\n"
      f"Value: {self.value}\n"
      f"Generator Type Id: {self.id_facility_type}\n"
      f"Genrerator Type: {self.facility_type}\n" 
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

# Schema for FacilityModification
class FacilityModificationSchema(ma.ModelSchema):
  class Meta:
    model = FacilityModification    

# Schema for GeneratorModification
class GeneratorModificationSchema(ma.ModelSchema):
  class Meta:
    model = GeneratorModification    

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

# Schema for FacilityModificationType
class FacilityModificationTypeSchema(ma.ModelSchema):
  class Meta:
    model = FacilityModificationType   

# Schema for GeneratorModificationType
class GeneratorModificationTypeSchema(ma.ModelSchema):
  class Meta:
    model = GeneratorModificationType   

# Schema for PowerType
class PowerTypeSchema(ma.ModelSchema):
  class Meta:
    model = PowerType

# Schema for ResourceType
class ResourceTypeSchema(ma.ModelSchema):
  class Meta:
    model = ResourceType






#!/usr/bin/python3

import json
import time
from flask import Blueprint, render_template, url_for, flash, redirect, request, current_app
from flask_login import current_user, login_required
from flask_socketio import send, emit, join_room
from app import db, sio
from app.models import User, Game, Company, Facility, Generator, City, FacilityType, GeneratorType, PowerType
from app.models import FacilitySchema, GeneratorSchema, CompanySchema
from app.game.sio_outgoing import shout_company_joined_game, shout_player_state, shout_game_state, shout_players_message, shout_ready_to_run_turn
from app.game.sio_outgoing import shout_run_game_turn, shout_player_cancel_run_turn
from app.game.run_turn import run_turn

gamesio = Blueprint('gamesio', __name__) 

# ###############################################################################  
#
# ###############################################################################
@sio.on('connect')
def on_connect():
  print("+"*80)
  print(f"connecting...")
  print("+"*80)
  return 
 
# ###############################################################################  
#
# ###############################################################################
@sio.on('disconnect')
def on_disconnect():
  print("-"*80)
  print(f"disconnecting...")
  print("-"*80)
  return

# ###############################################################################  
#
# ###############################################################################
@sio.on('join_gameroom')
def on_join_gameroom(data):
  data = json.loads(data)
  company = Company.query.filter_by(id_user=current_user.id, id_game=data['gameId']).first()
  company_serialized = CompanySchema().dump(company).data
  join_room("game" + str(data['gameId']))

  if not company.joined_game:
    company.joined_game = True
    db.session.commit()
    shout_players_message( 
      data['gameId'], 
      "Welcome to Energize! A power grid simulator.",
      [company.player_number]
    )
    shout_company_joined_game(data['gameId'], company_serialized)

  return

# ###############################################################################  
#
# ###############################################################################    
@sio.on('get_game_state') 
def on_get_game_state(data):
  data = json.loads(data)
  game = Game.query.filter_by(id=data['gameId']).first()
  company = Company.query.filter_by(id_user=current_user.id, id_game=data['gameId']).first()
  shout_game_state(game.id, game.state, [company.player_number])
  return

# ###############################################################################  
#
# ###############################################################################    
@sio.on('get_player_state') 
def on_get_player_state(data):
  data = json.loads(data)
  company = Company.query.filter_by(id_user=current_user.id, id_game=data['gameId']).first()
  shout_player_state(company.id_game, company.state, [company.player_number])
  return

# ###############################################################################  
#
# ###############################################################################  
@sio.on('player_next_turn_button')
def on_player_next_turn(data):
  data = json.loads(data)
  game = Game.query.filter_by(id=data['gameId']).first()
  company = Company.query.filter_by(id_user=current_user.id, id_game=data['gameId']).first()
  
  if game.state == "runturn" :
    shout_players_message(
        game.id, 
        "The next turn is currently running.",  
        [company.player_number]
    )
    return 

  if company.state != "waiting":
    msg = f"Company, {company.name}, is ready for the next turn."
    company.state = "waiting"
    shout_players_message(
      game.id, 
      msg
    )    
  else:
    msg = f"Company, {company.name}, is NOT ready for the next turn."
    company.state = "view"
    shout_players_message(
      game.id, 
      msg
    )    

  db.session.commit()
 
  shout_player_state(game.id, company.state, [company.player_number])
  companies_not_waiting = Company.query.filter(Company.id_game == game.id, Company.state != "waiting", Company.player_type == "human").all()

  if len(companies_not_waiting) == 0:
    shout_ready_to_run_turn(game.id)
  else:
    msg = "The following companies are NOT ready for the next turn: " + ", ".join([company.name for company in companies_not_waiting])
    shout_players_message(
        game.id, 
        msg
    )    
    
  return

# ###############################################################################  
#
# ###############################################################################  
@sio.on('player_is_ready')
def on_player_is_ready(data):
  data = json.loads(data)
  game = Game.query.filter_by(id=data['gameId']).first()
  company = Company.query.filter_by(id_user=current_user.id, id_game=data['gameId']).first()
  company.state = "ready"
  db.session.commit()

  companies_not_ready = Company.query.filter(Company.id_game == game.id, Company.state != "ready", Company.player_type == "human").all()

  if len(companies_not_ready) == 0:
    game.state = "runturn"
    db.session.commit()
    shout_game_state(game.id, game.state)
    shout_player_state(game.id, "ready", players=[1,2,3,4,5])

    msg = "Running the next turn!"
    shout_players_message(
      game.id, 
      msg
    )    

    shout_run_game_turn(game.id)
    run_turn(game)

  return 

# ###############################################################################  
#
# ###############################################################################  
@sio.on('force_run_turn') 
def force_run_turn(data):
  data = json.loads(data)
  game = Game.query.filter_by(id=data['gameId']).first()

  game.state="runturn"
  Company.query.filter_by(id_game=game.id).update(dict(state="ready"))

  db.session.commit()
  shout_game_state(game.id, game.state)
  shout_player_state(game.id, "ready", players=[1,2,3,4,5])

  msg = "Running the next turn!"
  shout_players_message(
    game.id, 
    msg
  )    

  shout_run_game_turn(game.id)
  run_turn(game)

  return

# ###############################################################################  
#
# ###############################################################################  
# @sio.on('get_running_turn_dialog')
# def on_get_running_turn_dialog(data):
#   data = json.loads(data)
#   game = game = Game.query.filter_by(id=data['gameId']).first()

#   return render_template("runningturn.html")

# ###############################################################################  
#
# ###############################################################################  
@sio.on('get_ready_turn_dialog')
def on_get_ready_turn_dialog(data):
  data = json.loads(data)
  game = game = Game.query.filter_by(id=data['gameId']).first()

  return render_template("readyturn.html")
# ###############################################################################  
#
# ###############################################################################  
@sio.on('cancel_run_turn')
def on_cancel_run_turn(data):
  data = json.loads(data)
  game = Game.query.filter_by(id=data['gameId']).first()
  company = Company.query.filter_by(id_user=current_user.id, id_game=data['gameId']).first()
  
  companies_updated = Company.query.filter_by(id_game=data['gameId']).update(dict(state='waiting'))
  company.state = "view"

  db.session.commit()
  companies = Company.query.filter_by(id_game=data['gameId']).all()
    
  for c in companies:
    shout_player_state(game.id, c.state, [c.player_number])
  
  shout_player_cancel_run_turn(game.id)
  msg = f"Company, {company.name}, is NOT ready for the next turn."
  shout_players_message(
    game.id, 
    msg
  )  

  return

# ###############################################################################  
#
# ###############################################################################  
@sio.on('player_build_facility_button')
def on_player_build_facility_button(data): 
  data = json.loads(data)
  game = Game.query.filter_by(id=data['gameId']).first()
  company = Company.query.filter_by(id_user=current_user.id, id_game=data['gameId']).first()

  if game.state not in ["initializing", "runturn", "waiting", "finished"]:
    if company.state in ["view"]:
      company.state = "build"
      shout_player_state(game.id, company.state, [company.player_number])
    elif company.state in ["build"]:
      company.state = "view"
      shout_player_state(game.id, company.state, [company.player_number])
    elif company.state in ["waiting", "ready"]:
      shout_players_message(
        game.id, 
        "You can't toggle the build facility button while you are waiting for the next turn to run.",  
        [company.player_number]
      )
  else:
    shout_players_message( 
      game.id, 
      "You can't toggle the build facility button during this phase of the game.",
      [company.player_number]
    )

  db.session.commit()  
  return

# ###############################################################################  
#
# ###############################################################################  
@sio.on('get_company')
def on_get_company(data):
  data = json.loads(data)
  game = Game.query.filter_by(id=data['gameId']).first()
  company = Company.query.filter_by(id_user=current_user.id, id_game=data['gameId']).first()
  company_serialized = CompanySchema().dump(company).data

  return {'company': company_serialized}


# ###############################################################################  
#
# ###############################################################################  
# @sio.on('get_turn_button')
# def on_get_turn_button(data):
#   data = json.loads(data)
#   game = Game.query.filter_by(id=data['gameId']).first()
#   company = Company.query.filter_by(id_user=current_user.id, id_game=data['gameId']).first()

#   return render_template("nextturnbutton.jinja", company=company, game=game)

# ###############################################################################  
#
# ###############################################################################
@sio.on('new_facility')
def on_new_facility(data):
  data = json.loads(data)
  print("new_facility" + "+"*80)
  print(f"data = {data}")



  # company = Company.query.filter_by(id_user=current_user.id, id_game=data['gid']).first()
  # facility = Facility(
  #   id_type=9, 
  #   id_game=data['gid'], 
  #   id_company=company.id, 
  #   player_number=company.player_number,
  #   row=data['row'], 
  #   column=data['column']
  # )
  # db.session.add(facility)
  # db.session.commit()
  # facility_schema = FacilitySchema()
  # facility_serialized = facility_schema.dump(facility).data
  # emit('playing', facility_serialized, namespace='/game'+ str(data['gid']))

  return (facility_serialized)

# ###############################################################################  
#
# ###############################################################################
@sio.on('update_facility')
def on_update_facility(data):
  data = json.loads(data)
  print("update_facility" + "+"*80)
  print(f"data = {data}")

  bad_key_fields = ['id', 'id_company', 'id_game']

  # print(f"*"*80)
  # print(f"facility = {facility_updates}")

  # facility = Facility.query.filter_by(id=fid, id_game=gid).first()
  # facility_update_keys = list(facility_updates.keys())

  # for fu_key in facility_update_keys:
  #   if fu_key not in bad_key_fields:
  #     facility[fu_key] = facility_updates[fu_key]

  # db.session.commit()

  # facility_schema = FacilitySchema()
  # facility_serialized = facility_schema.dump(facility).data

  return jsonify({
    'facility': facility_serialized
  })

# ###############################################################################  
#
# ###############################################################################
@sio.on('delete_facility')
def on_delete_facility(data):
  pass 





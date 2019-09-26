from flask_socketio import send, emit, join_room
from app import db, sio



# ###############################################################################  
#  Game turn events
# ###############################################################################
def shout_game_turn_start():
  None

def shout_game_turn_interval(gid, interval, players=[1,2,3,4,5]):
  None

def shout_game_turn_complete(gid):
  emit_message(gid, 'game_turn_complete')

def shout_new_facility(gid, facility):
  emit_message(gid, 'new_facility', {'facility': facility})

def shout_update_facility(gid, facility):
  emit_message(gid, 'update_facility', {'facility': facility})

def shout_delete_facility(gid, facility):
  emit_message(gid, 'delete_facility', {'facility': facility})

def shout_company_joined_game(gid, company):
  emit_message(gid, 'company_joined_game', {'company': company})

def shout_player_state(gid, company_state, players=[1,2,3,4,5]):
  emit_message(gid, 'player_state_update', {'state': company_state}, players)

def shout_game_state(gid, game_state, players=[1,2,3,4,5]):
  emit_message(gid, 'game_state_update', {'state': game_state}, players)

def shout_ready_to_run_turn(gid):
  emit_message(gid, 'ready_to_run_turn')

def shout_run_game_turn(gid):
  emit_message(gid, 'run_game_turn')

def shout_player_cancel_run_turn(gid, players=[1,2,3,4,5]):
  emit_message(gid, 'player_cancel_run_turn', {}, players)

def shout_players_message(gid, msg, players=[1,2,3,4,5]):
  emit_message(gid, 'players_message', {'msg': msg}, players)



# ###############################################################################
def emit_message(gid, msg, data = {}, players = [1,2,3,4,5]):
  data['emit_msg'] = msg
  data['socketio_players'] = players
  sio.emit(msg, data, room='game' + str(gid))












from flask_socketio import send, emit, join_room
from app import db, sio

# ###############################################################################  
#  Game turn events
# ###############################################################################
def game_turn_start():
  None

def game_turn_interval(gid, interval):
  None

def game_turn_complete(gid):
  sio.emit('game_turn_complete', {'msg': 'Game Turn is Complete'}, room='game' + str(gid))

def shout_new_facility(gid, facility):
  sio.emit('new_facility', {'facility': facility}, room='game' + str(gid))

def shout_update_facility(gid, facility):
  sio.emit('update_facility', {'facility': facility}, room='game' + str(gid))

def shout_delete_facility(gid, facility):
  sio.emit('delete_facility', {'facility': facility}, room='game' + str(gid))




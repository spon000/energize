from flask_socketio import send, emit, join_room
from app import db, sio

# ###############################################################################  
#  Game turn events
# ###############################################################################
def game_turn_interval(gid, interval):
  None

def game_turn_complete(game):
  sio.emit('game_turn_complete', {'msg': 'Game Turn is Complete'}, room='game' + str(game.id))

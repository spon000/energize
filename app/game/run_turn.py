from app import db, bcrypt
from app.models import Game, Company, Facility, Generator, City, User
from app.models import FacilityType, GeneratorType, PowerType, ResourceType
from app.game.modifiers import load_modifiers
from app.game.turn import initialize_turn
from app.game.turn import calculate_turn
from app.game.turn import finalize_turn
from app.game.sio_outgoing import shout_game_turn_complete


##############################################################################
def run_turn(game):  
  

  modifiers = load_modifiers(game)
  initialize_turn(game, modifiers)
  state = calculate_turn(game, modifiers)
  finalize_turn(game, modifiers, state)
  # history = calculate_quarter(game, db, mods, state)

  shout_game_turn_complete(game.id)
  
  # return redirect(url_for('game.loadgame' , gid=gid))






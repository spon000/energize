from app import db, bcrypt
from app.models import Game, Company, Facility, Generator, City, User
from app.models import FacilityType, GeneratorType, PowerType, ResourceType
from app.game.modifiers import load_modifiers
from app.game.turn import initialize_turn
from app.game.turn import calculate_turn
from app.game.turn import finalize_turn


##############################################################################
def run_turn():  
  
  modifiers = load_modifiers(game)
  initialize_turn(game, modifiers)
  state = calculate_turn(game, modifiers)
  finalize_turn(game, modifiers, state)
  # game_turn_complete(gid)
  history = calculate_quarter(game,db,mods,state)
  
  return redirect(url_for('game.loadgame' , gid=gid))






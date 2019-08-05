import sys

from app.initialize import initialize_db
from app import create_app
from app import db, bcrypt
from app.config import Config
from app.game.init_game import init_game_models
from app.models import Game, Company, Facility, Generator, Modification, City, User, Prompt
from app.game.turn import initialize_turn
from app.game.turn import calculate_turn
from app.game.turn import finalize_turn
from app.game.modifiers import init_modifiers, load_modifiers
from waitress import serve


# create_game function.
def create_game(name):
  game = Game(name=name)
  db.session.add(game)
  db.session.commit()

  return game

app = create_app()  

ctx = app.app_context()
ctx.push()

if __name__ == "__main__":
  if len(sys.argv) > 1:
    if sys.argv[1] == 'init':
      initialize_db(app)
      print("="*80)
      print(f"database initialized")
      print("="*80)
      
  # app.run(host='0.0.0.0', debug=True, threaded=True)
  # debug=true allows automatic server refresh so you don't have to restart the server manually.
  # host=0.0.0.0 will allow the site access to outside the local machine.
  # app.run(host='0.0.0.0')

  print("\n" + "="*80)
  print(f"creating game instance.")
  print("="*80)
  game = create_game("run turn")
  init_game_models(game)
  cities = City.query.all()

  # either init_modifiers or load_modifiers if the modifiers exists. Don't run them together
  print("\n" + "="*80)
  print(f"loading modifiers.")
  print("="*80)
  modifiers = init_modifiers(game, cities)
  # modifiers = load_modifiers(game)
  
  print("\n" + "="*80)
  print(f"initialize turn.")
  print("="*80)
  initialize_turn(game, modifiers)

  print("\n" + "="*80)
  print(f"calculating turn.")
  print("="*80)
  state = calculate_turn(game, modifiers)

  print("\n" + "="*80)
  print(f"finalizing turn.")
  print("="*80)
  finalize_turn(game, modifiers, state)

ctx.push()    
  




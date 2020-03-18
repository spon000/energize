import sys, argparse
import time
import logging

from runhost import runhost
from app.initialize import initialize_db
from app.config import Config
from app import create_app
from app.models import Game, User #, Company, Facility, Generator, Modification, City, User, Prompt
from app import db #, bcrypt
from app.game.init_game import init_game

# Setup logging parms
format = "%(asctime)s: %(filename)s: %(lineno)d: %(message)s"
logging.basicConfig(format=format, level=logging.INFO, datefmt="%H:%M:%S")

# Define default name of a game.
game_name_default = "Game #"

ap = argparse.ArgumentParser()
ap.add_argument("-i", "--init", default=False, action='store_true',
  help="Initialize the database.")
ap.add_argument("-u", "--dburi", default="sqlite:///", action='store',
  help="specify database URI.")
ap.add_argument("-s", "--dbsecret", default="1234567890", action='store',
  help="specify database secret key")
ap.add_argument("-d", "--dbname", default="games.db", 
  help="Default db filename is 'game.db'")
ap.add_argument("-n", "--newgame", const=game_name_default, default="", action='store', nargs='?',   help="Create a new game")
ap.add_argument("-g", "--gameid", default=0, action='store',
  help="Specify which game id with which you want to interact. '0' is the default and specifies the latest game created.")
ap.add_argument("-r", "--runturn", default=0, action='store', 
  help="Run a number of turns. Default is 0.")
ap.add_argument("-x", "--exechost", default=False, action='store_true', 
  help="start debug server after all actions have been completed.")


args = vars(ap.parse_args())
logging.info(f" Command line parms: \n \
  init: {args['init']}\n \
  dburi: {args['dburi']}\n \
  dbname: {args['dbname']}\n \
  dbsecret: {args['dbsecret']}\n \
  newgame: {args['newgame']}\n \
  gameid: {args['gameid']}\n \
  runturn: {args['runturn']}\n \
  exechost: {args['exechost']}\n \
")

# create_game function.
# def create_game(name):
#   game = Game(name=name)
#   db.session.add(game)
#   db.session.commit()

#   return game


# Modify Config parms.
Config.SQLALCHEMY_DATABASE_URI = args['dburi'] + args['dbname']
Config.SECRET_KEY = args['dbsecret']

logging.info(f"creating app...")
app = create_app()  

logging.info(f"getting context...")
ctx = app.app_context()
ctx.push()

def utils():
  if args['init'] == True:
    logging.info(f"initializing database:  {args['dburi'] + args['dbname']}")
    initialize_db(app, args)
    logging.info(f"database initialized")

  if args['newgame'] != "":
    logging.info(f"creating new game...")
    new_game_number = Game.query.count() + 1
    game_name_tally = ""

    if (args['newgame'] == game_name_default):
      game_name_tally = str(new_game_number)

    game = Game(name=args['newgame'] + game_name_tally)
    db.session.add(game)
    db.session.commit()

    logging.info(f"Populating game tables for {game.name}.")

    if init_game(game) == True:
      logging.info(f"Populating game tables was successful for {game.name}")
    else:
      logging.info(f"There were problems populating game tables for {game.name}")


# main function call
if __name__ == "__main__":
  User.query.update(dict(state='unknown'))
  db.session.commit()
  
  if args['exechost'] == True:
    logging.info(f"Starting up debug server")
    runhost()
  else:
    utils()
  

# Push context back onto stack
# ctx.push() 
  


#   print("\n" + "="*80)
#   print(f"creating game instance.")
#   print("="*80)
#   game = create_game("run turn")
#   init_game_models(game)
#   cities = City.query.all()

#   # either init_modifiers or load_modifiers if the modifiers exists. Don't run them together
#   print("\n" + "="*80)
#   print(f"loading modifiers.")
#   print("="*80)
#   modifiers = init_modifiers(game, cities)
#   # modifiers = load_modifiers(game)
  
#   print("\n" + "="*80)
#   print(f"initialize turn.")
#   print("="*80)
#   initialize_turn(game, modifiers)

#   print("\n" + "="*80)
#   print(f"calculating turn.")
#   print("="*80)
#   state = calculate_turn(game, modifiers)

#   print("\n" + "="*80)
#   print(f"finalizing turn.")
#   print("="*80)
#   finalize_turn(game, modifiers, state)


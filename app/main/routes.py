import random, json
import time
import logging

from flask import Blueprint, render_template, url_for, flash, redirect, request, current_app
from flask_login import current_user, login_required
from app import db 
from app.models import User, Game, Company
from app.main.forms import CreateGameForm, JoinGameForm, RejoinGameForm
# from app.main.utils import get_random_player

# Setup logging parms
format = "%(asctime)s: %(filename)s: %(lineno)d: %(message)s"
logging.basicConfig(format=format, level=logging.INFO, datefmt="%H:%M:%S")

main = Blueprint('main', __name__)

################################################################################  
#
# ##############################################################################
@main.route("/")
@main.route("/home")
def home():
  return render_template("title.html")

################################################################################  
#
# ##############################################################################
@main.route("/creategame", methods=["GET", "POST"])
@login_required
def creategame():
  form = CreateGameForm()
  
  # ************ After submission *************
  if form.validate_on_submit():
    if current_user.state == "joining":
      flash(f'You are already joining a game. please wait for game to finish initializing','warning')
      return render_template("title.html")
    else: 
      current_user.state = "joining"      

    # Check to see if user has 5 companies currently playing the game. Don't count games that are finished.  
    # This needs to be fixed to not include finished games in the query.
    num_playing_companies = Company.query.filter(Company.id_user == current_user.id).count()
    
    if num_playing_companies < current_user.companies_max:
      game = Game(name=form.gamename.data)
      db.session.add(game)
      db.session.commit()
      return redirect(url_for('game.initgame', gid=game.id, name=form.companyname.data))
    else:
      flash(f'You are already playing too many concurrent games. Try rejoining one in progress','danger')
      return render_template("title.html")

  return render_template("creategame.html", form=form)

################################################################################  
#
# ##############################################################################
@main.route("/joingame", methods=["GET", "POST"])
@login_required
def joingame():
  form = JoinGameForm()
  games = Game.query.filter(Game.state != "finished").all()
  available_games = list()

  # Get a list of all available games player can join.
  if games:
    for game in games:
      available_companies = Company.query.filter(game.id == Company.id_game, Company.player_type == "ai").count()
      user_company = Company.query.filter(game.id == Company.id_game, Company.id_user == current_user.id).first()

      if not user_company and available_companies > 0:
        available_games.append(game)

  if available_games:
    form.availablegames.choices = [(ag.id, ag.name) for ag in available_games]
  else:
    flash(f'There are no games available. Try creating a game', 'danger')
    return render_template("title.html")

  # ************ After submission *************
  if form.validate_on_submit():
    game_id = form.availablegames.data
    num_user_companies = Company.query.filter_by(id_user=current_user.id).count()

    if num_user_companies < current_user.companies_max:
      joining_game = Game.query.filter_by(id=game_id).first()
      game_companies = Company.query.filter(Company.id_game == game_id, Company.id_user != 1)

      if game_companies.count() < joining_game.companies_max:
        return redirect(url_for('game.joingame', gid=game.id, name=form.companyname.data))
      else:
        flash(f'This game is full. Choose another game to join or create one.', 'danger')
        return render_template("joingame.html", form=form)

    else:
      flash(f'You are already playing multiple games. Try rejoining one in progress','danger')
      return render_template("title.html")

  return render_template("joingame.html", form=form)

################################################################################  
#
# ##############################################################################
@main.route("/rejoingame", methods=["GET", "POST"])
@login_required
def rejoingame():
  form = RejoinGameForm()

  available_companies = Company.query.filter(Company.id_user == current_user.id, Company.state != "new").all()
  available_games = [(str(c.id_game), Game.query.filter_by(id=c.id_game).first().name, c.name) for c in available_companies]

  if available_games:
    form.jg.choices = [(ag[0], ag[1]) for ag in available_games]
    cn = dict([ag[0], ag[2]] for ag in available_games)
    form.cn.render_kw = {'disabled': 'disabled', 'cn': cn}
  else:
    flash(f'You aren\'t currently playing any games.', 'danger')
    return render_template("title.html")
  
  # print("*" * 80)
  # print(f"games choices = {form.jg.choices}")
  # print(f"company names = {cn}")


  # ************ After submission *************
  if form.is_submitted():
  # if form.validate_on_submit():
    # print("*" * 60)
    # print(f"valid submission {form.jg.data}")
    return redirect(url_for('game.loadgame', gid=form.jg.data))
  # else:
  #   print("-" * 80) 
  #   print(f"jg.data = {form.jg.data}")
  #   print(f"cn.data = {form.cn.data}")
  #   print(f"errors = {form.jg.errors}")

  
  # # # print(available_companies)
  return render_template("rejoingame.html", form=form, cn=cn)
  
  























  # form = RejoinGameForm()

  # available_companies = Company.query.filter(Company.id_user == current_user.id, Company.state != "new").all()
  # available_games = [(str(c.id_game), Game.query.filter_by(id=c.id_game).first().name, c.name) for c in available_companies]

  # if available_games:
  #   form.jg.choices = [(ag[0], ag[1]) for ag in available_games]
  #   cn = dict([ag[0], ag[2]] for ag in available_games)
  #   form.cn.render_kw = {'disabled': 'disabled', 'cn': cn}
  # else:
  #   flash(f'You aren\'t currently playing any games.', 'danger')
  #   return render_template("title.html")


  # # print("*" * 60)
  # # print(f"{available_games}")
  
  # # company = Company.query.filter_by(id=current_user.current_company).first()
  # # game = Game.query.filter_by(id=company.id_game).first()

  # # form.jg.choices = [(ag[0], ag[1]) for ag in available_games]
  # # form.cn.data = ""  #[(ag[0], ag[2]) for ag in available_games]
  # # form.joinablegames.choices = [(1,'MyGasme')]
  # # form.companynames.choices = [(1,'ACME E')]
  # # form.companynames.render_kw = {'disabled': 'disabled'}

  # print("*" * 80)
  # print(f"games choices = {form.jg.choices}")
  # print(f"company names = {cn}")
  # # print(f"company choices = {form.cn.choices}")

  # # form.availablegames.data = game.name
  # # form.companyname.data = company.name

  # # ************ After submission *************
  # if form.validate_on_submit():
  #   print("*" * 60)
  #   print(f"valid submission {form.jg.data}")
  #   return redirect(url_for('game.loadgame', gid=form.jg.data))
  # else:
  #   print("-" * 80) 
  #   print(f"jg.data = {form.jg.data}")
  #   print(f"cn.data = {form.cn.data}")
  #   print(f"errors = {form.jg.errors}")

  # # # ************ After submission *************
  # # if form.validate_on_submit():
  # #   print("*" * 60)
  # #   print(f"valid submission {form.availablegames.data}")
  # #   return redirect(url_for('game.loadgame', gid=1))
  # # #   return redirect(url_for('game.loadgame', gid=game.id))

  # # # # print(available_companies)
  # return render_template("rejoingame.html", form=form, cn=cn)
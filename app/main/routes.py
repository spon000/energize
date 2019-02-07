import random

from flask import Blueprint, render_template, url_for, flash, redirect, request, current_app
from flask_login import current_user, login_required
from app import db 
from app.models import User, Game, Company
from app.main.forms import CreateGameForm, JoinGameForm
from app.main.utils import get_random_player

main = Blueprint('main', __name__)

@main.route("/")
@main.route("/home")
def home():
  return render_template("title.html")

@main.route("/creategame", methods=["GET", "POST"])
@login_required
def creategame():
  form = CreateGameForm()
  if form.validate_on_submit():
    num_companies = Company.query.filter_by(id_user=current_user.id).count()
    if num_companies < current_user.companies_max:
      game = Game(name=form.gamename.data)
      db.session.add(game)
      db.session.commit()
      player_number = get_random_player(game)
      company = Company(name=form.companyname.data, id_game=game.id, id_user=current_user.id, player_number=player_number)
      db.session.add(company)
      db.session.commit()
      current_user.current_company = company.id
      db.session.commit()
      return redirect(url_for('game.newgame'))
      # return render_template("game.html", company=company, game=game)
    else:
      flash(f'You are already playing multiple games. Try rejoining one in progress','danger')
      return render_template("title.html")
  return render_template("creategame.html", form=form)

@main.route("/joingame", methods=["GET", "POST"])
@login_required
def joingame():
  form = JoinGameForm()
  games = Game.query.all()
  available_games = list()
  if games:
    for game in games:
      companies = Company.query.filter(game.id == Company.id_game and game.game_state == 'new').all()
      if len(companies) < game.companies_max:
        user_company = list(filter(lambda company: company.id_user == current_user.id, companies))
        if not user_company:
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
      joining_game = Game.query.filter_by(id=form.availablegames.data).first()
      game_companies = Company.query.filter_by(id_game=form.availablegames.data)
      if game_companies.count() < joining_game.companies_max:
        player_number = get_random_player(joining_game)
        company = Company(name=form.companyname.data, id_game=joining_game.id, id_user=current_user.id, player_number=player_number)
        db.session.add(company)
        db.session.commit() 
        current_user.current_company = company.id
        db.session.commit()
        return redirect(url_for('game.newgame'))
        # return render_template("game.html", company=company, game=joining_game)
      else:
        flash(f'This game is full. Choose another game to join or create one.', 'danger')
        return render_template("joingame.html", form=form)
    else:
      flash(f'You are already playing multiple games. Try rejoining one in progress','danger')
      return render_template("title.html")

  return render_template("joingame.html", form=form)




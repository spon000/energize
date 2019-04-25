from flask import Blueprint, render_template, url_for, flash, redirect, request, current_app
from flask_login import current_user, login_required
from flask_socketio import send, emit
from app import db, sio
from app.models import User, Game, Company, Facility, Generator, City, FacilityType, GeneratorType, PowerType

gamesio = Blueprint('gamesio', __name__)


@sio.on('message')
def handleMessage(msg):
  print("Message: ", msg)

@sio.on('connect')
def client_connect():
  company = Company.query.filter_by(id=current_user.current_company).first()
  emit('game_connect', {'p_num': company.player_number, 'g_num': company.id_game})
  print('Message: Client connected')

@sio.on('disconnect')
def client_disconnect():
  company = Company.query.filter_by(id=current_user.current_company).first()
  company.connected_to_game = 0

  def ack(company):
    company.connected_to_game = 1
    print("Message: ack says we\'re connected.")

  emit('test_disconnect', None, callback=ack(company))
  print('Message: Client disconnected')



# @sio.on('player_disconnect')
# def player_disconnect():
#   company = Company.query.filter_by(id=current_user.current_company).first()
#   company.connected_to_game = 0
#   db.session.commit()
  # print("Message: Player, ", company.player_number, " disconnected.")

# @sio.on('player_connect')
# def player_connect():
#   company = Company.query.filter_by(id=current_user.current_company).first()
#   company.connected_to_game = 1
#   db.session.commit()
  # print("Message: Player, ", company.player_number, " connected.")


@sio.on('player_build_facility')
def build_facility(facility):
  None

@sio.on('player_turn_button')
def player_next_turn():
  None





from flask import Blueprint, render_template, request, jsonify
from flask_login import login_required, current_user
from app import db, sio 
from app.models import User, Game, Company, Facility, Generator, City, FacilityType, GeneratorType, PowerType
from app.util_classes import RepeatedTimer

def start_gameloop(interval):
  return None

def stop_gameloop():
  return None

def gameloop_cycle():
  return None
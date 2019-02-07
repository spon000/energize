import os, random
from app.models import User, Game, Company

def get_random_player(game):
  companies = Company.query.filter_by(id_game=game.id)
  player_list = range(1,game.companies_max + 1)  
  taken_player_list = [company.player_number for company in companies]
  available_player_list = list(set(player_list) - set(taken_player_list))
  return random.choice(available_player_list)





      
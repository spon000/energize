from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField, SelectField
from wtforms.validators import DataRequired, Length, ValidationError
from app.models import User, Game


class CreateGameForm(FlaskForm):
  gamename = StringField('Game Name', 
    validators=[DataRequired(), Length(min=2, max=20)])
  companyname = StringField('Company Name',
    validators=[DataRequired(), Length(min=2, max=20)])
  submit = SubmitField('Create Game')

class JoinGameForm(FlaskForm):
  availablegames = SelectField('Available Games', choices=[], coerce=int)
  companyname = StringField('Company Name', 
    validators=[DataRequired(), Length(min=2, max=20)])
  submit = SubmitField('Join Game')  


from app import db 
from app.models import Prompt, PromptType
from app.game.utils import get_current_game_date, format_date


def assign_prompt(title, game, company, prompt_fields, description_parms):
  prompt_type = PromptType.query.filter_by(title=title).first()
  prompt_keys = prompt_fields.keys()

  if (not prompt_type):
    print("!"*80)
    print(f"Warning: no prompt types match title {title}.")
    print("!"*80)
    return None
  
  prompt = Prompt(id_type=prompt_type.id, id_game=game.id, id_company=company.id)
  prompt.date = get_current_game_date(game)
  prompt.start = 0
  prompt.end = 0

  for prompt_key in prompt_keys:
    prompt[prompt_key] = prompt_fields[prompt_key]

  prompt.date_string = format_date(prompt.date, "Y Q")
  prompt.short_description = prompt_type.short_description
  prompt.long_description = prompt_type.long_description.format(*description_parms)

  return prompt


  
  

  





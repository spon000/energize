import os
import secrets
from PIL import Image
from flask import current_app


def save_picture(form_picture):
  random_hex = secrets.token_hex(8)
  # Underscore is throw away variable
  _, f_ext = os.path.splitext(form_picture.filename)
  picture_fn = random_hex + f_ext
  picture_path = os.path.join(current_app.root_path, 'static/img/profile', picture_fn)
  output_size = (125, 125)
  img = Image.open(form_picture)
  img.thumbnail(output_size)
  img.save(picture_path)
  return picture_fn
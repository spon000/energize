#!/usr/bin/env python3

# Followed this link to instantiate Celery into our Flask app as a global
# https://blog.miguelgrinberg.com/post/celery-and-the-flask-application-factory-pattern

from app import create_app, celery
from app.config import Config

app = create_app()
app.app_context().push()


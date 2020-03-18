import sys
from app import create_app

def runhost():
  app = create_app()
  app.run(host='0.0.0.0', debug=True, threaded=True)
  # debug=true allows automatic server refresh so you don't have to restart the server manually.
  # host=0.0.0.0 will allow the site access to outside the local machine.
  # app.run(host='0.0.0.0')


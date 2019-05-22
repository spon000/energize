from app import create_app
from app.config import Config

app = create_app()

if __name__ == "__main__":
  app.run(host='0.0.0.0', debug=True, threaded=True)
  # debug=true allows automatic server refresh so you don't have to restart the server manually.
  # host=0.0.0.0 will allow the site access to outside the local machine.
  #app.run(host='0.0.0.0')

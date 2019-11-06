######################################################################################
# Installing python, pip, and virtualenv
######################################################################################

# Here are some of the steps taken to create the python environment for
# energize.

# install latest version of pip for python 3
python3 -m pip install --upgrade pip

# If using mysql the run the following commands
sudo apt-get install mysql-server
sudo apt-get install libmysqlclient-dev

# install virtual environment program
pip3 install virtualenv


######################################################################################
# Installing Nginx on Ubuntu 18.04
######################################################################################

# Enter the following:
sudo apt update

# Allow the process to finish.
# Enter the following to install Nginx on Ubuntu:
sudo apt install nginx

# This may take some time for the system to download the software packages and install. 
# Allow it to complete before moving on.
# Verify Nginx Service Is Running

#Use the following command to check the status of the Nginx service:
sudo systemctl status nginx

# The system should return a list of information about the Nginx service.
# The active line indicates whether the service is running or not. 
# If you need to start the service, use the following:
sudo systemctl start nginx

# You can also use the following commands in place of start:
sudo systemctl stop nginx
#    – stops the service
sudo systemctl enable nginx
#    – enables Nginx to load at startup
sudo systemctl disable nginx
#    – prevents Nginx from loading at startup

# Allow Nginx Traffic Through a Firewall
# You can generate a list of the firewall rules using the following command:
sudo ufw app list

# This should generate a list of application profiles. 
# On the list, you should see four entries related to Nginx:
Nginx full
#    – opens Port 80 for normal web traffic, and Port 443 for secure encrypted web traffic
Nginx HTTP
#    – Opens Port 80 for normal web traffic
Nginx HTTPS
#    – Opens Port 443 for encrypted web traffic
OpenSSH
#    – This is a configuration for SecureShell operations, which allow you to log into a remote server through a secure, encrypted connection

# To allow normal HTTP traffic to your Nginx server, 
# use the Nginx HTTP profile with the following command:
sudo ufw allow 'Nginx HTTP'

# To check the status of your firewall, use the following command:
sudo ufw status

# It should display a list of the kind of HTTP web traffic allowed 
# to different service. Nginx HTTP should be listed as ALLOW and Anywhere.

# More stuff to do like creating server blocks:
# https://phoenixnap.com/kb/install-nginx-on-ubuntu


######################################################################################
# Pull source of project from github.com and put in directory under ~/development
######################################################################################

# Move into development directory
cd ~/development

# Clone github repository. This will automatically create the project folder.
git clone https://github.com/spon000/energize.git

# Note: If the project directory exists and the source has been pulled, but you
# need to update to the latest source available then issue the git pull command
# from within the project directory.
git pull


######################################################################################
# 1) Creating virtual environment and activating it. 
# 2) Install all required python packages.
######################################################################################

# Determine where the python executable that we want to copy to our virtual environment
# is located.
which python3 
# output --> /<location of python3 executable> ex: "/usr/bin/python3"

# Create virtual environment and copy python install so that we 
# don't accidently mess with the production python.

# change into development project directory
cd ~/develop/energize
virtualenv -p /usr/bin/python3 venv

# To activate the virtual environment...
# from outside development directory:
source ~/develop/virtual_environments/energize/bin/activate

# from inside development directory:
source venv/bin/activate

# command prompt should contain the name of the virtual environment
# ex: (venv) ubuntu@ip-172-31-17-53:~$

# Once you have virtual environment activated install all required 
# python packages specified in py_reqs_dev:
pip install -r ~/develop/energize/py_reqs_dev

# If you need to add or remove a package from the venv make sure 
# to update the py_reqs aftwerwards with the following command:
pip freeze > py_reqs_dev

######################################################################################
# running the development server 
######################################################################################

# Initialize the database
python run.py init

# Start the Flask development server (under port 5000)
python run.py




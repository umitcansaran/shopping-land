# Ecommerce Platform with Django + React

Live Demo can be viewed at https://www.shopping-land.ch/

Quickly sign in with the provided credentials to check it out

* Homescreen

![DEMO](https://shoppingland.s3.eu-central-1.amazonaws.com/shopping-land_homescreen.png)

* Admin panel - stock management

![DEMO](https://shoppingland.s3.eu-central-1.amazonaws.com/shopping-land_admin-panel.png)

* Admin panel - store management

![DEMO](https://shoppingland.s3.eu-central-1.amazonaws.com/shopping-land_admin-panel2.png)

* Map 

![DEMO](https://shoppingland.s3.eu-central-1.amazonaws.com/shopping-land_map.png)

# Features

* Admin panel where sellers can add stores with specific locations and products to the corresponding store. Product stocks can be viewed and updated for each stores individually. Search function to check product availability in store based on ID, brand or name
* Interactive map where you can view all the stores and their informations. Each store redirect to the seller's page with products
* Customer profile with orders and profile informations which can be updated
* Multifunctional search and filtering options
* Full featured shopping cart
* Product reviews and ratings
* Latest products carousel
* Mark orders as paid or delivered option
* Checkout process (shipping, payment method, etc)
* PayPal / credit card integration

# Technologies

* Frontend: React with Redux
* Backend: Django REST Framework
* Database: AWS PostgreSQL
* File storage: AWS S3
* Deployment: Heroku
* Hosting: Hostpoint

# Download & Setup Instructions

* 1 - Clone project: git clone https://github.com/umitcansaran/shopping-land.ch

# Install React Modules
* 1 - cd frontend
* 2 - npm install

# Create a Virtual Environment
* 1 - pip3 install virtualenv
* 2 - virtualenv <my_env_name> 
* 3 - source <my_env_name>/bin/activate

# Install Python Packages for Django
* 1 - cd app
* 2 - pip3 install -r requirements.txt

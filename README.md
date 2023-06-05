# Ecommerce Platform with Django + React

Live Demo can be viewed at https://www.shopping-land.ch/

Quickly sign in with the provided credentials to check it out

* Homescreen

![DEMO](https://shoppingland.s3.eu-central-1.amazonaws.com/SL+images/sl+-home.png)

* Map 

![DEMO](https://shoppingland.s3.eu-central-1.amazonaws.com/SL+images/sl_store-map.png) 

* Admin panel - product & stock management

![DEMO](https://shoppingland.s3.eu-central-1.amazonaws.com/SL+images/sl_seller-products.png)

* Admin panel - store management & stock listing

![DEMO](https://shoppingland.s3.eu-central-1.amazonaws.com/shopping-land_admin-panel2.png)

* Admin panel - seller orders 

![DEMO](https://shoppingland.s3.eu-central-1.amazonaws.com/SL+images/sl_seller-orders-panel.png)

* Admin panel = Customer order details

![DEMO](https://shoppingland.s3.eu-central-1.amazonaws.com/SL+images/sl_seller-order-panel.png)

# Features

* Admin panel where sellers can add stores with specific locations and products to the corresponding store. Product stocks can be viewed and updated for each stores individually. Search function to check product availability in store based on ID, brand or name
* Interactive map where you can view all seller stores and their informations. Each store redirect to the seller's page with products, store filtering and search options.
* Separate Customer and Seller profiles can be created and updated
* Sellers can change order item(s) status as 'sent' or 'picked up' depending on purchase method. Order status changes to 'Completed' automatically.
* Full featured shopping cart
* Product reviews and ratings
* Checkout process (shipping, payment method, etc)
* PayPal / credit card integration

# Technologies

* Frontend: React with Redux
* Backend: Django REST Framework
* Database: AWS PostgreSQL
* File storage: AWS S3
* Deployment: Heroku

# Download & Setup Instructions

* 1 - Clone project: git clone https://github.com/umitcansaran/shopping-land

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

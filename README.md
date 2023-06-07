# Ecommerce Platform with Django + React

Live Demo can be viewed at https://www.shopping-land.ch/

Log in as a 'customer' or 'seller' with the provided credentials to try all the features.

* Homescreen

![DEMO](https://shoppingland.s3.eu-central-1.amazonaws.com/SL+images/home.png)

* Map 

![DEMO](https://shoppingland.s3.eu-central-1.amazonaws.com/SL+images/store-map.png) 

* Product & stock management

![DEMO](https://shoppingland.s3.eu-central-1.amazonaws.com/SL+images/seller-products.png)

* Store management

![DEMO](https://shoppingland.s3.eu-central-1.amazonaws.com/SL+images/seller-stores.png)

* Seller panel - orders view

![DEMO](https://shoppingland.s3.eu-central-1.amazonaws.com/SL+images/seller-orders-panel.png)

* Seller panel - order details

![DEMO](https://shoppingland.s3.eu-central-1.amazonaws.com/SL+images/seller-order-panel.png)

* Customer panel - order details

![DEMO](https://shoppingland.s3.eu-central-1.amazonaws.com/SL+images/customer-order.png)

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
* Database: Amazon RDS PostgreSQL
* File storage: AWS S3
* Deployment: Heroku

# Download & Setup Instructions

* 1 - Clone project: git clone https://github.com/umitcansaran/shopping-land
* 2 - cd shopping-land

# Create a Virtual Environment
* 1 - pip3 install virtualenv
* 2 - virtualenv <my_env_name> 
* 3 - source <my_env_name>/bin/activate

# Install Python Packages for Django
* 1 - cd app
* 2 - pip3 install -r requirements.txt
* 3 - python3 manage.py runserver

# Install React Modules
* 1 - cd frontend
* 2 - npm install
* 3 - npm start
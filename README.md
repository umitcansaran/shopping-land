# Ecommerce Platform with Node.js (Express) and React (Redux)

Live Demo: [View Here](https://www.shopping-land.ch/)  

Log in as a **customer** or **seller** with the provided credentials to explore all features.

---

## Screenshots

### Home Screen  
![Home Screen](https://shoppingland.s3.eu-central-1.amazonaws.com/SL+images/home.png)

### Interactive Map  
![Map](https://shoppingland.s3.eu-central-1.amazonaws.com/SL+images/store-map.png)

### Product & Stock Management  
![Product & Stock Management](https://shoppingland.s3.eu-central-1.amazonaws.com/SL+images/seller-products.png)

### Store Management  
![Store Management](https://shoppingland.s3.eu-central-1.amazonaws.com/SL+images/seller-stores.png)

### Seller Panel - Orders View  
![Seller Orders](https://shoppingland.s3.eu-central-1.amazonaws.com/SL+images/seller-orders-panel.png)

### Seller Panel - Order Details  
![Seller Order Details](https://shoppingland.s3.eu-central-1.amazonaws.com/SL+images/seller-order-panel.png)

### Customer Panel - Order Details  
![Customer Order Details](https://shoppingland.s3.eu-central-1.amazonaws.com/SL+images/customer-order.png)

---

## Features

- **Admin Panel**: 
  - Sellers can add stores with specific locations.
  - Products can be added, viewed, and managed per store.  
  - Search products by ID, brand, or name to check availability per store.
  
- **Interactive Map**:  
  - View all seller stores with detailed store information.  
  - Each store redirects to the seller's product page with store filtering and search functionality.
  
- **User Profiles**:  
  - Separate **Customer** and **Seller** profiles that can be created and updated.  

- **Order Management**:  
  - Sellers can update order item statuses as "Sent" or "Picked Up."  
  - Orders automatically update to "Completed" after the purchase process is finalized.  

- **Shopping Features**:  
  - Fully featured shopping cart with product reviews and ratings.  
  - Checkout process including shipping and payment options.  
  - PayPal / credit card integration for secure payments.  

---

## Technologies

- **Frontend**: React with Redux  
- **Backend**: Node.js with Express  
- **Database**: AWS RDS PostgreSQL  
- **File Storage**: AWS S3  
- **DevOps**: Docker, Nginx, GitHub Actions
- **Deployment**: Heroku  

---

## Download & Setup Instructions

1. Clone the project:  
   ```bash
   git clone https://github.com/umitcansaran/shopping-land
   ```

2. Navigate to the project directory:  
   ```bash
   cd shopping-land
   ```

3. Start the application using Docker Compose:  
   ```bash
   docker compose -f docker-compose.prod.yml up
   

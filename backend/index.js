const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
const path = require("path");
const bodyParser = require("body-parser");

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.json()); //req.body

// Start the server and listen on port
const PORT = process.env.PORT || 8000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});

// Check db connection
pool.connect((err, client, release) => {
  if (err) {
    return console.error("Error acquiring client", err.stack);
  }
  console.log("Connected to the database");
  release(); // release the client back to the pool
});

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, "../frontend/build")));

// Routes
const productsRoutes = require("./routes/products");
app.use("/api/products", productsRoutes);

const profilesRoutes = require("./routes/profiles");
app.use("/api/profiles", profilesRoutes);

const usersRoutes = require("./routes/users");
app.use("/api/users", usersRoutes);

const ordersRoutes = require("./routes/orders");
app.use("/api/orders", ordersRoutes);

const sellerOrdersRoutes = require("./routes/seller-orders");
app.use("/api/seller-orders", sellerOrdersRoutes);

const searchRoutes = require("./routes/search");
app.use("/api/search", searchRoutes);

const storeRoutes = require("./routes/stores");
app.use("/api/stores", storeRoutes);

const stocksRoutes = require("./routes/stocks");
app.use("/api/stocks", stocksRoutes);

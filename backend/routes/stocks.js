const express = require("express");
const router = express.Router();
const {
  getAllStocks,
  getAllStocksByStore,
  getAllStocksByProduct,
} = require("../queries/stockQueries");

// List all the stocks
router.get("/", async (req, res) => {
  try {
    const response = await getAllStocks();
    res.json(response);
  } catch (err) {
    console.error(err.message);
  }
});

// List all the stocks of a store
router.get("/store/:storeId", async (req, res) => {
  try {
    const response = await getAllStocksByStore(req.params.storeId);
    res.json(response);
  } catch (err) {
    console.error(err.message);
  }
});

// List all the stocks of a product
router.get("/product/:product_id(\\d+)", async (req, res) => {
  try {
    const response = await getAllStocksByProduct(req.params.product_id);
    res.json(response);
  } catch (err) {
    console.error(err.message);
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const pool = require("../db");
const multer = require("multer");
const upload = multer();
const s3 = require("../s3-config");
const loggedInUser = require("../middleware/loggedInUser");
const {
  getMySellerOrders,
  getSellerOrder,
} = require("../queries/sellerOrderQueries");

// List all seller orders associated with the currently logged-in user (must have a seller profile)
router.get("/myorders", loggedInUser, async (req, res) => {
  try {
    const response = await getMySellerOrders(req.user.userId);

    res.json(response);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// List a seller order associated with the currently logged-in user (must have a seller profile)
router.get("/:id(\\d+)", loggedInUser, async (req, res) => {
  try {
    const response = await getSellerOrder(req.params.id);

    res.json(response);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;

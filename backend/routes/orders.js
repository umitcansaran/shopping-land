const express = require("express");
const router = express.Router();
const loggedInUser = require("../middleware/loggedInUser");
const {
  getMyOrders
} = require("../queries/orderQueries");
const { getOrder } = require("../queries/orderQueries");

// List all customer orders associated with the currently logged-in user (must have a customer profile)
router.get("/myorders", loggedInUser, async (req, res) => {
  try {
    const response = await getMyOrders(req.user.userId);

    res.json(response);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// List a customer order associated with the currently logged-in user (must have a seller profile)
router.get("/:id(\\d+)", loggedInUser, async (req, res) => {
  try {
    const response = await getOrder(req.params.id);

    res.json(response);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;

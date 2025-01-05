const express = require("express");
const router = express.Router();
const pool = require("../db");
const {
  getAllStores,
  getMyStores,
  getStoreByUserId,
} = require("../queries/storeQueries");
const loggedInUser = require("../middleware/loggedInUser");

// List all stores
router.get("/", async (req, res) => {
  try {
    const allStores = await getAllStores();
    res.json(allStores);
  } catch (err) {
    console.error(err.message);
  }
});

// List all stores associated with the currently logged-in user (must have a seller profile)
router.get("/mystores", loggedInUser, async (req, res) => {
  try {
    const response = await getMyStores(req.user.userId);
    res.json(response);
  } catch (err) {
    console.error(err.message);
  }
});

// List all stores by a user (must have a seller profile)
router.get("/user/:id", async (req, res) => {
  const user_id = req.params.id;
  try {
    const allStores = await getStoreByUserId(user_id);
    res.json(allStores);
  } catch (err) {
    console.error(err.message);
  }
});

module.exports = router;

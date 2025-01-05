const express = require("express");
const { queryMapping } = require("../queries/searchQueries");
const { executeQuery } = require("../helpers/executeQuery");
const router = express.Router();

// GET search all products
router.get("/", async (req, res) => {
  const type = req.query.type;
  const queryConfig = queryMapping[type];

  if (queryConfig) {
    const { query, params } = queryConfig;
    await executeQuery(query, params(req), res);
  } else {
    res.status(400).json({ error: "Invalid search type" });
  }
});

module.exports = router;

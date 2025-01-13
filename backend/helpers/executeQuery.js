const pool = require("../db");
const { addToImagePath } = require("./addToImagePath");

// Helper function to execute a query and handle response
const executeQuery = async (query, params, res) => {
  try {
    const result = await pool.query(query, params);
    const response = addToImagePath(result.rows, process.env.AWS_S3_BUCKET_URL);
    res.json(response);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { executeQuery };

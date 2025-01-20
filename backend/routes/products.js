const express = require("express");
const router = express.Router();
const pool = require("../db");
const multer = require("multer");
const upload = multer();
const s3 = require("../s3-config");
const loggedInUser = require("../middleware/loggedInUser");
const {
  getAllProducts,
  getMyProducts,
  getAllProductsBySeller,
  getProductsById,
  createProduct,
  getProductCategories,
  getLatestProductReviews,
} = require("../queries/productQueries");
const { getReviewsByProductId } = require("../queries/reviewQueries");
const { addToImagePath } = require("../helpers/addToImagePath");

// List all products
router.get("/", async (req, res) => {
  const limit = parseInt(req.query.limit) || 12; // Default to 12
  const offset = parseInt(req.query.offset) || 0; // Default to 0

  try {
    const allProducts = await getAllProducts(limit, offset);

    // Count total products
    const countResult = await pool.query(
      "SELECT COUNT(*) AS total FROM base_product"
    );

    const count = parseInt(countResult.rows[0].total);

    const next = offset + limit < count ? offset + limit : null;

    const response = addToImagePath(
      allProducts.rows,
      process.env.AWS_S3_BUCKET_URL
    );

    // Respond with the paginated products and metadata
    res.json({
      results: response,
      count,
      next,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// List all products associated with the currently logged-in user (must have a seller profile)
router.get("/myproducts", loggedInUser, async (req, res) => {
  try {
    const response = await getMyProducts(req.user.userId);

    res.json(response);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// List all products by a specific seller
router.get("/user/:id(\\d+)", async (req, res) => {
  const user_id = req.params.id;

  try {
    const allProducts = await getAllProductsBySeller(user_id);

    const response = addToImagePath(
      allProducts.rows,
      process.env.AWS_S3_BUCKET_URL
    );

    res.json(response);
  } catch (err) {
    console.error(err.message);
  }
});

// Retrieve a product
router.get("/:product_id(\\d+)", async (req, res) => {
  try {
    const product = await getProductsById(req.params.product_id);

    const response = addToImagePath(product, process.env.AWS_S3_BUCKET_URL);

    res.json(response[0]);
  } catch (err) {
    console.error(err.message);
  }
});

// Create a new product
router.post("/new", upload.single("image"), async (req, res) => {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: req.file.originalname,
    Body: req.file.buffer,
  };

  try {
    // Upload image to S3 and get the image URL
    const image = await s3.upload(params).promise();

    // Get current time in ISO 8601 format
    const currentTime = new Date().toISOString();

    const result = await createProduct(
      req.body.category,
      req.body.brand,
      req.body.name,
      req.body.price,
      req.body.description,
      currentTime,
      image.Location,
      req.body.seller
    );

    // Check if the INSERT was successful by inspecting rowCount
    if (result.rowCount > 0) {
      const createdProduct = result.rows[0];

      res.status(201).json({
        detail: "Product created successfully!",
        success: true,
        product: createdProduct,
      });
    } else {
      res.status(500).json({ detail: "No rows inserted!", success: false });
    }
  } catch (err) {
    console.error("Error creating product:", err.message);
    res.status(500).json({ detail: "Server error." });
  }
});

// List all product categories
router.get("/categories", async (req, res) => {
  try {
    const response = await getProductCategories();

    res.json(response);
  } catch (err) {
    console.error(err.message);
  }
});

// List all product subcategories
router.get("/subcategories", async (req, res) => {
  try {
    const response = await pool.query("SELECT * FROM base_productsubcategory");
    res.json(response.rows);
  } catch (err) {
    console.error(err.message);
  }
});

// Retrieve the latest 5 products
router.get("/latest-products", async (req, res) => {
  try {
    const latestProducts = await pool.query(
      'SELECT * FROM base_product ORDER BY "createdAt" DESC LIMIT 5'
    );
    let response = latestProducts.rows;

    addToImagePath(response, process.env.AWS_S3_BUCKET_URL);
    res.json(response);
  } catch (err) {
    console.error(err.message);
  }
});

// Retrieve the latest 5 product reviews
router.get("/latest-reviews", async (req, res) => {
  try {
    const reviewResult = await getLatestProductReviews();

    const response = addToImagePath(
      reviewResult.rows,
      process.env.AWS_S3_BUCKET_URL
    );

    res.json(response);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Retrieve a product review
router.get("/reviews/:product_id(\\d+)", async (req, res) => {
  try {
    const response = await getReviewsByProductId(req.params.product_id);
    res.json(response);
  } catch (err) {
    console.error(err.message);
  }
});

module.exports = router;

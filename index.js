const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
require("dotenv").config();

// Middleware
app.use(cors());
app.use(express.json()); //req.body

// Check db connection
pool.connect((err, client, release) => {
  if (err) {
    return console.error("Error acquiring client", err.stack);
  }
  console.log("Connected to the database");
  release(); // release the client back to the pool
});

// -------------------- HELPER FUNCTIONS

// Append the S3 bucket url to the image value (relative path)
function addToImagePath(arr, stringToAdd) {
  return arr.map((obj) => {
    if (obj.hasOwnProperty("image")) {
      obj.image = stringToAdd + obj.image; // Append the string to the image value
    }
    return obj;
  });
}

// -------------------- ROUTES

// GET all user profiles
app.get("/api/profiles", async (req, res) => {
  try {
    const allProfiles = await pool.query("SELECT * FROM base_profile");
    res.json(allProfiles.rows);
  } catch (err) {
    console.error(err.message);
  }
});

// GET all products
app.get("/api/products", async (req, res) => {
  // Extracting limit and offset from the query parameters
  const limit = parseInt(req.query.limit) || 12; // Default to 12 if not provided
  const offset = parseInt(req.query.offset) || 0; // Default to 0 if not provided

  // Serialize "Review" with the product field
  async function serializeSeller(sellerId) {
    const productResult = await pool.query(
      "SELECT * FROM auth_user WHERE id = $1",
      [sellerId]
    );
    return productResult.rows[0]; // Return the serialized product data
  }

  async function serializeProduct(product) {
    const seller = await serializeSeller(product.seller_id); // Fetch the related product
    return {
      ...product,
      seller_name: seller.username, // Add the serialized product image
    };
  }
  try {
    // Fetch last 5 reviews
    const allProducts = await pool.query(
      "SELECT * FROM base_product ORDER BY name DESC LIMIT $1 OFFSET $2",
      [limit, offset]
    );

    const countResult = await pool.query("SELECT * FROM base_product");
    const count = countResult.rowCount;

    // Calculate if there is a next page
    const next = offset + 12;
    const hasNextPage = offset + limit < count;

    // Serialize each review with the related product
    let serializedProducts = await Promise.all(
      allProducts.rows.map(async (product) => await serializeProduct(product))
    );

    const response = addToImagePath(
      serializedProducts,
      process.env.AWS_S3_BUCKET_URL
    );

    // // Respond with the serialized reviews
    // Respond with the paginated products and metadata
    res.json({
      results: response,
      next,
      count,
    });
  } catch (err) {
    console.error(err.message);
  }
});

// GET last 5 sellers profiles registered
app.get("/api/profiles/latest-sellers", async (req, res) => {
  try {
    const latestSellers = await pool.query(
      "SELECT * FROM base_profile WHERE status = 'STORE_OWNER' ORDER BY id DESC LIMIT 5"
    );
    let response = latestSellers.rows;

    addToImagePath(response, process.env.AWS_S3_BUCKET_URL);
    res.json(response);
  } catch (err) {
    console.error(err.message);
  }
});

// GET last 5 products added
app.get("/api/products/latest-products", async (req, res) => {
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

// GET last 5 product reviews added
app.get("/api/products/latest-reviews", async (req, res) => {
  // Serialize "Review" with the product field
  async function serializeProduct(productId) {
    const productResult = await pool.query(
      "SELECT * FROM base_product WHERE id = $1",
      [productId]
    );
    return productResult.rows[0]; // Return the serialized product data
  }

  async function serializeReview(review) {
    const product = await serializeProduct(review.product_id); // Fetch the related product
    return {
      ...review,
      image: product.image, // Add the serialized product image
      product_brand: product.brand, // Add the serialized product brand
    };
  }
  try {
    // Fetch last 5 reviews
    const reviewResult = await pool.query(
      'SELECT * FROM base_review ORDER BY "createdAt" DESC LIMIT 5'
    );

    // Serialize each review with the related product
    let serializedReviews = await Promise.all(
      reviewResult.rows.map(async (review) => await serializeReview(review))
    );

    const response = addToImagePath(
      serializedReviews,
      process.env.AWS_S3_BUCKET_URL
    );

    // // Respond with the serialized reviews
    res.json(response);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// GET seller profiles only
app.get("/api/profiles/sellers", async (req, res) => {
  try {
    const profiles = await pool.query(
      "SELECT * FROM base_profile WHERE status = 'STORE_OWNER'"
    );
    let response = profiles.rows;

    addToImagePath(response, process.env.AWS_S3_BUCKET_URL);
    res.json(response);
  } catch (err) {
    console.error(err.message);
  }
});

// GET product categories
app.get("/api/products/categories", async (req, res) => {
  async function serializeSubCategory(categoryId) {
    const subCategoryResult = await pool.query(
      "SELECT * FROM base_productsubcategory WHERE category_id = $1",
      [categoryId]
    );
    return subCategoryResult.rows;
  }

  async function serializeCategory(category) {
    const subcategory = await serializeSubCategory(category.id); // Fetch the related category
    return {
      ...category,
      subcategory, // Add the serialized subcategories
    };
  }
  try {
    const productCategoryResult = await pool.query(
      "SELECT * FROM base_productcategory"
    );

    // Serialize each category with the related subcategories
    let serializedCategories = await Promise.all(
      productCategoryResult.rows.map(
        async (category) => await serializeCategory(category)
      )
    );

    res.json(serializedCategories);
  } catch (err) {
    console.error(err.message);
  }
});

// GET product subcategories
app.get("/api/products/subcategories", async (req, res) => {
  try {
    const productSubCategories = await pool.query(
      "SELECT * FROM base_productsubcategory"
    );
    res.json(productSubCategories.rows);
  } catch (err) {
    console.error(err.message);
  }
});

const port = process.env.PORT || 80;

app.listen(port, () => {
  console.log(`server has started on port ${port}`);
});

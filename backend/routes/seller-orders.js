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
const { getMySellerOrders, getSellerOrder } = require("../queries/sellerOrderQueries");

// Append the AWS S3 bucket URL to image paths
function addToImagePath(arr, stringToAdd) {
  return arr.map((obj) => {
    if (obj.hasOwnProperty("image")) {
      obj.image = stringToAdd + obj.image;
    }
    if (obj.hasOwnProperty("profile_image")) {
      obj.profile_image = stringToAdd + obj.profile_image;
    }
    if (obj.product && obj.product.hasOwnProperty("image")) {
      obj.product.image = stringToAdd + obj.product.image;
    }
    return obj;
  });
}

// List all seller orders associated with the currently logged-in user (must have a seller profile)
router.get("/myorders", loggedInUser, async (req, res) => {
  try {
    const response = await getMySellerOrders(req.user.userId);
    console.log(response)

    res.json(response);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// List all seller orders associated with the currently logged-in user (must have a seller profile)
router.get("/:id(\\d+)", loggedInUser, async (req, res) => {
    try {
      const response = await getSellerOrder(req.params.id);
      console.log(response)
  
      res.json(response);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

module.exports = router;

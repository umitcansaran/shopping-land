const express = require("express");
const router = express.Router();
const pool = require("../db");
const multer = require("multer");
const upload = multer();
const s3 = require("../s3-config");
const loggedInUser = require("../middleware/loggedInUser");
const {
  getAllProfiles,
  getProfileById,
  createProfile,
  latestSellerProfiles,
} = require("../queries/profileQuery");

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

// List all profiles
router.get("/", async (req, res) => {
  try {
    const allProfiles = await getAllProfiles();

    const response = addToImagePath(allProfiles, process.env.AWS_S3_BUCKET_URL);

    res.json(response);
  } catch (err) {
    console.error(err.message);
  }
});

// Retrieve a profile
router.get("/:id(\\d+)", async (req, res) => {
  const profile_id = req.params.id;

  try {
    const allProfiles = await getProfileById(profile_id);

    const response = addToImagePath(allProfiles, process.env.AWS_S3_BUCKET_URL);

    res.json(response[0]);
  } catch (err) {
    console.error(err.message);
  }
});

// Create a new profile
router.post("/new", async (req, res) => {
  const { user, status } = req.body;

  try {
    const newProfile = await createProfile(user, status);

    res
      .status(201)
      .json({ detail: "Profile created successfully!", profile: newProfile });
  } catch (err) {
    console.error("Error registering user:", err.message);
    res.status(500).json({ detail: "Server error." });
  }
});

// List all seller profiles (store owners)
router.get("/sellers", async (req, res) => {
  try {
    const profiles = await pool.query(
      "SELECT * FROM base_profile WHERE status = 'STORE_OWNER'"
    );
    let response = profiles.rows;

    addToImagePath(profiles.rows, process.env.AWS_S3_BUCKET_URL);

    res.json(response);
  } catch (err) {
    console.error(err.message);
  }
});

// List the profiles of the 5 most recently registered sellers (store owners)
router.get("/latest-sellers", async (req, res) => {
  try {
    const response = await latestSellerProfiles();

    addToImagePath(response, process.env.AWS_S3_BUCKET_URL);

    res.json(response);
  } catch (err) {
    console.error(err.message);
  }
});

module.exports = router;

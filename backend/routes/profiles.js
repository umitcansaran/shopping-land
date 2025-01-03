const express = require("express");
const router = express.Router();
const pool = require("../db");
const multer = require("multer");
const upload = multer();
const s3 = require("../s3-config");
const loggedInUser = require("../middleware/loggedInUser");
const { getAllProfiles } = require("../queries/profileQuery");

// Append the S3 bucket URL to image paths
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
  
      const response = addToImagePath(
        allProfiles.rows,
        process.env.AWS_S3_BUCKET_URL
      );
  
      res.json(response);
    } catch (err) {
      console.error(err.message);
    }
  });

  module.exports = router;

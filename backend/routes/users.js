const express = require("express");
const router = express.Router();
const pool = require("../db");
const bcrypt = require("bcryptjs");
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

// User registration
router.post("/registration", async (req, res) => {
    const { username, email, password } = req.body;
  
    try {
      // Validate input
      if (!username || !email || !password) {
        return res.status(400).json({ detail: "All fields are required." });
      }
  
      // Check if the email or username already exists
      const userCheckQuery =
        "SELECT * FROM auth_user WHERE email = $1 OR username = $2";
      const userCheckResult = await pool.query(userCheckQuery, [email, username]);
      if (userCheckResult.rows.length > 0) {
        return res
          .status(400)
          .json({ detail: "Username or email already exists." });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 8);
  
      // Generate timestamp 
      const timestamp = new Date().toISOString().replace("T", " ").replace("Z", "+00");
  
      const insertUserQuery = `
              INSERT INTO auth_user (username, email, password, is_superuser, first_name, last_name, is_staff, is_active, date_joined) 
              VALUES ($1, $2, $3, false, $1, $1, false, true, '${timestamp}') 
              RETURNING id, username, email
          `;
      const insertUserResult = await pool.query(insertUserQuery, [
        username,
        email,
        hashedPassword,
      ]);
  
      // Return the new user (excluding the password)
      const newUser = insertUserResult.rows[0];
      res
        .status(201)
        .json({ detail: "User registered successfully!", id: newUser.id });
    } catch (err) {
      console.error("Error registering user:", err.message);
      res.status(500).json({ detail: "Server error." });
    }
  });

module.exports = router;

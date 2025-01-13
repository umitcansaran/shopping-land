const express = require("express");
const router = express.Router();
const pool = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const loggedInUser = require("../middleware/loggedInUser");
const { getMyDetails, getAllUsers } = require("../queries/userQueries");
const { checkPassword } = require("../helpers/checkPassword");

// JWT secret key (store securely in env variables)
const JWT_SECRET = process.env.JWT_SECRET_KEY;

// List all users
router.get("/", async (req, res) => {
  try {
    const response = await getAllUsers();
    res.json(response);
  } catch (err) {
    console.error(err.message);
  }
});

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
    const timestamp = new Date()
      .toISOString()
      .replace("T", " ")
      .replace("Z", "+00");

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

// POST login user
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query(
      "SELECT * FROM auth_user WHERE username = $1",
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = result.rows[0];

    const plainPassword = password;
    const hashedPassword = user.password;

    // Verify if a password was hashed using PBKDF2 algorithm. Used for authenticating users migrated from a previous Django backend.
    const isValid = checkPassword(plainPassword, hashedPassword);

    // Verify bcrypt-hashed passwords for authenticity.
    if (!isValid) {
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
    }

    // Generate tokens
    const access = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "7d",
    });
    const refresh = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ access, refresh });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// list logged in user's details
router.get("/me", loggedInUser, async (req, res) => {
  try {
    const response = await getMyDetails(req.user.userId);
    response.profile.image =
      process.env.AWS_S3_BUCKET_URL + response.profile.image;
    res.json(response);
  } catch (err) {
    console.error(err.message);
  }
});

module.exports = router;

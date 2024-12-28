const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
const path = require("path");
require("dotenv").config();
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { getStoresByOwnerId } = require("./queries/storeQueries");
const loggedInUser = require("./middleware/loggedInUser");

// Middleware
app.use(cors());
app.use(express.json()); //req.body

// JWT secret key (store securely in env variables)
const JWT_SECRET = process.env.JWT_SECRET_KEY;

// Start the server and listen on port
const PORT = process.env.PORT || 80;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Check db connection
pool.connect((err, client, release) => {
  if (err) {
    return console.error("Error acquiring client", err.stack);
  }
  console.log("Connected to the database");
  release(); // release the client back to the pool
});

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, "./frontend/build")));

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

// function loggedInUser(req, res) {
//   const authHeader = req.headers.authorization;

//   if (!authHeader) {
//     return res.status(401).json({ message: "Authorization header missing" });
//   }

//   // Extract the token from the header (assumes "Bearer <token>")
//   const token = authHeader.split(" ")[1];

//   if (!token) {
//     return res.status(401).json({ message: "Token missing" });
//   }

//   // Use the token (e.g., validate it, decode it, etc.)
//   const decodeJwtToken = (token) => {
//     try {
//       return jwt.verify(token, JWT_SECRET); // Replace with your secret key
//     } catch (err) {
//       throw new Error("Invalid token");
//     }
//   };
//   // Perform your user-specific logic
//   // For example, decode the token to get the user's ID or fetch the user from a database
//   const user = decodeJwtToken(token); // Replace with your token decoding logic

//   if (!user) {
//     return res.status(404).json({ message: "User not found" });
//   }
//   return user;
// }

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
  // Extracting limit and offset from the query params
  const limit = parseInt(req.query.limit) || 12; // Default to 12 if not provided
  const offset = parseInt(req.query.offset) || 0; // Default to 0 if not provided

  try {
    const allProducts = await pool.query(
      `SELECT base_product.brand, base_product.name, base_product.price, base_product.description, base_product.image, base_product.seller_id, auth_user.username
      FROM base_product
      LEFT JOIN auth_user ON base_product.seller_id = auth_user.id 
      ORDER BY base_product.name DESC LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    const countResult = await pool.query("SELECT * FROM base_product");
    const count = countResult.rowCount;

    // Calculate if there is a next page
    const next = offset + 12;

    const response = addToImagePath(
      allProducts.rows,
      process.env.AWS_S3_BUCKET_URL
    );

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
  try {
    const reviewResult = await pool.query(
      `SELECT base_review.name, base_review.rating, base_review.comment, base_review.product_id, base_product.brand AS product_brand, base_product.image
      FROM base_review
      LEFT JOIN base_product ON base_review.product_id = base_product.id
      ORDER BY base_review."createdAt" DESC 
      LIMIT 5`
    );

    const response = addToImagePath(
      reviewResult.rows,
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

// GET search all products
app.get("/api/search", async (req, res) => {
  const searchQuery = `%${req.query.search_string}%`;

  try {
    const allProducts = await pool.query(
      "SELECT * FROM base_product LEFT JOIN auth_user ON base_product.seller_id = auth_user.id WHERE LOWER(base_product.brand) LIKE LOWER($1) OR LOWER(base_product.name) LIKE LOWER($1) OR LOWER(auth_user.username) LIKE LOWER($1)",
      [searchQuery]
    );

    const response = addToImagePath(
      allProducts.rows,
      process.env.AWS_S3_BUCKET_URL
    );

    res.json(response);
  } catch (err) {
    console.error(err.message);
  }
});

// POST user registration
app.post("/api/users/registration", async (req, res) => {
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

    // Insert user into the database
    const date = new Date();

    // Format date components
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");
    const hours = String(date.getUTCHours()).padStart(2, "0");
    const minutes = String(date.getUTCMinutes()).padStart(2, "0");
    const seconds = String(date.getUTCSeconds()).padStart(2, "0");
    const milliseconds = String(date.getUTCMilliseconds()).padStart(3, "0");
    const microseconds = "000"; // Simulated as JavaScript doesn't provide microseconds natively

    // Combine into the required format
    const timestamp = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}${microseconds}+00`;

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

// POST create a profile
app.post("/api/profiles/new", async (req, res) => {
  const { user, status } = req.body;

  try {
    const insertProfileuery = `
          INSERT INTO base_profile (user_id, status) 
          VALUES ($1, $2) 
          RETURNING id, status
      `;
    const insertProfileResult = await pool.query(insertProfileuery, [
      user,
      status,
    ]);

    // Return the new user (excluding the password)
    const newProfile = insertProfileResult.rows[0];
    res
      .status(201)
      .json({ detail: "Profile created successfully!", profile: newProfile });
  } catch (err) {
    console.error("Error registering user:", err.message);
    res.status(500).json({ detail: "Server error." });
  }
});

// POST login user
app.post("/api/users/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Query user from the database
    const result = await pool.query(
      "SELECT * FROM auth_user WHERE username = $1",
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = result.rows[0];

    // Verify if a password was hashed using PBKDF2 algorithm. Used for authenticating users migrated from a previous Django backend.
    function verifyDjangoPassword(plainPassword, djangoHashedPassword) {
      const [algorithm, iterations, salt, hash] =
        djangoHashedPassword.split("$");

      // if (algorithm !== "pbkdf2_sha256") {
      //   throw new Error("Unsupported hashing algorithm");
      // }

      const derivedKey = crypto
        .pbkdf2Sync(plainPassword, salt, parseInt(iterations), 32, "sha256")
        .toString("base64");

      return derivedKey === hash;
    }

    const plainPassword = password;
    const djangoHashedPassword = user.password;

    const isValid = verifyDjangoPassword(plainPassword, djangoHashedPassword);

    // Verify bcrypt-hashed passwords for authenticity.
    if (!isValid) {
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
    }

    // Generate tokens
    const access = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "15m",
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

// GET logged in user's details
app.get("/api/users/me", async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header missing" });
  }

  // Extract the token from the header (assumes "Bearer <token>")
  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token missing" });
  }

  // Use the token (e.g., validate it, decode it, etc.)
  const decodeJwtToken = (token) => {
    try {
      return jwt.verify(token, JWT_SECRET); // Replace with your secret key
    } catch (err) {
      throw new Error("Invalid token");
    }
  };
  // Perform your user-specific logic
  // For example, decode the token to get the user's ID or fetch the user from a database
  const user = decodeJwtToken(token); // Replace with your token decoding logic

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  try {
    const loggedInUser = await pool.query(
      `
      SELECT auth_user.*, 
       jsonb_build_object(
           'id', base_profile.id,
           'name', auth_user.username,
           'status', base_profile.status,
           'user', base_profile.user_id,
           'description', base_profile.description,
           'headquarter', base_profile.headquarter,
           'image', base_profile.image,
           'industry', base_profile.industry,
           'categoryDetails', json_agg(jsonb_build_object(
               'id', base_productcategory.id,
               'name', base_productcategory.name
           ))
       ) AS profile
FROM auth_user
LEFT JOIN base_profile ON auth_user.id = base_profile.user_id
LEFT JOIN base_profile_category ON base_profile.id = base_profile_category.profile_id
LEFT JOIN base_productcategory ON base_profile_category.productcategory_id = base_productcategory.id
WHERE auth_user.id = $1
GROUP BY auth_user.id, base_profile.id;
      `,
      [user.userId]
    );
    let response = loggedInUser.rows[0];
    response.profile.image =
      process.env.AWS_S3_BUCKET_URL + response.profile.image;
    // addToImagePath(response.profile, process.env.AWS_S3_BUCKET_URL);

    res.json(response);
  } catch (err) {
    console.error(err.message);
  }
});

// GET all user profiles
app.get("/api/users", async (req, res) => {
  try {
    const allUsers = await pool.query(`
      SELECT auth_user.*, 
      jsonb_build_object(
      'id', base_profile.id,
      'status', base_profile.status
      ) AS profile
      FROM auth_user
      LEFT JOIN base_profile ON auth_user.id = base_profile.user_id;`);
    res.json(allUsers.rows);
  } catch (err) {
    console.error(err.message);
  }
});

// GET All stores of a logged in user with a "Seller" profile
app.get("/api/stores/mystores", loggedInUser, async (req, res) => {
  try {
    const response = await getStoresByOwnerId(req.user.userId);
    res.json(response);
  } catch (err) {
    console.error(err.message);
  }
});

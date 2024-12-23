const jwt = require("jsonwebtoken");

function loggedInUser(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header missing" });
  }

  // Extract the token from the header (assumes "Bearer <token>")
  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token missing" });
  }

  // Decode and verify the token
  const decodeJwtToken = (token) => {
    try {
      return jwt.verify(token, process.env.JWT_SECRET_KEY); // Replace with your secret key
    } catch (err) {
      throw new Error("Invalid token");
    }
  };

  const user = decodeJwtToken(token);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  req.user = user; // Attach user object to request

  // Proceed to the next middleware/route handler
  next();
}

module.exports = loggedInUser; // Export the function

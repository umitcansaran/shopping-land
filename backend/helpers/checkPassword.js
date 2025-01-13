const crypto = require("crypto");

// Verify if a password was hashed using PBKDF2 algorithm.
function checkPassword(plainPassword, hashedPassword) {
  const [algorithm, iterations, salt, hash] = hashedPassword.split("$");

  const derivedKey = crypto
    .pbkdf2Sync(plainPassword, salt, parseInt(iterations), 32, "sha256")
    .toString("base64");

  return derivedKey === hash;
}

module.exports = { checkPassword };

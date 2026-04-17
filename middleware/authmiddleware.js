const jwt = require("jsonwebtoken");

// Middleware to check authentication
const authenticateUser = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attaching the user info to the request object
    next(); // Proceed to the next middleware or controller
  } catch (err) {
    res.status(400).json({ message: "Invalid token." });
  }
};

module.exports = authenticateUser;
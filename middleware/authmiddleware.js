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

// Middleware to check if the user is an admin
const isAdmin = (req, res, next) => {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@mmps.com'; // Fallback to placeholder
  if (req.user && req.user.email === adminEmail) {
    next();
  } else {
    res.status(403).json({ message: "Forbidden: You do not have permission to perform this action." });
  }
};

module.exports = { authenticateUser, isAdmin };
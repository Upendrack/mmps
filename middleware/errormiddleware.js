// Middleware to handle errors
const errorHandler = (err, req, res, next) => {
    console.error(err.stack); // Log the error for debugging
    res.status(500).json({ message: "Something went wrong on the server." });
  };
  
  module.exports = errorHandler;
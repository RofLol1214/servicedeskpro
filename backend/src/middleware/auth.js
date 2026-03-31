const jwt  = require("jsonwebtoken");
const User = require("../models/User");

/**
 * Protect middleware — verifies JWT and attaches user to req.user.
 */
const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorised, no token" });
  }

  try {
    const token   = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) return res.status(401).json({ message: "User not found" });
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token invalid or expired" });
  }
};

/**
 * Role guard middleware — restricts route to specified roles.
 * Usage: authorize("admin", "it_staff")
 */
const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: `Role '${req.user.role}' is not allowed` });
  }
  next();
};

module.exports = { protect, authorize };

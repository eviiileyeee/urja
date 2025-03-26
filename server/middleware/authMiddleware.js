const jwt = require("jsonwebtoken");

const authMiddleware = (roles = []) => (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Access Denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden: You don't have access" });
    }

    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid Token" });
  }
};

module.exports = authMiddleware;

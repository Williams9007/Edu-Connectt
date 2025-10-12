import jwt from "jsonwebtoken";

// ✅ Named export for JWT verification middleware
export const verifyToken = (req, res, next) => {
  try {
    // Get token from header or cookies
    const authHeader = req.header("Authorization");
    let token = authHeader?.startsWith("Bearer ") ? authHeader.replace("Bearer ", "") : null;

    // Optional: check cookie if token not in header
    if (!token && req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ error: "Access denied. No token provided." });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach user info to request
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired. Please login again." });
    }
    res.status(400).json({ error: "Invalid token" });
  }
};

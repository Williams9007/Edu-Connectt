import jwt from "jsonwebtoken";
import User from "../models/User.js"; // assuming QAO is stored in User collection

export const verifyQao = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const qao = await User.findById(decoded.id);
    if (!qao || qao.role !== "qao") {
      return res.status(403).json({ message: "Access denied" });
    }

    req.user = qao;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

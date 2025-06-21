import jwt from "jsonwebtoken";
import User from "../models/user.models.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized - No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) return res.status(401).json({ message: "Invalid token" });
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).josn({ message: "User not found" });
    }
    req.user = user;
    next();
  } catch (err) {}
};

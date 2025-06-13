const jwt = require("jsonwebtoken");
const User = require("../models/User");

const verifyrole = (roles) => {
  return async (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log(" Incoming Auth Header:", authHeader);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        console.log("No valid auth header");

      return res.status(403).json({ message: "Access denied" });
    }

    try {
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Token decoded:", decoded);

      const user = await User.findById(decoded.userId).select("-password"); 
      console.log("👤 Fetched User:", user);

      if (!user || !roles.includes(user.role)) {
        console.log(" Role mismatch or user not found");
        return res.status(403).json({ message: "Access denied" });
      }

      req.user = user;
      next();
    } catch (err) {
      console.error("Middleware error:", err);
      return res.status(403).json({ message: "Access denied" });
    }
  };
};

module.exports = verifyrole;

const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  console.log("---- AUTH MIDDLEWARE HIT ----");
  console.log("Authorization header:", req.headers.authorization);

  if (!req.headers.authorization) {
    console.log("❌ No Authorization header");
    return res.status(401).json({ msg: "No Authorization header" });
  }

  if (!req.headers.authorization.startsWith("Bearer ")) {
    console.log("❌ Wrong auth format");
    return res.status(401).json({ msg: "Invalid auth format" });
  }

  const token = req.headers.authorization.split(" ")[1];
  console.log("Token received:", token);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded);
    req.user = decoded.user;
    next();
  } catch (err) {
    console.log("❌ JWT VERIFY FAILED:", err.message);
    return res.status(401).json({ msg: "Token invalid" });
  }
};
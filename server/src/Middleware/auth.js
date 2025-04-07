const jwt = require("jsonwebtoken");

const protectRoute = (req, res, next) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) {
      res.json({ message: "Unauthorized - No access token provided" });
      return;
    }
    const decode = jwt.verify(token, process.env.ACCESS_TOKEN_KEY);
    req.user = decode;
    next();
  } catch (error) {
    res.json({ message: "Invalid token", error: error.message });
  }
};

const adminRoute = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
      res.json({message : "Access onlay Admin"})
  }
};

module.exports = {protectRoute , adminRoute};

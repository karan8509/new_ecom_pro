const jwt = require("jsonwebtoken");

const protectRoute = (req, res, next) => {
  try {
    const token = req.cookie.accessToken;
    if (!token) {
      res.json({ message: "Invalid Token ", error: error.message });
      return;
    }
    const decode = jwt.verify(token, ACCESS_TOKEN_KEY);
    req.use = decode;
    next();
  } catch (error) {
    res.json({ message: "", error: error.message });
  }
};


module.exports = protectRoute;

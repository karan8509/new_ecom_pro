const express = require("express");
const {
  Signup,
  Login,
  Logout,
  GetProfile,
  RefreshToken,
} = require("../controllers/auth.Controller");
const {protectRoute} = require("../Middleware/auth");
const routes = express.Router();

routes.post("/signup", Signup);
routes.post("/login", Login);
routes.post("/logout", Logout);
routes.get("/refresh", RefreshToken);
routes.get("/profile", protectRoute, GetProfile);

module.exports = routes;

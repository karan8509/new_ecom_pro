const express = require("express");
const {
  getAllPrducts,
  createProduct,
  deleteProduct,
} = require("../controllers/product.Controller");
const { protectRoute, adminRoute } = require("../Middleware/auth");

const routes = express.Router();

routes.get("/", protectRoute, adminRoute, getAllPrducts);
routes.post("/create", protectRoute, adminRoute, createProduct);
routes.delete("/:id", protectRoute, adminRoute, deleteProduct);

module.exports = routes;

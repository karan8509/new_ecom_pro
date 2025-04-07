const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image : {
      type: String,
      required: [true, "Image is required"],
    },
    category: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
);

const product = mongoose.model("Product", ProductSchema);
module.exports = product;

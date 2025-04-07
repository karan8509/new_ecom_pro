const Product = require("../models/product.Model");
const cloudinary = require("../config/cloudinary");

//  Get All Products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json({ message: "Success: Products fetched", success: true, products });
  } catch (error) {
    res.json({ message: "Server error", success: false, error: error.message });
  }
};

//  Create Product
const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, image } = req.body;
    let cloudinaryResponse = null;

    if (image) {
      cloudinaryResponse = await cloudinary.uploader.upload(image, {
        folder: "product",
      });
    }

    const product = await Product.create({
      name,
      description,
      price,
      category,
      image: cloudinaryResponse?.secure_url || "",
    });

    res.json({ message: "Product created", success: true, product });
    console.log(" Product created:", name);
  } catch (error) {
    res.json({ message: "Server error", success: false, error: error.message });
  }
};

// Delete Product
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.json({ message: "Product not found", success: false });
    }

    if (product.image) {
      const publicId = product.image.split("/").pop().split(".")[0];
      try {
        await cloudinary.uploader.destroy(`product/${publicId}`);
        console.log(" Cloudinary image deleted");
      } catch (error) {
        return res.json({ message: "Error deleting image", success: false });
      }
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted", success: true });
  } catch (error) {
    res.json({ message: "Server error", success: false, error: error.message });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  deleteProduct,
};

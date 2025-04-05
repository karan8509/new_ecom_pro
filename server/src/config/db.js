const mongoose = require("mongoose");

const Connection = async () => {
  try {
    await mongoose.connect(process.env._URL_);
    console.log("MONGODB CONNECTION ON")
  } catch (error) {
    console.log("MONGODB NOT CONNECTED ", error.message);
  }
};

module.exports = Connection;

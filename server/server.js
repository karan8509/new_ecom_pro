const express = require("express");
const Connection = require("./src/config/db");
const cookieParser = require("cookie-parser");
const authRoutes = require("./src/routes/userRoutes");
const productRoute = require("./src/routes/productRoute")


require("dotenv").config();
const app = express();

const PORT = process.env.PORT || 6001;
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.json({ message: "Successfully Access Data", success: true });
});


app.use("/api/auth", authRoutes);
app.use("/api/product" , productRoute);


const startServer = async () => {
  try {
    await Connection();
    app.listen(PORT, () => {
      console.log(`server on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log("error", error.message);
  }
};

startServer();

const User = require("../models/user.Model");
const bcryptjs = require("bcryptjs");
const { ObjectId } = require("bson");
const jwt = require("jsonwebtoken");

const generateToken = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_KEY, {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_KEY, {
    expiresIn: "15m",
  });
  return { accessToken, refreshToken };
};


const setCookies = (res, accessToken, refreshToken) => {
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    maxAge: 15 * 60 * 1000,
    sameSite: "strict",
    secure: false, // production me true
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite: "strict",
    secure: false,
  });
};


const Signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log(name, "---->");
    const exist = await User.findOne({ email });

    if (exist) {
      res.json({ message: "Email already exists", success: false });
      return;
    }
    const salt = await bcryptjs.genSalt(10);
    const hashPassword = await bcryptjs.hash(password, salt);
    const user = await User.create({
      name,
      email,
      password: hashPassword,
    });

    const { accessToken, refreshToken } = generateToken(user._id);
    setCookies(res, accessToken, refreshToken);

    await user.save();
    res.json({ success: true, message: "Account created successfully" });
  } catch (error) {
    res.json({ message: error.message || "An error occurred", success: false });
  }
};

const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      res.json({ message: "Email not registered", success: false });
      return;
    }
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      res.json({ message: "Incorrect password", success: false });
      return;
    }
    const { accessToken, refreshToken } = generateToken(user._id);
    setCookies(res, accessToken, refreshToken);

    res.json({ message: "Login successful", success: true });
  } catch (error) {
    res.json({ message: error.message || "An error occurred", success: false });
  }
};

const Logout = (req, res) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
  });
  res.json({ message: "Logged out successfully" });
};

const RefreshToken = async (req, res) => {
  const token = req.cookie.refreshToken;
  if (!token) {
    res.json({ message: "No refresh token", error: error.message });
    return;
  }
  try {
    const decode = jwt.verify(token, process.env.REFRESH_TOKEN_KEY);
    const accessToken = jwt.sign(
      { userId: decode.userId },   process.env.ACCESS_TOKEN_KEY,
      { expiresIn: "15m" }
    );

    res.cookie("accessToken" , accessToken , {
      httpOnly : true,
      maxAge : 15 * 60 * 1000,
      sameSite : "strict",
      secure  : false
    })

  } catch (error) {}
};

const GetProfile = async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    res.json({ message: error.message });
  }
};

// const ForgotPassword = async (res, res) => {
//   try {
//     const { email } = req.body;
//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.json({ message: "Email not registered", success: false });
//     }
//     // const url = `http://localhost:api/auth/reset-password/${token}`
//     // console.log(url);
//     res.json({
//       message: "Password reset link sent successfully",
//       success: true,
//     });
//   } catch (error) {
//     res.json({ success: false, message: error.message || "An error occurred" });
//   }
// };

// const ResetPassword = async (req, res) => {
//   try {
//     const { password } = req.body;
//     console.log(password);
//     const { id } = req.params;

//     const hashPs = await bcryptjs.hash(password, 10);
//     console.log("Updating password...");

//     const user = await User.updateOne(
//       { _id: new ObjectId(id) },
//       { $set: { password: hashPs } }
//     );
//     console.log(user);
//     await user.save();
//     res.json({ message: "successfull password updata ", success: true });
//   } catch (error) {
//     res.json({ message: error.message, success: false });
//   }
// };

module.exports = { Signup, Login, Logout, GetProfile , RefreshToken };

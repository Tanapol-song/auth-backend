const bcrypt = require("bcryptjs");
const { status } = require("http-status");

const ApiError = require("../utils/ApiError.js");
const config = require("../config/config.js");
const User = require("../models/user.model.js");
const catchAsync = require("../middlewares/catchAsync.js");

const httpStatus = status;

const login = catchAsync(async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    throw new ApiError(httpStatus.BAD_REQUEST, "All fields are required");
  }
  const user = await User.findOne({ username });
  const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");
  
  if (!user || !isPasswordCorrect) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "ชื่อผู้ใช้งาน หรือ รหัสผ่าน ไม่ถูกต้อง");
  }

  // RESPONSE!!
  res.status(httpStatus.OK).send({
    message: "User logged in successfully",
    data: user
  });
});

const register = catchAsync(async (req, res) => {
  const { username, password, email } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email already exists");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = new User({
    email,
    username,
    password: hashedPassword,
  });

  await newUser.save();

  res.status(httpStatus.OK).json({
    message: "User registered successfully",
    data: {
      _id: newUser._id,
      email: newUser.email,
      username: newUser.username,
    },
  });
});

module.exports = {
  register,
  login,
};

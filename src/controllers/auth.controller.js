const bcrypt = require("bcryptjs");
const { status } = require("http-status");

const ApiError = require("../utils/ApiError.js");
const config = require("../config/config.js");
const User = require("../models/user.model.js");
const Otp = require("../models/otp.model.js");

const catchAsync = require("../middlewares/catchAsync.js");
const generateRefNo = require("../utils/GenerateRefNo.js");
const sendEmail = require("../utils/EmailService.js");

const httpStatus = status;

const login = catchAsync(async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    throw new ApiError(httpStatus.BAD_REQUEST, "All fields are required");
  }
  const user = await User.findOne({ username });
  const isPasswordCorrect = await bcrypt.compare(
    password,
    user?.password || ""
  );

  if (!user || !isPasswordCorrect) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "ชื่อผู้ใช้งาน หรือ รหัสผ่าน ไม่ถูกต้อง"
    );
  }

  // RESPONSE!!
  res.status(httpStatus.OK).send({
    message: "User logged in successfully",
    data: user,
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

//request OTP
const sendOTP = catchAsync(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User not found");
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const newOtpExpires = new Date(Date.now() + 3 * 60 * 1000);
  const refno = generateRefNo();

  const newOtp = new Otp({
    user: user?._id,
    otp,
    otpExpires: newOtpExpires,
    ref: refno,
  });

  await newOtp.save();

  await sendEmail(email, otp, refno);

  res.status(httpStatus.OK).json({
    message: "OTP sent successfully",
    data: { user: user?.email, refno },
  });
});

//verify and resetPassword
const resetPassword = catchAsync(async (req, res) => {
  const { otp, ref, password } = req.body;
  const otpRecord = await Otp.findOne({ otp, ref });

  if (!otpRecord) {
    throw new ApiError(httpStatus.BAD_REQUEST, "OTP not found");
  }

  if (otpRecord.otpExpires < new Date()) {
    throw new ApiError(httpStatus.BAD_REQUEST, "OTP หมดอายุ");
  }

  if (otpRecord.verified == true) {
    throw new ApiError(httpStatus.BAD_REQUEST, "OTP ใช้งานแล้ว");
  }
  const user = await User.findById(otpRecord.user);
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User not found");
  }

  const salt = await bcrypt.genSalt(10);
  const newPassword = await bcrypt.hash(password, salt);

  user.password = newPassword;
  otpRecord.verified = true;

  await Promise.all([user.save(), otpRecord.save()]);
  res.status(httpStatus.OK).json({
    message: "รีเซ็ตรหัสผ่านสำเร็จ",
  });
});

module.exports = {
  register,
  login,
  sendOTP,
  resetPassword,
};

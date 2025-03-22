const mongoose = require("mongoose");
const { Schema } = mongoose;

const otpSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    ref: { type: String, required: true },
    otp: { type: String, required: true },
    verified: { type: Boolean, default: false },
    otpExpires: { type: Date, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Otp", otpSchema, "Otp");

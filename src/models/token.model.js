const mongoose = require("mongoose");
const { Schema } = mongoose;

const tokenSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    token: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    blacklisted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Token", tokenSchema, "Token");

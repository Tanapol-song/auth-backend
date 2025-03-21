const mongoose = require("mongoose");
const config = require("../config/config.js");

const connectToDB = async () => {
  try {
    await mongoose.connect(config.mongoose.url);
    console.log("Connected to DB");
  } catch (err) {
    console.log("Error connecting to DB",err.message);
  }
};

module.exports = connectToDB;
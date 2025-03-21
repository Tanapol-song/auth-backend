const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, '../../.env') });

module.exports = {
  port: process.env.PORT || 8080,
  mongoose:{
    url: process.env.MONGO_DB_URL,
  }
};

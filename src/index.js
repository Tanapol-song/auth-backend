const app = require("./app.js");
const dotenv = require("dotenv");
const config = require("./config/config.js");
const connectToDB = require("./db/connectToDB.js");

const PORT = config.port;

app.listen(PORT,()=>{
    connectToDB();
    console.log(`Server Running on port ${PORT}`)
})
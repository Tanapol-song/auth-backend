const express = require("express");
const ApiError = require("./utils/ApiError");
const httpStatus = require("http-status");
const routes = require("./routes");
const errorHandler = require("./middlewares/errorHandler");
const cors = require("cors");
const app = express();

app.use(express.json());

// app.use(cors());
const corsOptions = {
  origin: ['http://localhost:3000'],
  credentials: true
};
app.use(cors(corsOptions));

app.use("/api", routes);

app.use((req, res, next) => {
  next(new ApiError(httpStatus.status.NOT_FOUND, "Not found"));
});

app.use(errorHandler);
module.exports = app;

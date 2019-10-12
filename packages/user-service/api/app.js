require("./config/config");

const express = require("express");
const bodyParser = require("body-parser");
const healthCheckRoute = require("./routes/healthCheckRoute");
const userRoutes = require("./routes/userRoutes");
const logger = require("./log");
const cors = require("cors");

const { mongoose } = require("./db/mongoose");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use("/", healthCheckRoute);
app.use("/user", userRoutes);


const server = app.listen(process.env.USER_SERVICE_PORT, () => {
  logger.info(`started in ${process.env.USER_SERVICE_PORT}`);
});

module.exports = {
  app
};

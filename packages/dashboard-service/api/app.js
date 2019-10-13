require("./config/config");

const express = require("express");
const bodyParser = require("body-parser");
const healthCheckRoute = require("./routes/healthCheckRoute");
const productRoutes = require("./routes/productRoutes");
const logger = require("./log");
const cors = require("cors");
const { initializeProducts } = require("./controllers/productController")

const { mongoose } = require("./db/mongoose");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use("/", healthCheckRoute);
app.use("/product", productRoutes)

const server = app.listen(process.env.USER_SERVICE_PORT, () => {
  logger.info(`started in ${process.env.USER_SERVICE_PORT}`);
  initializeProducts()
});

module.exports = {
  app
};

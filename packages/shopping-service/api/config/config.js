const config = require("./config.json");
const logger = require("../log.js");

const env = process.env.NODE_ENV || "development";

if (env === "development" || env === "test") {
  const envConfig = config[env];
  logger.info(`ENV -> ${env}`);
  Object.keys(envConfig).forEach(key => {
    process.env[key] = envConfig[key];
    logger.info(`${key}: ${envConfig[key]}`);
  });
}

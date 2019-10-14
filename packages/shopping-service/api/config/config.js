const config = require("./config.json");
const logger = require("../log.js");
const path = require("path");

const env = process.env.NODE_ENV || "development";

if (env === "development" || env === "test") {
  const envConfig = config[env];
  logger.info(`ENV -> ${env}`);
  Object.keys(envConfig).forEach(key => {
    process.env[key] = envConfig[key];
    logger.info(`${key}: ${envConfig[key]}`);
  });
}
const emailConfig = {
  transportConfig: {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_HOST_PORT,
    secure: process.env.EMAIL_SECURE,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  },
  options: {
    from: process.env.EMAIL_OPTIONS_FROM,
    attachments: [
      {
        filename: process.env.EMAIL_OPTIONS_ATTACH_FILENAME,
        path: "./api/public/mailer/rigo.png",
        cid: process.env.EMAIL_OPTIONS_ATTACH_CID
      }
    ]
  }
};

module.exports = {
  emailConfig
};

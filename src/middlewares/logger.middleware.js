import fs from "fs";
import winston from "winston";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: { service: "request-logging" },
  transports: [new winston.transports.File({ filename: "logs.txt" })],
});

// const fsPromise = fs.promises;

// async function log(logdata) {
//   try {
//     logdata = `\n${new Date().toString()} - ${logdata}`;
//     await fsPromise.appendFile("log.txt", logdata);
//   } catch (err) {
//     console.log(err);
//   }
// }

const loggerMiddleware = async (req, res, next) => {
  if (!req.url.includes("signin")) {
    const logData = `${req.url} - ${JSON.stringify(req.body)}`;
    logger.info(logData);
  }
  next();
};

export default loggerMiddleware;

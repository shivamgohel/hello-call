import { createLogger, format, transports } from "winston";

const { combine, timestamp: tsTimestamp, printf, colorize, errors } = format;

// Custom log format
const logFormat = printf(({ timestamp, level, message, stack }) => {
  return stack
    ? `[${timestamp}] [${level}]: ${message} - ${stack}`
    : `[${timestamp}] [${level}]: ${message}`;
});

const logger = createLogger({
  exitOnError: false,
  format: combine(
    tsTimestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    errors({ stack: true }), // Capture stack trace if error
  ),
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  transports: [
    // Console transport with colors
    new transports.Console({
      format: combine(
        colorize(),
        tsTimestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        errors({ stack: true }),
        logFormat,
      ),
    }),
    // File transport
    new transports.File({
      filename: "combined.log",
      format: combine(
        tsTimestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        logFormat,
      ),
    }),
  ],
});

export default logger;

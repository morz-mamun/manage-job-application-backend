import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import path from "path";
import { env, isDev } from "@config/env";

const { combine, timestamp, printf, colorize, errors, json } = winston.format;

// Custom log format for dev
const devFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}]: ${stack || message}`;
});

// Daily rotate file transport
const fileRotateTransport = new DailyRotateFile({
  filename: path.join(env.LOG_DIR, "%DATE%-combined.log"),
  datePattern: "YYYY-MM-DD",
  maxSize: "20m",
  maxFiles: "14d",
  format: combine(timestamp(), json()),
});

const errorFileRotateTransport = new DailyRotateFile({
  filename: path.join(env.LOG_DIR, "%DATE%-error.log"),
  datePattern: "YYYY-MM-DD",
  level: "error",
  maxSize: "20m",
  maxFiles: "30d",
  format: combine(timestamp(), json()),
});

export const logger = winston.createLogger({
  level: env.LOG_LEVEL,
  format: combine(
    errors({ stack: true }),
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  ),
  transports: [
    // Console transport
    new winston.transports.Console({
      format: isDev
        ? combine(colorize({ all: true }), devFormat)
        : combine(timestamp(), json()),
    }),
    fileRotateTransport,
    errorFileRotateTransport,
  ],
  exitOnError: false,
});

// Stream for Morgan HTTP logging
export const morganStream = {
  write: (message: string) => {
    logger.http(message.trim());
  },
};

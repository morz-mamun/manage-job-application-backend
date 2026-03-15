import mongoose from "mongoose";
import { logger } from "@utils/logger";
import { env } from "@config/env";

const MONGO_OPTIONS: mongoose.ConnectOptions = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

export const connectDB = async (): Promise<void> => {
  try {
    mongoose.set("strictQuery", true);

    const conn = await mongoose.connect(env.MONGODB_URI, MONGO_OPTIONS);

    logger.info(`✅ MongoDB connected: ${conn.connection.host}`);

    // Connection events
    mongoose.connection.on("disconnected", () => {
      logger.warn("⚠️  MongoDB disconnected. Attempting to reconnect...");
    });

    mongoose.connection.on("reconnected", () => {
      logger.info("✅ MongoDB reconnected");
    });

    mongoose.connection.on("error", (err) => {
      logger.error(`❌ MongoDB error: ${err.message}`);
    });
  } catch (error) {
    logger.error(`❌ MongoDB connection failed: ${(error as Error).message}`);
    process.exit(1);
  }
};

export const disconnectDB = async (): Promise<void> => {
  await mongoose.connection.close();
  logger.info("MongoDB connection closed");
};

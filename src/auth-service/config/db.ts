import mongoose from "mongoose";
import { env } from "./env";
import { logger } from "./logger";

export async function connectDB(): Promise<void> {
    try {
        await mongoose.connect(env.MONGO_URI);
        logger.info("MongoDB connected");
    } catch (error) {
        logger.error("MongoDB connection failed", { error });
        process.exit();
    }
}
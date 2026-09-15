import Redis from "ioredis";
import { env } from "./env";
import { logger } from "./logger";

export const redisClient = new Redis({
    host: env.REDIS_HOST,
    port: env.REDIS_PORT,
    password: env.REDIS_PASSWORD,
    maxRetriesPerRequest: 3,
});

redisClient.on("connect", () => logger.info("Redis connected"));
redisClient.on("error", (err) => logger.error("Redis error", { err }));
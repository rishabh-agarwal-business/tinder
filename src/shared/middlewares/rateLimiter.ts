// Builder pattern again

import rateLimit from "express-rate-limit";
import Redis from "ioredis";
import { RedisStore } from "rate-limit-redis";

export interface RateLimiterConfig {
    redisClient: Redis;
    windowMs: number;
    limit: number;
    prefix: string;
    message?: string;
}

export function buildRateLimiter(config: RateLimiterConfig) {
    return rateLimit({
        windowMs: config.windowMs,
        limit: config.limit,
        standardHeaders: true,
        legacyHeaders: false,
        store: new RedisStore({
            sendCommand: (...args: [string, ...string[]]) => config.redisClient.call(...args) as any,
            prefix: config.prefix
        }),
        message: {
            success: false,
            message: config.message || "Too many requests try again later"
        },
    });
}
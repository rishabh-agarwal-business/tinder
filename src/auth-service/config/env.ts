import dotenv from "dotenv";
dotenv.config();

function required(key: string): string {
    const value = process.env[key];
    if (!value) throw new Error(`Missing required env variable: ${key}`);
    return value;
}

export const env = {
    NODE_ENV: process.env.NODE_ENV || "development",
    PORT: Number(process.env.AUTH_PORT) || 5001,
    SERVICE_NAME: "auth-service",
    AWS_REGION: process.env.AWS_REGION || "ap-south-1",

    MONGO_URI: required("AUTH_MOGO_URI"),
    REDIS_HOST: process.env.REDIS_HOST || "127.0.0.1",
    REDIS_PORT: Number(process.env.REDIS_PORT) || 6379,
    REDIS_PASSWORD: process.env.REDIS_PASSWORD || undefined,

    JWT_ACCESS_SECRET: required('AUTH_JWT_ACCESS_SECRET'),
    JWT_REFRESH_SECRET: required('AUTH_JWT_REFRESH_SECRET'),
    AUTH_TOEKN_TTL: '15m',
    REFRESH_TOKEN_TTLSECONDS: 60 * 60 * 24 * 7,

    CLIENT_URL: process.env.CLIENT_URL || "http://localhost:3000",
    COOKIE_SECURE: process.env.NODE_ENV === "production",
    AUTH_SECRET_NAME: process.env.AUTH_SECRET_NAME
}
import crypto from "crypto";
import { linkSync } from "fs";
import jwt, { SignOptions } from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { UnauthorizedError } from "../../shared/errors/AppError";
import { env } from "../config/env";
import { redisClient } from "../config/redis";

interface RefreshTokenPayload {
    sub: string;
    jti: string;
}

function hashToken(token: string): string {
    return crypto.createHash("sha256").update(token).digest("hex");
}

function redisKey(userId: string, jti: string) {
    return `refresh:${userId}:${jti}`;
}

export function signAccessToken(userId: string): string {
    const options: SignOptions = {
        expiresIn: env.ACCESS_TOKEN_TTL as SignOptions["expiresIn"],
    };
    return jwt.sign({ sub: userId }, env.JWT_ACCESS_SECRET, options);
}

export async function issueRefreshToken(userId: string): Promise<string> {
    const jti = uuidv4();
    const token = jwt.sign({ sub: userId, jti }, env.JWT_REFRESH_SECRET, {
        expiresIn: env.REFRESH_TOKEN_TTLSECONDS
    });

    await redisClient.set(redisKey(userId, jti), hashToken(token), "EX", env.REFRESH_TOKEN_TTLSECONDS);
    return token;
}

export async function revokeAllSessions(userId: string): Promise<void> {
    const keys = await redisClient.keys(`refresh:${userId}:*`);
    if (keys.length) await redisClient.del(...keys);
}

export async function revokeOneSession(refreshToken: string): Promise<void> {
    try {
        const decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as RefreshTokenPayload;
        await redisClient.del(redisKey(decoded.sub, decoded.jti));
    } catch {
        // already invalid - nothing to revoke
    }
}

export async function verifyAndRotateRefreshToken(oldToken: string) {
    let decoded: RefreshTokenPayload;
    try {
        decoded = jwt.verify(oldToken, env.JWT_REFRESH_SECRET) as RefreshTokenPayload;
    } catch {
        throw new UnauthorizedError("Invalid or expired refresh token");
    }

    const key = redisKey(decoded.sub, decoded.jti);
    const storeHash = await redisClient.get(key);

    if (!storeHash || storeHash !== hashToken(oldToken)) {
        await revokeAllSessions(decoded.sub);
        throw new UnauthorizedError("Refresh token is invalid or reused - all sessions revoked");
    }

    await redisClient.del(key);
    const newRefreshToken = await issueRefreshToken(decoded.sub);
    const newAccessToken = signAccessToken(decoded.sub);

    return { userId: decoded.sub, newRefreshToken, newAccessToken };
}
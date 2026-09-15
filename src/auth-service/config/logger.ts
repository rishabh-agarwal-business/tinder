import { env } from "./env";
import { createLogger } from "../../shared/logger/logger";

export const logger = createLogger({
    serviceName: env.SERVICE_NAME,
    env: env.NODE_ENV,
    awsRegion: env.AWS_REGION
})
import winston from "winston";
import WinstonCloudwatch from "winston-cloudwatch";

interface LoggerConfig {
    serviceName: string;
    env: string;
    awsRegion?: string;
}

export function createLogger({ serviceName, env, awsRegion }: LoggerConfig): winston.Logger {
    const baseFormat = winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format((info) => {
            info.service = serviceName;
            return info;
        })(),
        winston.format.json()
    );

    const transports: winston.transport[] = [
        new winston.transports.Console({
            format: env === "production"
                ? baseFormat
                : winston.format.combine(winston.format.colorize(), winston.format.simple())
        })
    ];

    if (env === 'production' && awsRegion) {
        transports.push(
            new WinstonCloudwatch({
                logGroupName: `/tinder/${env}`,
                logStreamName: () => `${serviceName}-${new Date().toISOString().slice(0, 10)}`,
                awsRegion,
                jsonMessage: true,
                retentionInDays: 30
            })
        );
    }

    return winston.createLogger({
        level: env === 'production' ? 'info' : 'debug',
        format: baseFormat,
        transports,
        exitOnError: false
    });
}
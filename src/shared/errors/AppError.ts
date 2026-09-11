export enum API_ERRORS {
    APP_ERROR = "APP_ERROR",
    BAD_REQUEST = "BAD_REQUEST",
    UNAUTHORIZED = "UNAUTHORIZED",
    FORBIDDEN = "FORBIDDEN",
    NOT_FOUND = "NOT_FOUND",
    CONFLICT = "CONFLICT",
    SERVICE_UNAVILABLE = "SERVICE_UNAVILABLE"
}

export class AppError extends Error {
    public readonly statusCode: number;
    public readonly isOperational: boolean;
    public readonly code: string;

    constructor(message: string, statusCode: number, code: API_ERRORS) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.isOperational = true;
        this.code = code;
        Error.captureStackTrace(this, this.constructor); // Capture the stack trace for this error, but don't include the constructor itself in the stack trace.
    }
}

export class BadRequestError extends AppError {
    constructor(message = "Bad request") {
        super(message, 400, API_ERRORS.BAD_REQUEST);
    }
}

export class UnauthorizedError extends AppError {
    constructor(message = "Unauthorized") {
        super(message, 401, API_ERRORS.UNAUTHORIZED);
    }
}

export class ForbiddenError extends AppError {
    constructor(message = "Forbidden") {
        super(message, 403, API_ERRORS.FORBIDDEN);
    }
}

export class NotFoundError extends AppError {
    constructor(message = "Not Found") {
        super(message, 404, API_ERRORS.NOT_FOUND);
    }
}

export class ConflictError extends AppError {
    constructor(message = "Conflict") {
        super(message, 409, API_ERRORS.CONFLICT);
    }
}

export class ServiceUnavailableError extends AppError {
    constructor(message = "Upstream service unavilable") {
        super(message, 503, API_ERRORS.SERVICE_UNAVILABLE);
    }
}

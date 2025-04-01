import { Str, u32 } from "../types";
export declare class AppError extends Error {
    constructor(message: Str);
}
export declare class ValidationError extends AppError {
    constructor(message: Str);
}
export declare class NetworkError extends AppError {
    constructor(message: Str);
}
export declare class AuthenticationError extends AppError {
    constructor(message: Str);
}
export declare class NotFoundError extends AppError {
    resourceType?: Str;
    constructor(message: Str, resourceType?: Str);
}
export declare class UnauthorizedError extends AppError {
    constructor(message: Str);
}
export declare class ForbiddenError extends AppError {
    constructor(message: Str);
}
export declare class DatabaseError extends AppError {
    constructor(message: Str);
}
export declare class ServerError extends AppError {
    constructor(message: Str);
}
export declare namespace DomainErrors {
    class BusinessLogicError extends AppError {
        constructor(message: Str);
    }
    class ResourceConflictError extends AppError {
        constructor(message: Str);
    }
    class ConfigurationError extends AppError {
        constructor(message: Str);
    }
    class RateLimitError extends AppError {
        retryAfterSeconds?: u32;
        constructor(message: Str, retryAfterSeconds?: u32);
    }
}
export declare function createErrorFactory<T extends AppError>(ErrorClass: new (message: Str, ...args: any[]) => T, defaultMessage?: Str): (customMessage?: Str, ...args: any[]) => T;
export declare function initErrors(): Promise<void>;

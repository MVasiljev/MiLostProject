import { Str } from "../types";
export class AppError extends Error {
    constructor(message) {
        super(message.unwrap());
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = this.constructor.name;
    }
}
export class ValidationError extends AppError {
    constructor(message) {
        super(message);
    }
}
export class NetworkError extends AppError {
    constructor(message) {
        super(message);
    }
}
export class AuthenticationError extends AppError {
    constructor(message) {
        super(message);
    }
}
export class NotFoundError extends AppError {
    constructor(message, resourceType) {
        super(message);
        this.resourceType = resourceType;
    }
}
export class UnauthorizedError extends AppError {
    constructor(message) {
        super(message);
    }
}
export class ForbiddenError extends AppError {
    constructor(message) {
        super(message);
    }
}
export class DatabaseError extends AppError {
    constructor(message) {
        super(message);
    }
}
export class ServerError extends AppError {
    constructor(message) {
        super(message);
    }
}
export var DomainErrors;
(function (DomainErrors) {
    class BusinessLogicError extends AppError {
        constructor(message) {
            super(message);
        }
    }
    DomainErrors.BusinessLogicError = BusinessLogicError;
    class ResourceConflictError extends AppError {
        constructor(message) {
            super(message);
        }
    }
    DomainErrors.ResourceConflictError = ResourceConflictError;
    class ConfigurationError extends AppError {
        constructor(message) {
            super(message);
        }
    }
    DomainErrors.ConfigurationError = ConfigurationError;
    class RateLimitError extends AppError {
        constructor(message, retryAfterSeconds) {
            super(message);
            this.retryAfterSeconds = retryAfterSeconds;
        }
    }
    DomainErrors.RateLimitError = RateLimitError;
})(DomainErrors || (DomainErrors = {}));
export function createErrorFactory(ErrorClass, defaultMessage = Str.fromRaw("An error occurred")) {
    return (customMessage, ...args) => {
        return new ErrorClass(customMessage || defaultMessage, ...args);
    };
}
//# sourceMappingURL=error.js.map
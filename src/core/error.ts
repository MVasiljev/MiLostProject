import { Str, u32 } from "../types";

export class AppError extends Error {
  constructor(message: Str) {
    super(message.unwrap());
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = this.constructor.name;
  }
}

export class ValidationError extends AppError {
  constructor(message: Str) {
    super(message);
  }
}

export class NetworkError extends AppError {
  constructor(message: Str) {
    super(message);
  }
}

export class AuthenticationError extends AppError {
  constructor(message: Str) {
    super(message);
  }
}

export class NotFoundError extends AppError {
  constructor(message: Str, public resourceType?: Str) {
    super(message);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: Str) {
    super(message);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: Str) {
    super(message);
  }
}

export class DatabaseError extends AppError {
  constructor(message: Str) {
    super(message);
  }
}

export class ServerError extends AppError {
  constructor(message: Str) {
    super(message);
  }
}

export namespace DomainErrors {
  export class BusinessLogicError extends AppError {
    constructor(message: Str) {
      super(message);
    }
  }

  export class ResourceConflictError extends AppError {
    constructor(message: Str) {
      super(message);
    }
  }

  export class ConfigurationError extends AppError {
    constructor(message: Str) {
      super(message);
    }
  }

  export class RateLimitError extends AppError {
    constructor(message: Str, public retryAfterSeconds?: u32) {
      super(message);
    }
  }
}

export function createErrorFactory<T extends AppError>(
  ErrorClass: new (message: Str, ...args: any[]) => T,
  defaultMessage: Str = Str.fromRaw("An error occurred")
) {
  return (customMessage?: Str, ...args: any[]): T => {
    return new ErrorClass(customMessage || defaultMessage, ...args);
  };
}

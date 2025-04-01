import { Str, u32 } from "../types";
import { initWasm, getWasmModule, isWasmInitialized } from "../wasm/init.js";

export class AppError extends Error {
  constructor(message: Str) {
    if (isWasmInitialized()) {
      try {
        const wasmModule = getWasmModule();
        const wasmError = wasmModule.createAppError(message.unwrap());
        super(wasmError.message);
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = wasmError.name || this.constructor.name;
        return;
      } catch (err) {
        console.warn(
          `WASM AppError creation failed, using JS fallback: ${err}`
        );
      }
    }

    super(message.unwrap());
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = this.constructor.name;
  }
}

export class ValidationError extends AppError {
  constructor(message: Str) {
    if (isWasmInitialized()) {
      try {
        const wasmModule = getWasmModule();
        const wasmError = wasmModule.createValidationError(message.unwrap());
        super(Str.fromRaw(wasmError.message));
        return;
      } catch (err) {
        console.warn(
          `WASM ValidationError creation failed, using JS fallback: ${err}`
        );
      }
    }

    super(message);
  }
}

export class NetworkError extends AppError {
  constructor(message: Str) {
    if (isWasmInitialized()) {
      try {
        const wasmModule = getWasmModule();
        const wasmError = wasmModule.createNetworkError(message.unwrap());
        super(Str.fromRaw(wasmError.message));
        return;
      } catch (err) {
        console.warn(
          `WASM NetworkError creation failed, using JS fallback: ${err}`
        );
      }
    }

    super(message);
  }
}

export class AuthenticationError extends AppError {
  constructor(message: Str) {
    if (isWasmInitialized()) {
      try {
        const wasmModule = getWasmModule();
        const wasmError = wasmModule.createAuthenticationError(
          message.unwrap()
        );
        super(Str.fromRaw(wasmError.message));
        return;
      } catch (err) {
        console.warn(
          `WASM AuthenticationError creation failed, using JS fallback: ${err}`
        );
      }
    }

    super(message);
  }
}

export class NotFoundError extends AppError {
  public resourceType?: Str;

  constructor(message: Str, resourceType?: Str) {
    if (isWasmInitialized()) {
      try {
        const wasmModule = getWasmModule();
        const wasmError = wasmModule.createNotFoundError(
          message.unwrap(),
          resourceType ? resourceType.unwrap() : null
        );
        super(Str.fromRaw(wasmError.message));
        this.resourceType = resourceType;
        return;
      } catch (err) {
        console.warn(
          `WASM NotFoundError creation failed, using JS fallback: ${err}`
        );
      }
    }

    super(message);
    this.resourceType = resourceType;
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: Str) {
    if (isWasmInitialized()) {
      try {
        const wasmModule = getWasmModule();
        const wasmError = wasmModule.createUnauthorizedError(message.unwrap());
        super(Str.fromRaw(wasmError.message));
        return;
      } catch (err) {
        console.warn(
          `WASM UnauthorizedError creation failed, using JS fallback: ${err}`
        );
      }
    }

    super(message);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: Str) {
    if (isWasmInitialized()) {
      try {
        const wasmModule = getWasmModule();
        const wasmError = wasmModule.createForbiddenError(message.unwrap());
        super(Str.fromRaw(wasmError.message));
        return;
      } catch (err) {
        console.warn(
          `WASM ForbiddenError creation failed, using JS fallback: ${err}`
        );
      }
    }

    super(message);
  }
}

export class DatabaseError extends AppError {
  constructor(message: Str) {
    if (isWasmInitialized()) {
      try {
        const wasmModule = getWasmModule();
        const wasmError = wasmModule.createDatabaseError(message.unwrap());
        super(Str.fromRaw(wasmError.message));
        return;
      } catch (err) {
        console.warn(
          `WASM DatabaseError creation failed, using JS fallback: ${err}`
        );
      }
    }

    super(message);
  }
}

export class ServerError extends AppError {
  constructor(message: Str) {
    if (isWasmInitialized()) {
      try {
        const wasmModule = getWasmModule();
        const wasmError = wasmModule.createServerError(message.unwrap());
        super(Str.fromRaw(wasmError.message));
        return;
      } catch (err) {
        console.warn(
          `WASM ServerError creation failed, using JS fallback: ${err}`
        );
      }
    }

    super(message);
  }
}

export namespace DomainErrors {
  export class BusinessLogicError extends AppError {
    constructor(message: Str) {
      if (isWasmInitialized()) {
        try {
          const wasmModule = getWasmModule();
          const wasmError = wasmModule.createBusinessLogicError(
            message.unwrap()
          );
          super(Str.fromRaw(wasmError.message));
          return;
        } catch (err) {
          console.warn(
            `WASM BusinessLogicError creation failed, using JS fallback: ${err}`
          );
        }
      }

      super(message);
    }
  }

  export class ResourceConflictError extends AppError {
    constructor(message: Str) {
      if (isWasmInitialized()) {
        try {
          const wasmModule = getWasmModule();
          const wasmError = wasmModule.createResourceConflictError(
            message.unwrap()
          );
          super(Str.fromRaw(wasmError.message));
          return;
        } catch (err) {
          console.warn(
            `WASM ResourceConflictError creation failed, using JS fallback: ${err}`
          );
        }
      }

      super(message);
    }
  }

  export class ConfigurationError extends AppError {
    constructor(message: Str) {
      if (isWasmInitialized()) {
        try {
          const wasmModule = getWasmModule();
          const wasmError = wasmModule.createConfigurationError(
            message.unwrap()
          );
          super(Str.fromRaw(wasmError.message));
          return;
        } catch (err) {
          console.warn(
            `WASM ConfigurationError creation failed, using JS fallback: ${err}`
          );
        }
      }

      super(message);
    }
  }

  export class RateLimitError extends AppError {
    public retryAfterSeconds?: u32;

    constructor(message: Str, retryAfterSeconds?: u32) {
      if (isWasmInitialized()) {
        try {
          const wasmModule = getWasmModule();
          const wasmError = wasmModule.createRateLimitError(
            message.unwrap(),
            retryAfterSeconds ? (retryAfterSeconds as unknown as number) : null
          );
          super(Str.fromRaw(wasmError.message));
          this.retryAfterSeconds = retryAfterSeconds;
          return;
        } catch (err) {
          console.warn(
            `WASM RateLimitError creation failed, using JS fallback: ${err}`
          );
        }
      }

      super(message);
      this.retryAfterSeconds = retryAfterSeconds;
    }
  }
}

export function createErrorFactory<T extends AppError>(
  ErrorClass: new (message: Str, ...args: any[]) => T,
  defaultMessage: Str = Str.fromRaw("An error occurred")
) {
  if (isWasmInitialized()) {
    try {
      const wasmModule = getWasmModule();
      const factory = wasmModule.createErrorFactory(
        ErrorClass.name,
        defaultMessage.unwrap()
      );

      return (customMessage?: Str, ...args: any[]): T => {
        try {
          const message = customMessage
            ? customMessage.unwrap()
            : defaultMessage.unwrap();
          const wasmError = factory.createAppError(message);
          // Create an instance of the error class with the WASM-generated error info
          return new ErrorClass(Str.fromRaw(wasmError.message), ...args);
        } catch (err) {
          console.warn(`WASM error factory failed, using JS fallback: ${err}`);
          return new ErrorClass(customMessage || defaultMessage, ...args);
        }
      };
    } catch (err) {
      console.warn(`WASM createErrorFactory failed, using JS fallback: ${err}`);
    }
  }

  return (customMessage?: Str, ...args: any[]): T => {
    return new ErrorClass(customMessage || defaultMessage, ...args);
  };
}

export async function initErrors(): Promise<void> {
  if (!isWasmInitialized()) {
    try {
      await initWasm();
    } catch (error) {
      console.warn(
        `WASM module not available, using JS implementation: ${error}`
      );
    }
  }
}

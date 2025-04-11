/**
 * Error Handling Module for MiLost
 *
 * Provides a comprehensive error handling system with WebAssembly acceleration
 * and fallback mechanisms.
 */
import {
  registerModule,
  WasmModule,
  getWasmModule,
  initWasm,
} from "../initWasm/registry.js";
import { u32 } from "../types/primitives.js";
import { Str } from "../types/string.js";

/**
 * Module definition for Error WASM implementation
 */
const errorModule: WasmModule = {
  name: "Errors",

  initialize(wasmModule: any) {
    console.log("Initializing Errors module with WASM...");

    if (typeof wasmModule.Errors === "object") {
      console.log("Found Errors module in WASM");

      const errorCreationMethods = [
        "createAppError",
        "createValidationError",
        "createNetworkError",
        "createAuthenticationError",
        "createNotFoundError",
        "createUnauthorizedError",
        "createForbiddenError",
        "createDatabaseError",
        "createServerError",
        "createBusinessLogicError",
        "createResourceConflictError",
        "createConfigurationError",
        "createRateLimitError",
        "createErrorFactory",
      ];

      errorCreationMethods.forEach((method) => {
        if (typeof wasmModule.Errors[method] === "function") {
          console.log(`Found error creation method: Errors.${method}`);
        } else {
          console.warn(`Missing error creation method: Errors.${method}`);
        }
      });
    } else {
      console.warn("Errors module not found in WASM module");
      throw new Error("Required WASM functions not found for Errors module");
    }
  },

  fallback() {
    console.log("Using JavaScript fallback for Errors module");
  },
};

registerModule(errorModule);

export class AppError extends Error {
  constructor(message: Str) {
    const wasmModule = getWasmModule();
    if (wasmModule?.Errors?.createAppError) {
      try {
        const wasmError = wasmModule.Errors.createAppError(message.unwrap());
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
    const wasmModule = getWasmModule();
    if (wasmModule?.Errors?.createValidationError) {
      try {
        const wasmError = wasmModule.Errors.createValidationError(
          message.unwrap()
        );
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
    const wasmModule = getWasmModule();
    if (wasmModule?.Errors?.createNetworkError) {
      try {
        const wasmError = wasmModule.Errors.createNetworkError(
          message.unwrap()
        );
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
    const wasmModule = getWasmModule();
    if (wasmModule?.Errors?.createAuthenticationError) {
      try {
        const wasmError = wasmModule.Errors.createAuthenticationError(
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
    const wasmModule = getWasmModule();
    if (wasmModule?.Errors?.createNotFoundError) {
      try {
        const wasmError = wasmModule.Errors.createNotFoundError(
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
    const wasmModule = getWasmModule();
    if (wasmModule?.Errors?.createUnauthorizedError) {
      try {
        const wasmError = wasmModule.Errors.createUnauthorizedError(
          message.unwrap()
        );
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
    const wasmModule = getWasmModule();
    if (wasmModule?.Errors?.createForbiddenError) {
      try {
        const wasmError = wasmModule.Errors.createForbiddenError(
          message.unwrap()
        );
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
    const wasmModule = getWasmModule();
    if (wasmModule?.Errors?.createDatabaseError) {
      try {
        const wasmError = wasmModule.Errors.createDatabaseError(
          message.unwrap()
        );
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
    const wasmModule = getWasmModule();
    if (wasmModule?.Errors?.createServerError) {
      try {
        const wasmError = wasmModule.Errors.createServerError(message.unwrap());
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
      const wasmModule = getWasmModule();
      if (wasmModule?.Errors?.createBusinessLogicError) {
        try {
          const wasmError = wasmModule.Errors.createBusinessLogicError(
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
      const wasmModule = getWasmModule();
      if (wasmModule?.Errors?.createResourceConflictError) {
        try {
          const wasmError = wasmModule.Errors.createResourceConflictError(
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
      const wasmModule = getWasmModule();
      if (wasmModule?.Errors?.createConfigurationError) {
        try {
          const wasmError = wasmModule.Errors.createConfigurationError(
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
      const wasmModule = getWasmModule();
      if (wasmModule?.Errors?.createRateLimitError) {
        try {
          const wasmError = wasmModule.Errors.createRateLimitError(
            message.unwrap(),
            retryAfterSeconds ? (retryAfterSeconds as unknown as u32) : null
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
  const wasmModule = getWasmModule();
  if (wasmModule?.Errors?.createErrorFactory) {
    try {
      const factory = wasmModule.Errors.createErrorFactory(
        ErrorClass.name,
        defaultMessage.unwrap()
      );

      return (customMessage?: Str, ...args: any[]): T => {
        try {
          const message = customMessage
            ? customMessage.unwrap()
            : defaultMessage.unwrap();
          const wasmError = factory.createAppError(message);
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

/**
 * Task type implementation for MiLost
 *
 * Provides a type-safe, asynchronous task management system with WebAssembly
 * acceleration when available.
 */
import { AppError } from "../core/index.js";
import { Result, Err, Ok } from "../core/result.js";
import {
  registerModule,
  WasmModule,
  getWasmModule,
} from "../initWasm/registry.js";
import { Str } from "../types/string.js";

/**
 * Module definition for Task WASM implementation
 */
const taskModule: WasmModule = {
  name: "Task",

  initialize(wasmModule: any) {
    console.log("Initializing Task module with WASM...");

    if (typeof wasmModule.Task === "object") {
      console.log("Found Task module in WASM");

      const methods = [
        "createTask",
        "mapTask",
        "flatMapTask",
        "catchTask",
        "run",
        "cancel",
        "isCancelled",
        "toString",
      ];

      methods.forEach((method) => {
        if (typeof wasmModule.Task[method] === "function") {
          console.log(`Found method: Task.${method}`);
        } else {
          console.warn(`Missing method: Task.${method}`);
        }
      });
    } else {
      console.warn("Task module not found in WASM module");
      throw new Error("Required WASM functions not found for Task module");
    }
  },

  fallback() {
    console.log("Using JavaScript fallback for Task module");
  },
};

registerModule(taskModule);

/**
 * Custom error for task-related operations
 */
export class TaskError extends AppError {
  constructor(message: Str) {
    super(message);
  }
}

/**
 * Asynchronous task management class
 */
export class Task<T, E extends AppError = AppError> {
  private readonly _promise: Promise<Result<T, E>>;
  private _isCancelled: boolean = false;
  private _controller: AbortController = new AbortController();
  private _inner: any;
  private _useWasm: boolean;

  static readonly _type = "Task";

  /**
   * Private constructor for Task
   * @param promise Promise resolving to a Result
   * @param controller Optional AbortController
   */
  private constructor(
    promise: Promise<Result<T, E>>,
    controller?: AbortController
  ) {
    this._promise = promise;
    this._useWasm = false;

    if (controller) {
      this._controller = controller;
    }

    const wasmModule = getWasmModule();
    if (wasmModule?.Task) {
      try {
        this._inner = wasmModule.Task.createTask(promise as any);

        if (controller) {
          this._inner.setController(controller);
        }
        this._useWasm = true;
      } catch (err) {
        console.warn(
          `WASM Task creation failed, using JS implementation: ${err}`
        );
        this._useWasm = false;
      }
    }
  }

  /**
   * Create a new Task with an executor function
   * @param executor Function to create the task
   * @returns A new Task instance
   */
  static new<T, E extends AppError = AppError>(
    executor: (signal: AbortSignal) => Promise<Result<T, E>>
  ): Task<T, E> {
    const controller = new AbortController();
    const { signal } = controller;

    const promise = executor(signal).catch((error): Result<T, E> => {
      if (signal.aborted) {
        return Err(
          new TaskError(Str.fromRaw("Task cancelled")) as unknown as E
        );
      }
      return Err(new TaskError(Str.fromRaw(String(error))) as unknown as E);
    });

    return new Task<T, E>(promise, controller);
  }

  /**
   * Create a resolved Task
   * @param value The value to resolve with
   * @returns A resolved Task
   */
  static resolve<T, E extends AppError = AppError>(value: T): Task<T, E> {
    return new Task<T, E>(Promise.resolve(Ok(value)));
  }

  /**
   * Create a rejected Task
   * @param error The error to reject with
   * @returns A rejected Task
   */
  static reject<T, E extends AppError = AppError>(error: E): Task<T, E> {
    return new Task<T, E>(Promise.resolve(Err(error)));
  }

  /**
   * Combine multiple Tasks
   * @param tasks Array of Tasks to combine
   * @returns A Task resolving to an array of results
   */
  static all<T, E extends AppError = AppError>(
    tasks: Task<T, E>[]
  ): Task<T[], E> {
    const promises = tasks.map((task) => task._promise);

    return new Task<T[], E>(
      Promise.all(promises).then((results) => {
        for (const result of results) {
          if (result.isErr()) {
            return Err(result.getError()!);
          }
        }
        return Ok(results.map((r) => r.unwrap()));
      })
    );
  }

  /**
   * Transform the Task's value
   * @param fn Transformation function
   * @returns A new Task with transformed value
   */
  map<U>(fn: (value: T) => U): Task<U, E> {
    if (this._useWasm && this._inner) {
      try {
        const wasmModule = getWasmModule();

        const mappedTask = wasmModule.Task.mapTask(
          this._inner,
          (result: any) => {
            if (result.isOk()) {
              return Ok(fn(result.unwrap()));
            }
            return result;
          }
        );

        return new Task<U, E>(mappedTask.run() as Promise<Result<U, E>>);
      } catch (err) {
        console.warn(`WASM map failed, using JS fallback: ${err}`);
      }
    }

    return new Task<U, E>(
      this._promise.then((result) =>
        result.isOk()
          ? Ok(fn(result.unwrap()))
          : (result as unknown as Result<U, E>)
      )
    );
  }

  /**
   * Flat map the Task's value
   * @param fn Transformation function returning a Task
   * @returns A new Task
   */
  flatMap<U>(fn: (value: T) => Task<U, E>): Task<U, E> {
    if (this._useWasm && this._inner) {
      try {
        const wasmModule = getWasmModule();

        const flatMappedTask = wasmModule.Task.flatMapTask(
          this._inner,
          (result: any) => {
            if (result.isErr()) {
              return Promise.resolve(result);
            }
            return fn(result.unwrap())._promise;
          }
        );

        return new Task<U, E>(flatMappedTask.run() as Promise<Result<U, E>>);
      } catch (err) {
        console.warn(`WASM flatMap failed, using JS fallback: ${err}`);
      }
    }

    return new Task<U, E>(
      this._promise.then((result) => {
        if (result.isErr()) {
          return Promise.resolve(result as unknown as Result<U, E>);
        }
        return fn(result.unwrap())._promise;
      })
    );
  }

  /**
   * Handle errors in the Task
   * @param fn Error handling function
   * @returns A new Task with error handling
   */
  catch<F extends AppError>(fn: (error: E) => Result<T, F>): Task<T, F> {
    if (this._useWasm && this._inner) {
      try {
        const wasmModule = getWasmModule();

        const catchTask = wasmModule.Task.catchTask(
          this._inner,
          (result: any) => {
            if (result.isErr()) {
              return fn(result.getError());
            }
            return result;
          }
        );

        return new Task<T, F>(catchTask.run() as Promise<Result<T, F>>);
      } catch (err) {
        console.warn(`WASM catch failed, using JS fallback: ${err}`);
      }
    }

    return new Task<T, F>(
      this._promise.then((result) => {
        if (result.isErr()) {
          return fn(result.getError()!);
        }
        return result as unknown as Result<T, F>;
      })
    );
  }

  /**
   * Run the Task
   * @returns A Promise resolving to the Task's Result
   */
  async run(): Promise<Result<T, E>> {
    if (this._useWasm && this._inner) {
      try {
        return (await this._inner.run()) as Promise<Result<T, E>>;
      } catch (err) {
        console.warn(`WASM run failed, using JS fallback: ${err}`);
      }
    }
    return this._promise;
  }

  /**
   * Cancel the Task
   */
  cancel(): void {
    if (this._useWasm && this._inner) {
      try {
        this._inner.cancel();
        this._isCancelled = true;
        return;
      } catch (err) {
        console.warn(`WASM cancel failed, using JS fallback: ${err}`);
      }
    }

    if (!this._isCancelled) {
      this._isCancelled = true;
      this._controller.abort();
    }
  }

  /**
   * Check if the Task is cancelled
   */
  get isCancelled(): boolean {
    if (this._useWasm && this._inner) {
      try {
        return this._inner.isCancelled();
      } catch (err) {
        console.warn(`WASM isCancelled failed, using JS fallback: ${err}`);
      }
    }
    return this._isCancelled;
  }

  /**
   * Convert to string representation
   * @returns A Str representation of the Task
   */
  toString(): Str {
    if (this._useWasm && this._inner) {
      try {
        return Str.fromRaw(this._inner.toString());
      } catch (err) {
        console.warn(`WASM toString failed, using JS fallback: ${err}`);
      }
    }
    return Str.fromRaw(`[Task ${this._isCancelled ? "cancelled" : "active"}]`);
  }

  /**
   * Get the Symbol.toStringTag
   */
  get [Symbol.toStringTag](): Str {
    return Str.fromRaw(Task._type);
  }
}

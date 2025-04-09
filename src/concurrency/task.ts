import { Str } from "../types/string";
import { AppError } from "../core/error";
import { Result, Ok, Err } from "../core/result";
import { getWasmModule, isWasmInitialized } from "../initWasm/init";

export class TaskError extends AppError {
  constructor(message: Str) {
    super(message);
  }
}

export class Task<T, E extends AppError = AppError> {
  private readonly _promise: Promise<Result<T, E>>;
  private _isCancelled: boolean = false;
  private _controller: AbortController = new AbortController();
  private _inner: any;
  private _useWasm: boolean;

  static readonly _type = "Task";

  private constructor(
    promise: Promise<Result<T, E>>,
    controller?: AbortController
  ) {
    this._promise = promise;
    this._useWasm = isWasmInitialized();

    if (controller) {
      this._controller = controller;
    }

    if (this._useWasm) {
      try {
        const wasmModule = getWasmModule();
        this._inner = wasmModule.createTask(promise as any);

        if (controller) {
          this._inner.setController(controller);
        }
      } catch (err) {
        console.warn(
          `WASM Task creation failed, using JS implementation: ${err}`
        );
        this._useWasm = false;
      }
    }
  }

  static async init(): Promise<void> {
    if (!isWasmInitialized()) {
      try {
        await import("../initWasm/init").then((mod) => mod.initWasm());
      } catch (error) {
        console.warn(
          `WASM module not available, using JS implementation: ${error}`
        );
      }
    }
  }

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

  static resolve<T, E extends AppError = AppError>(value: T): Task<T, E> {
    return new Task<T, E>(Promise.resolve(Ok(value)));
  }

  static reject<T, E extends AppError = AppError>(error: E): Task<T, E> {
    return new Task<T, E>(Promise.resolve(Err(error)));
  }

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

  map<U>(fn: (value: T) => U): Task<U, E> {
    if (this._useWasm) {
      try {
        const wasmModule = getWasmModule();

        const mappedTask = wasmModule.mapTask(this._inner, (result: any) => {
          if (result.isOk()) {
            return Ok(fn(result.unwrap()));
          }
          return result;
        });

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

  flatMap<U>(fn: (value: T) => Task<U, E>): Task<U, E> {
    if (this._useWasm) {
      try {
        const wasmModule = getWasmModule();

        const flatMappedTask = wasmModule.flatMapTask(
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

  catch<F extends AppError>(fn: (error: E) => Result<T, F>): Task<T, F> {
    if (this._useWasm) {
      try {
        const wasmModule = getWasmModule();

        const catchTask = wasmModule.catchTask(this._inner, (result: any) => {
          if (result.isErr()) {
            return fn(result.getError());
          }
          return result;
        });

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

  async run(): Promise<Result<T, E>> {
    if (this._useWasm) {
      try {
        return (await this._inner.run()) as Promise<Result<T, E>>;
      } catch (err) {
        console.warn(`WASM run failed, using JS fallback: ${err}`);
      }
    }
    return this._promise;
  }

  cancel(): void {
    if (this._useWasm) {
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

  get isCancelled(): boolean {
    if (this._useWasm) {
      try {
        return this._inner.isCancelled();
      } catch (err) {
        console.warn(`WASM isCancelled failed, using JS fallback: ${err}`);
      }
    }
    return this._isCancelled;
  }

  toString(): Str {
    if (this._useWasm) {
      try {
        return Str.fromRaw(this._inner.toString());
      } catch (err) {
        console.warn(`WASM toString failed, using JS fallback: ${err}`);
      }
    }
    return Str.fromRaw(`[Task ${this._isCancelled ? "cancelled" : "active"}]`);
  }

  get [Symbol.toStringTag](): Str {
    return Str.fromRaw(Task._type);
  }
}

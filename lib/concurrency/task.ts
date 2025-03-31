import { Str } from "../types/string";
import { AppError } from "../core/error";
import { Result, Ok, Err } from "../core/result";

export class TaskError extends AppError {
  constructor(message: Str) {
    super(message);
  }
}

export class Task<T, E extends AppError = AppError> {
  private readonly _promise: Promise<Result<T, E>>;
  private _isCancelled: boolean = false;
  private _controller: AbortController = new AbortController();

  static readonly _type = "Task";

  private constructor(promise: Promise<Result<T, E>>) {
    this._promise = promise;
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

    const task = new Task<T, E>(promise);
    task._controller = controller;
    return task;
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
    return new Task<U, E>(
      this._promise.then((result) =>
        result.isOk()
          ? Ok(fn(result.unwrap()))
          : (result as unknown as Result<U, E>)
      )
    );
  }

  flatMap<U>(fn: (value: T) => Task<U, E>): Task<U, E> {
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
    return this._promise;
  }

  cancel(): void {
    if (!this._isCancelled) {
      this._isCancelled = true;
      this._controller.abort();
    }
  }

  get isCancelled(): boolean {
    return this._isCancelled;
  }

  toString(): Str {
    return Str.fromRaw(`[Task ${this._isCancelled ? "cancelled" : "active"}]`);
  }

  get [Symbol.toStringTag](): Str {
    return Str.fromRaw(Task._type);
  }
}

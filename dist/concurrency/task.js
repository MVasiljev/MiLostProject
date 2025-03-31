import { Str } from '../types/string.js';
import { AppError } from '../core/error.js';
import { Ok, Err } from '../core/result.js';
export class TaskError extends AppError {
    constructor(message) {
        super(message);
    }
}
export class Task {
    _promise;
    _isCancelled = false;
    _controller = new AbortController();
    static _type = "Task";
    constructor(promise) {
        this._promise = promise;
    }
    static new(executor) {
        const controller = new AbortController();
        const { signal } = controller;
        const promise = executor(signal).catch((error) => {
            if (signal.aborted) {
                return Err(new TaskError(Str.fromRaw("Task cancelled")));
            }
            return Err(new TaskError(Str.fromRaw(String(error))));
        });
        const task = new Task(promise);
        task._controller = controller;
        return task;
    }
    static resolve(value) {
        return new Task(Promise.resolve(Ok(value)));
    }
    static reject(error) {
        return new Task(Promise.resolve(Err(error)));
    }
    static all(tasks) {
        const promises = tasks.map((task) => task._promise);
        return new Task(Promise.all(promises).then((results) => {
            for (const result of results) {
                if (result.isErr()) {
                    return Err(result.getError());
                }
            }
            return Ok(results.map((r) => r.unwrap()));
        }));
    }
    map(fn) {
        return new Task(this._promise.then((result) => result.isOk()
            ? Ok(fn(result.unwrap()))
            : result));
    }
    flatMap(fn) {
        return new Task(this._promise.then((result) => {
            if (result.isErr()) {
                return Promise.resolve(result);
            }
            return fn(result.unwrap())._promise;
        }));
    }
    catch(fn) {
        return new Task(this._promise.then((result) => {
            if (result.isErr()) {
                return fn(result.getError());
            }
            return result;
        }));
    }
    async run() {
        return this._promise;
    }
    cancel() {
        if (!this._isCancelled) {
            this._isCancelled = true;
            this._controller.abort();
        }
    }
    get isCancelled() {
        return this._isCancelled;
    }
    toString() {
        return Str.fromRaw(`[Task ${this._isCancelled ? "cancelled" : "active"}]`);
    }
    get [Symbol.toStringTag]() {
        return Str.fromRaw(Task._type);
    }
}

import { Str } from "../types/string.js";
import { AppError } from "../core/error.js";
import { Ok, Err } from "../core/result.js";
import { initWasm, getWasmModule, isWasmInitialized } from "../wasm/init.js";
export class TaskError extends AppError {
    constructor(message) {
        super(message);
    }
}
export class Task {
    constructor(promise, controller) {
        this._isCancelled = false;
        this._controller = new AbortController();
        this._promise = promise;
        this._useWasm = isWasmInitialized();
        if (controller) {
            this._controller = controller;
        }
        if (this._useWasm) {
            try {
                const wasmModule = getWasmModule();
                this._inner = wasmModule.createTask(promise);
                if (controller) {
                    this._inner.setController(controller);
                }
            }
            catch (err) {
                console.warn(`WASM Task creation failed, using JS implementation: ${err}`);
                this._useWasm = false;
            }
        }
    }
    static async init() {
        if (!isWasmInitialized()) {
            try {
                await initWasm();
            }
            catch (error) {
                console.warn(`WASM module not available, using JS implementation: ${error}`);
            }
        }
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
        return new Task(promise, controller);
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
        if (this._useWasm) {
            try {
                const wasmModule = getWasmModule();
                const mappedTask = wasmModule.mapTask(this._inner, (result) => {
                    if (result.isOk()) {
                        return Ok(fn(result.unwrap()));
                    }
                    return result;
                });
                return new Task(mappedTask.run());
            }
            catch (err) {
                console.warn(`WASM map failed, using JS fallback: ${err}`);
            }
        }
        return new Task(this._promise.then((result) => result.isOk()
            ? Ok(fn(result.unwrap()))
            : result));
    }
    flatMap(fn) {
        if (this._useWasm) {
            try {
                const wasmModule = getWasmModule();
                const flatMappedTask = wasmModule.flatMapTask(this._inner, (result) => {
                    if (result.isErr()) {
                        return Promise.resolve(result);
                    }
                    return fn(result.unwrap())._promise;
                });
                return new Task(flatMappedTask.run());
            }
            catch (err) {
                console.warn(`WASM flatMap failed, using JS fallback: ${err}`);
            }
        }
        return new Task(this._promise.then((result) => {
            if (result.isErr()) {
                return Promise.resolve(result);
            }
            return fn(result.unwrap())._promise;
        }));
    }
    catch(fn) {
        if (this._useWasm) {
            try {
                const wasmModule = getWasmModule();
                const catchTask = wasmModule.catchTask(this._inner, (result) => {
                    if (result.isErr()) {
                        return fn(result.getError());
                    }
                    return result;
                });
                return new Task(catchTask.run());
            }
            catch (err) {
                console.warn(`WASM catch failed, using JS fallback: ${err}`);
            }
        }
        return new Task(this._promise.then((result) => {
            if (result.isErr()) {
                return fn(result.getError());
            }
            return result;
        }));
    }
    async run() {
        if (this._useWasm) {
            try {
                return (await this._inner.run());
            }
            catch (err) {
                console.warn(`WASM run failed, using JS fallback: ${err}`);
            }
        }
        return this._promise;
    }
    cancel() {
        if (this._useWasm) {
            try {
                this._inner.cancel();
                this._isCancelled = true;
                return;
            }
            catch (err) {
                console.warn(`WASM cancel failed, using JS fallback: ${err}`);
            }
        }
        if (!this._isCancelled) {
            this._isCancelled = true;
            this._controller.abort();
        }
    }
    get isCancelled() {
        if (this._useWasm) {
            try {
                return this._inner.isCancelled();
            }
            catch (err) {
                console.warn(`WASM isCancelled failed, using JS fallback: ${err}`);
            }
        }
        return this._isCancelled;
    }
    toString() {
        if (this._useWasm) {
            try {
                return Str.fromRaw(this._inner.toString());
            }
            catch (err) {
                console.warn(`WASM toString failed, using JS fallback: ${err}`);
            }
        }
        return Str.fromRaw(`[Task ${this._isCancelled ? "cancelled" : "active"}]`);
    }
    get [Symbol.toStringTag]() {
        return Str.fromRaw(Task._type);
    }
}
Task._type = "Task";
//# sourceMappingURL=task.js.map
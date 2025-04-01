import { Str } from "../types/string.js";
import { AppError } from "../core/error.js";
import { Option } from "../core/option.js";
import { u32 } from "../types/primitives.js";
import { initWasm, getWasmModule, isWasmInitialized } from "../wasm/init.js";
export class ChannelError extends AppError {
    constructor(message) {
        super(message);
    }
}
export class Sender {
    constructor(channel, wasmSender) {
        this._channel = channel;
        this._useWasm = isWasmInitialized() && !!wasmSender;
        if (this._useWasm) {
            this._inner = wasmSender;
        }
    }
    async send(value) {
        if (this._useWasm) {
            try {
                await this._inner.send(value);
                return;
            }
            catch (err) {
                if (err &&
                    typeof err === "object" &&
                    "name" in err &&
                    "message" in err &&
                    err.name === "ChannelError") {
                    throw new ChannelError(Str.fromRaw(String(err.message)));
                }
                console.warn(`WASM channel send failed, using JS fallback: ${err}`);
            }
        }
        await this._channel.send(value);
    }
    close() {
        if (this._useWasm) {
            try {
                this._inner.close();
                return;
            }
            catch (err) {
                console.warn(`WASM channel close failed, using JS fallback: ${err}`);
            }
        }
        this._channel.close();
    }
    get closed() {
        if (this._useWasm) {
            try {
                return this._inner.closed;
            }
            catch (err) {
                console.warn(`WASM channel closed check failed, using JS fallback: ${err}`);
            }
        }
        return this._channel.closed;
    }
    toString() {
        return Str.fromRaw(`[Sender ${this.closed ? "closed" : "active"}]`);
    }
    get [Symbol.toStringTag]() {
        return Str.fromRaw(Sender._type);
    }
}
Sender._type = "Sender";
export class Receiver {
    constructor(channel, wasmReceiver) {
        this._channel = channel;
        this._useWasm = isWasmInitialized() && !!wasmReceiver;
        if (this._useWasm) {
            this._inner = wasmReceiver;
        }
    }
    async receive() {
        if (this._useWasm) {
            try {
                const result = await this._inner.receive();
                if (result && typeof result === "object" && "isSome" in result) {
                    if (result.isSome) {
                        return Option.Some(result.value);
                    }
                    else {
                        return Option.None();
                    }
                }
                return Option.None();
            }
            catch (err) {
                console.warn(`WASM channel receive failed, using JS fallback: ${err}`);
            }
        }
        return this._channel.receive();
    }
    get closed() {
        if (this._useWasm) {
            try {
                return this._inner.closed;
            }
            catch (err) {
                console.warn(`WASM channel closed check failed, using JS fallback: ${err}`);
            }
        }
        return this._channel.closed;
    }
    toString() {
        return Str.fromRaw(`[Receiver ${this.closed ? "closed" : "active"}]`);
    }
    get [Symbol.toStringTag]() {
        return Str.fromRaw(Receiver._type);
    }
}
Receiver._type = "Receiver";
class Channel {
    constructor(capacity = u32(Infinity), wasmChannel) {
        this._queue = [];
        this._closed = false;
        this._senders = [];
        this._receivers = [];
        this._capacity = capacity;
        this._useWasm = isWasmInitialized() && !!wasmChannel;
        if (this._useWasm) {
            this._inner = wasmChannel;
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
    async send(value) {
        if (this._closed) {
            throw new ChannelError(Str.fromRaw("Cannot send on closed channel"));
        }
        if (this._queue.length >= this._capacity) {
            await new Promise((resolve, reject) => {
                const checkClosed = () => {
                    if (this._closed) {
                        reject(new ChannelError(Str.fromRaw("Cannot send on closed channel")));
                        return true;
                    }
                    return false;
                };
                if (checkClosed())
                    return;
                this._senders.push((error) => {
                    if (error) {
                        reject(error);
                    }
                    else if (!checkClosed()) {
                        resolve(null);
                    }
                });
            });
        }
        this._queue.push(value);
        if (this._receivers.length > 0) {
            const resolve = this._receivers.shift();
            resolve(null);
        }
    }
    async receive() {
        if (this._queue.length === 0) {
            if (this._closed) {
                return Option.None();
            }
            await new Promise((resolve) => {
                this._receivers.push(() => resolve());
            });
        }
        if (this._queue.length === 0) {
            return Option.None();
        }
        const value = this._queue.shift();
        if (this._senders.length > 0) {
            const resolve = this._senders.shift();
            resolve(null);
        }
        return Option.Some(value);
    }
    close() {
        this._closed = true;
        for (const resolve of this._senders) {
            resolve(new ChannelError(Str.fromRaw("Cannot send on closed channel")));
        }
        this._senders = [];
        for (const resolve of this._receivers) {
            resolve(null);
        }
        this._receivers = [];
    }
    get closed() {
        return this._closed;
    }
    toString() {
        return Str.fromRaw(`[Channel ${this._closed ? "closed" : "active"}]`);
    }
    get [Symbol.toStringTag]() {
        return Str.fromRaw(Channel._type);
    }
}
Channel._type = "Channel";
export async function createChannel(capacity = u32(Infinity)) {
    await Channel.init();
    if (isWasmInitialized()) {
        try {
            const wasmModule = getWasmModule();
            const result = wasmModule.createChannel(capacity);
            if (Array.isArray(result) && result.length === 2) {
                const wasmSender = result[0];
                const wasmReceiver = result[1];
                const jsChannel = new Channel(capacity);
                return [
                    new Sender(jsChannel, wasmSender),
                    new Receiver(jsChannel, wasmReceiver),
                ];
            }
        }
        catch (err) {
            console.warn(`WASM channel creation failed, using JS implementation: ${err}`);
        }
    }
    const channel = new Channel(capacity);
    return [new Sender(channel), new Receiver(channel)];
}
//# sourceMappingURL=channel.js.map
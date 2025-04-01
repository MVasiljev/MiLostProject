import { Str } from "../types/string.js";
import { AppError } from "../core/error.js";
import { Option } from "../core/option.js";
import { u32 } from "../types/primitives.js";
export declare class ChannelError extends AppError {
    constructor(message: Str);
}
export declare class Sender<T> {
    private _channel;
    private _inner;
    private _useWasm;
    static readonly _type = "Sender";
    constructor(channel: Channel<T>, wasmSender?: any);
    send(value: T): Promise<void>;
    close(): void;
    get closed(): boolean;
    toString(): Str;
    get [Symbol.toStringTag](): Str;
}
export declare class Receiver<T> {
    private _channel;
    private _inner;
    private _useWasm;
    static readonly _type = "Receiver";
    constructor(channel: Channel<T>, wasmReceiver?: any);
    receive(): Promise<Option<T>>;
    get closed(): boolean;
    toString(): Str;
    get [Symbol.toStringTag](): Str;
}
declare class Channel<T> {
    private _queue;
    private _closed;
    private _capacity;
    private _senders;
    private _receivers;
    private _inner;
    private _useWasm;
    static readonly _type = "Channel";
    constructor(capacity?: u32, wasmChannel?: any);
    static init(): Promise<void>;
    send(value: T): Promise<void>;
    receive(): Promise<Option<T>>;
    close(): void;
    get closed(): boolean;
    toString(): Str;
    get [Symbol.toStringTag](): Str;
}
export declare function createChannel<T>(capacity?: u32): Promise<[Sender<T>, Receiver<T>]>;
export {};

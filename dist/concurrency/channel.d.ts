import { Str } from '../types/string.js';
import { AppError } from '../core/error.js';
import { Option } from '../core/option.js';
import { u32 } from '../types/primitives.js';
export declare class ChannelError extends AppError {
    constructor(message: Str);
}
export declare class Sender<T> {
    private _channel;
    constructor(channel: Channel<T>);
    send(value: T): Promise<void>;
    close(): void;
    get closed(): boolean;
}
export declare class Receiver<T> {
    private _channel;
    constructor(channel: Channel<T>);
    receive(): Promise<Option<T>>;
    get closed(): boolean;
}
declare class Channel<T> {
    private _queue;
    private _closed;
    private _capacity;
    private _senders;
    private _receivers;
    constructor(capacity?: u32);
    send(value: T): Promise<void>;
    receive(): Promise<Option<T>>;
    close(): void;
    get closed(): boolean;
}
export declare function createChannel<T>(capacity?: u32): [Sender<T>, Receiver<T>];
export {};

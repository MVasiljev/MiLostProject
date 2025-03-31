import { Str } from '../types/string.js';
import { AppError } from '../core/error.js';
import { Option } from '../core/option.js';
import { u32 } from '../types/primitives.js';
export class ChannelError extends AppError {
    constructor(message) {
        super(message);
    }
}
export class Sender {
    _channel;
    constructor(channel) {
        this._channel = channel;
    }
    async send(value) {
        await this._channel.send(value);
    }
    close() {
        this._channel.close();
    }
    get closed() {
        return this._channel.closed;
    }
}
export class Receiver {
    _channel;
    constructor(channel) {
        this._channel = channel;
    }
    async receive() {
        return this._channel.receive();
    }
    get closed() {
        return this._channel.closed;
    }
}
class Channel {
    _queue = [];
    _closed = false;
    _capacity;
    _senders = [];
    _receivers = [];
    constructor(capacity = u32(Infinity)) {
        this._capacity = capacity;
    }
    async send(value) {
        if (this._closed) {
            throw new ChannelError(Str.fromRaw("Cannot send on closed channel"));
        }
        if (this._queue.length >= this._capacity) {
            await new Promise((resolve) => {
                this._senders.push(resolve);
            });
            if (this._closed) {
                throw new ChannelError(Str.fromRaw("Cannot send on closed channel"));
            }
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
                this._receivers.push(resolve);
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
            resolve(null);
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
}
export function createChannel(capacity = u32(Infinity)) {
    const channel = new Channel(capacity);
    return [new Sender(channel), new Receiver(channel)];
}

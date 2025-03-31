import { Str } from '../types/string.js';
import { AppError } from '../core/error.js';
import { Option } from '../core/option.js';
import { u32 } from '../types/primitives.js';

export class ChannelError extends AppError {
  constructor(message: Str) {
    super(message);
  }
}

export class Sender<T> {
  private _channel: Channel<T>;

  constructor(channel: Channel<T>) {
    this._channel = channel;
  }

  async send(value: T): Promise<void> {
    await this._channel.send(value);
  }

  close(): void {
    this._channel.close();
  }

  get closed(): boolean {
    return this._channel.closed;
  }
}

export class Receiver<T> {
  private _channel: Channel<T>;

  constructor(channel: Channel<T>) {
    this._channel = channel;
  }

  async receive(): Promise<Option<T>> {
    return this._channel.receive();
  }

  get closed(): boolean {
    return this._channel.closed;
  }
}

class Channel<T> {
  private _queue: T[] = [];
  private _closed: boolean = false;
  private _capacity: number;
  private _senders: ((value: unknown) => void)[] = [];
  private _receivers: ((value: unknown) => void)[] = [];

  constructor(capacity: u32 = u32(Infinity)) {
    this._capacity = capacity as unknown as number;
  }

  async send(value: T): Promise<void> {
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
      const resolve = this._receivers.shift()!;
      resolve(null);
    }
  }

  async receive(): Promise<Option<T>> {
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

    const value = this._queue.shift()!;

    if (this._senders.length > 0) {
      const resolve = this._senders.shift()!;
      resolve(null);
    }

    return Option.Some(value);
  }

  close(): void {
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

  get closed(): boolean {
    return this._closed;
  }
}

export function createChannel<T>(
  capacity: u32 = u32(Infinity)
): [Sender<T>, Receiver<T>] {
  const channel = new Channel<T>(capacity);
  return [new Sender(channel), new Receiver(channel)];
}

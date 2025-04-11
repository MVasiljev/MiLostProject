/**
 * Channel type implementation for MiLost
 *
 * Provides a type-safe, asynchronous channel communication system with
 * WebAssembly acceleration when available.
 */
import { AppError } from "../core/index.js";
import {
  registerModule,
  WasmModule,
  getWasmModule,
} from "../initWasm/registry.js";
import { u32 } from "../types/index.js";
import { Str } from "../types/string.js";
import { Option } from "../core/option.js";

/**
 * Module definition for Channel WASM implementation
 */
const channelModule: WasmModule = {
  name: "Channel",

  initialize(wasmModule: any) {
    console.log("Initializing Channel module with WASM...");

    if (typeof wasmModule.Channel === "object") {
      console.log("Found Channel module in WASM");

      const methods = [
        "createChannel",
        "send",
        "trySend",
        "receive",
        "tryReceive",
        "close",
      ];

      methods.forEach((method) => {
        if (typeof wasmModule.Channel[method] === "function") {
          console.log(`Found method: Channel.${method}`);
        } else {
          console.warn(`Missing method: Channel.${method}`);
        }
      });
    } else {
      console.warn("Channel module not found in WASM module");
      throw new Error("Required WASM functions not found for Channel module");
    }
  },

  fallback() {
    console.log("Using JavaScript fallback for Channel module");
  },
};

registerModule(channelModule);

/**
 * Custom error for channel-related operations
 */
export class ChannelError extends AppError {
  constructor(message: Str) {
    super(message);
  }
}

/**
 * Sender half of a channel
 */
export class Sender<T> {
  private _channel: Channel<T>;
  private _inner: any;
  private _useWasm: boolean;

  static readonly _type = "Sender";

  constructor(channel: Channel<T>, wasmSender?: any) {
    this._channel = channel;
    this._useWasm = false;

    const wasmModule = getWasmModule();
    if (wasmModule?.Channel && wasmSender) {
      try {
        this._inner = wasmSender;
        this._useWasm = true;
      } catch (err) {
        console.warn(
          `WASM Sender creation failed, using JS implementation: ${err}`
        );
        this._useWasm = false;
      }
    }
  }

  /**
   * Send a value through the channel
   * @param value The value to send
   */
  async send(value: T): Promise<void> {
    if (this._useWasm && this._inner) {
      try {
        await this._inner.send(value);
        return;
      } catch (err) {
        if (
          err &&
          typeof err === "object" &&
          "name" in err &&
          "message" in err &&
          err.name === "ChannelError"
        ) {
          throw new ChannelError(Str.fromRaw(String(err.message)));
        }
        console.warn(`WASM channel send failed, using JS fallback: ${err}`);
      }
    }

    await this._channel.send(value);
  }

  /**
   * Try to send a value without blocking
   * @param value The value to send
   * @returns True if send was successful
   */
  async trySend(value: T): Promise<boolean> {
    if (this._useWasm && this._inner) {
      try {
        return await this._inner.trySend(value);
      } catch (err) {
        console.warn(`WASM channel trySend failed, using JS fallback: ${err}`);
      }
    }

    return this._channel.trySend(value);
  }

  /**
   * Close the channel
   */
  close(): void {
    if (this._useWasm && this._inner) {
      try {
        this._inner.close();
        return;
      } catch (err) {
        console.warn(`WASM channel close failed, using JS fallback: ${err}`);
      }
    }

    this._channel.close();
  }

  /**
   * Check if the channel is closed
   */
  get closed(): boolean {
    if (this._useWasm && this._inner) {
      try {
        return this._inner.closed;
      } catch (err) {
        console.warn(
          `WASM channel closed check failed, using JS fallback: ${err}`
        );
      }
    }

    return this._channel.closed;
  }

  /**
   * Convert to string representation
   * @returns A Str representation of the Sender
   */
  toString(): Str {
    return Str.fromRaw(`[Sender ${this.closed ? "closed" : "active"}]`);
  }

  /**
   * Get the Symbol.toStringTag
   */
  get [Symbol.toStringTag](): Str {
    return Str.fromRaw(Sender._type);
  }
}

/**
 * Receiver half of a channel
 */
export class Receiver<T> {
  private _channel: Channel<T>;
  private _inner: any;
  private _useWasm: boolean;

  static readonly _type = "Receiver";

  constructor(channel: Channel<T>, wasmReceiver?: any) {
    this._channel = channel;
    this._useWasm = false;

    const wasmModule = getWasmModule();
    if (wasmModule?.Channel && wasmReceiver) {
      try {
        this._inner = wasmReceiver;
        this._useWasm = true;
      } catch (err) {
        console.warn(
          `WASM Receiver creation failed, using JS implementation: ${err}`
        );
        this._useWasm = false;
      }
    }
  }

  /**
   * Receive a value from the channel
   * @returns An Option containing the received value
   */
  async receive(): Promise<Option<T>> {
    if (this._useWasm && this._inner) {
      try {
        const result = await this._inner.receive();

        if (result && typeof result === "object" && "isSome" in result) {
          if (result.isSome) {
            return Option.Some(result.value as T);
          } else {
            return Option.None();
          }
        }

        return Option.None();
      } catch (err) {
        console.warn(`WASM channel receive failed, using JS fallback: ${err}`);
      }
    }

    return this._channel.receive();
  }

  /**
   * Try to receive a value without blocking
   * @returns An Option containing the received value
   */
  tryReceive(): Option<T> {
    if (this._useWasm && this._inner) {
      try {
        const result = this._inner.tryReceive();
        if (result && typeof result === "object" && "isSome" in result) {
          if (result.isSome) {
            return Option.Some(result.value as T);
          }
        }
        return Option.None();
      } catch (err) {
        console.warn(`WASM tryReceive failed, using JS fallback: ${err}`);
      }
    }

    return this._channel.tryReceive();
  }

  /**
   * Check if the channel is closed
   */
  get closed(): boolean {
    if (this._useWasm && this._inner) {
      try {
        return this._inner.closed;
      } catch (err) {
        console.warn(
          `WASM channel closed check failed, using JS fallback: ${err}`
        );
      }
    }

    return this._channel.closed;
  }

  /**
   * Convert to string representation
   * @returns A Str representation of the Receiver
   */
  toString(): Str {
    return Str.fromRaw(`[Receiver ${this.closed ? "closed" : "active"}]`);
  }

  /**
   * Get the Symbol.toStringTag
   */
  get [Symbol.toStringTag](): Str {
    return Str.fromRaw(Receiver._type);
  }
}

/**
 * Internal channel implementation
 */
class Channel<T> {
  private _queue: T[] = [];
  private _closed: boolean = false;
  private _capacity: number;
  private _senders: ((value: unknown) => void)[] = [];
  private _receivers: ((value: unknown) => void)[] = [];
  private _innerLock: boolean = false;
  private _inner: any;
  private _useWasm: boolean;

  static readonly _type = "Channel";

  /**
   * Create a new Channel
   * @param capacity Maximum number of items in the channel
   * @param wasmChannel Optional WASM channel implementation
   */
  constructor(capacity: u32 = u32(Infinity), wasmChannel?: any) {
    this._capacity = capacity as unknown as number;
    this._useWasm = false;

    const wasmModule = getWasmModule();
    if (wasmModule?.Channel && wasmChannel) {
      try {
        this._inner = wasmChannel;
        this._useWasm = true;
      } catch (err) {
        console.warn(
          `WASM Channel creation failed, using JS implementation: ${err}`
        );
        this._useWasm = false;
      }
    }
  }

  /**
   * Send a value through the channel
   * @param value The value to send
   */
  async send(value: T): Promise<void> {
    if (this._closed) {
      throw new ChannelError(Str.fromRaw("Cannot send on closed channel"));
    }

    if (this._queue.length >= this._capacity) {
      await new Promise<void>((resolve, reject) => {
        const checkClosed = () => {
          if (this._closed) {
            reject(
              new ChannelError(Str.fromRaw("Cannot send on closed channel"))
            );
            return true;
          }
          return false;
        };

        if (checkClosed()) return;

        this._senders.push((error?: unknown) => {
          if (error) {
            reject(error);
          } else if (!checkClosed()) {
            resolve();
          }
        });
      });
    }

    while (this._innerLock) {
      await new Promise((resolve) => setTimeout(resolve, 0));
    }

    this._innerLock = true;
    try {
      this._queue.push(value);

      if (this._receivers.length > 0) {
        const resolve = this._receivers.shift()!;
        resolve(null);
      }
    } finally {
      this._innerLock = false;
    }
  }

  /**
   * Try to send a value without blocking
   * @param value The value to send
   * @returns True if send was successful
   */
  trySend(value: T): boolean {
    if (this._closed || this._queue.length >= this._capacity) {
      return false;
    }

    if (this._innerLock) {
      return false;
    }

    this._innerLock = true;
    try {
      this._queue.push(value);

      if (this._receivers.length > 0) {
        const resolve = this._receivers.shift()!;
        resolve(null);
      }

      return true;
    } finally {
      this._innerLock = false;
    }
  }

  /**
   * Receive a value from the channel
   * @returns An Option containing the received value
   */
  async receive(): Promise<Option<T>> {
    if (this._queue.length === 0) {
      if (this._closed) {
        return Option.None();
      }

      await new Promise<void>((resolve) => {
        this._receivers.push(() => resolve());
      });
    }

    while (this._innerLock) {
      await new Promise((resolve) => setTimeout(resolve, 0));
    }

    this._innerLock = true;
    try {
      if (this._queue.length === 0) {
        return Option.None();
      }

      const value = this._queue.shift()!;

      if (this._senders.length > 0) {
        const resolve = this._senders.shift()!;
        resolve(null);
      }

      return Option.Some(value);
    } finally {
      this._innerLock = false;
    }
  }

  /**
   * Try to receive a value without blocking
   * @returns An Option containing the received value
   */
  tryReceive(): Option<T> {
    if (this._queue.length === 0) {
      return Option.None();
    }

    if (this._innerLock) {
      return Option.None();
    }

    this._innerLock = true;
    try {
      if (this._queue.length === 0) {
        return Option.None();
      }

      const value = this._queue.shift()!;

      if (this._senders.length > 0) {
        const resolve = this._senders.shift()!;
        resolve(null);
      }

      return Option.Some(value);
    } finally {
      this._innerLock = false;
    }
  }

  /**
   * Close the channel
   */
  close(): void {
    this._closed = true;

    while (this._innerLock) {}

    this._innerLock = true;
    try {
      for (const resolve of this._senders) {
        resolve(new ChannelError(Str.fromRaw("Cannot send on closed channel")));
      }
      this._senders = [];

      for (const resolve of this._receivers) {
        resolve(null);
      }
      this._receivers = [];
    } finally {
      this._innerLock = false;
    }
  }

  /**
   * Check if the channel is closed
   */
  get closed(): boolean {
    return this._closed;
  }

  /**
   * Convert to string representation
   * @returns A Str representation of the Channel
   */
  toString(): Str {
    return Str.fromRaw(`[Channel ${this._closed ? "closed" : "active"}]`);
  }

  /**
   * Get the Symbol.toStringTag
   */
  get [Symbol.toStringTag](): Str {
    return Str.fromRaw(Channel._type);
  }
}

/**
 * Create a new channel
 * @param capacity Maximum number of items in the channel
 * @returns A tuple of [Sender, Receiver]
 */
export async function createChannel<T>(
  capacity: u32 = u32(Infinity)
): Promise<[Sender<T>, Receiver<T>]> {
  const wasmModule = getWasmModule();
  if (wasmModule?.Channel?.createChannel) {
    try {
      const result = wasmModule.Channel.createChannel(capacity as any);

      if (Array.isArray(result) && result.length === 2) {
        const wasmSender = result[0];
        const wasmReceiver = result[1];

        const jsChannel = new Channel<T>(capacity);

        return [
          new Sender<T>(jsChannel, wasmSender),
          new Receiver<T>(jsChannel, wasmReceiver),
        ];
      }
    } catch (err) {
      console.warn(
        `WASM channel creation failed, using JS implementation: ${err}`
      );
    }
  }

  const channel = new Channel<T>(capacity);
  return [new Sender(channel), new Receiver(channel)];
}

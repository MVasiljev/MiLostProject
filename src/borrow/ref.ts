import { Str } from '../types/string.js';
import { OwnershipError } from './ownership.js';

export class Ref<T> {
  private _value: T;
  private _active: boolean = true;

  static readonly _type = "Ref";

  private constructor(value: T) {
    this._value = value;
  }

  static new<T>(value: T): Ref<T> {
    return new Ref(value);
  }

  get(): T {
    if (!this._active) {
      throw new OwnershipError(Str.fromRaw("Reference is no longer valid"));
    }
    return this._value;
  }

  drop(): void {
    this._active = false;
  }

  isActive(): boolean {
    return this._active;
  }

  toString(): Str {
    return Str.fromRaw(`[Ref ${this._active ? "active" : "dropped"}]`);
  }

  get [Symbol.toStringTag](): Str {
    return Str.fromRaw(Ref._type);
  }
}

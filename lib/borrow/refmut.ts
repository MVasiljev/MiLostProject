import { Str } from '../types/string.js';
import { OwnershipError } from './ownership.js';

export class RefMut<T> {
  private _value: T;
  private _active: boolean = true;

  static readonly _type = "RefMut";

  private constructor(value: T) {
    this._value = value;
  }

  static new<T>(value: T): RefMut<T> {
    return new RefMut(value);
  }

  get(): T {
    if (!this._active) {
      throw new OwnershipError(
        Str.fromRaw("Mutable reference is no longer valid")
      );
    }
    return this._value;
  }

  set(updater: (value: T) => T): void {
    if (!this._active) {
      throw new OwnershipError(
        Str.fromRaw("Mutable reference is no longer valid")
      );
    }
    this._value = updater(this._value);
  }

  drop(): void {
    this._active = false;
  }

  isActive(): boolean {
    return this._active;
  }

  toString(): Str {
    return Str.fromRaw(`[RefMut ${this._active ? "active" : "dropped"}]`);
  }

  get [Symbol.toStringTag](): Str {
    return Str.fromRaw(RefMut._type);
  }
}

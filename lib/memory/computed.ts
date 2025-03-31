function shallowEqual(a: unknown[], b: unknown[]): boolean {
  return a.length === b.length && a.every((val, i) => val === b[i]);
}

export class Computed<T> {
  private _value: T;
  private _watchValues: unknown[];
  private readonly _compute: () => T;

  static readonly _type = "Computed";

  constructor(compute: () => T, watchValues: unknown[]) {
    this._compute = compute;
    this._watchValues = [...watchValues];
    this._value = compute();
  }

  static from<U>(compute: () => U, watchValues: unknown[]): Computed<U> {
    return new Computed(compute, watchValues);
  }

  get(): T {
    return this._value;
  }

  update(newWatchValues: unknown[]) {
    if (!shallowEqual(this._watchValues, newWatchValues)) {
      this._watchValues = [...newWatchValues];
      this._value = this._compute();
    }
  }

  toJSON(): T {
    return this._value;
  }

  toString(): string {
    return `[Computed ${JSON.stringify(this._value)}]`;
  }

  get [Symbol.toStringTag]() {
    return Computed._type;
  }
}

export class Watcher<T> {
  private lastValue: T;

  constructor(
    private readonly watch: () => T,
    private readonly callback: (val: T) => void
  ) {
    this.lastValue = watch();
  }

  check(): void {
    const newValue = this.watch();
    if (newValue !== this.lastValue) {
      this.lastValue = newValue;
      this.callback(newValue);
    }
  }

  toString(): string {
    return `[Watcher]`;
  }

  get [Symbol.toStringTag]() {
    return "Watcher";
  }
}

export class AsyncEffect {
  private _active = true;

  constructor(effect: () => Promise<void>) {
    effect()
      .catch((err) => {
        if (this._active) console.error("AsyncEffect error:", err);
      })
      .finally(() => {
        this._active = false;
      });
  }

  cancel() {
    this._active = false;
  }

  get [Symbol.toStringTag]() {
    return "AsyncEffect";
  }
}

function shallowEqual(a, b) {
    return a.length === b.length && a.every((val, i) => val === b[i]);
}
export class Computed {
    _value;
    _watchValues;
    _compute;
    static _type = "Computed";
    constructor(compute, watchValues) {
        this._compute = compute;
        this._watchValues = [...watchValues];
        this._value = compute();
    }
    static from(compute, watchValues) {
        return new Computed(compute, watchValues);
    }
    get() {
        return this._value;
    }
    update(newWatchValues) {
        if (!shallowEqual(this._watchValues, newWatchValues)) {
            this._watchValues = [...newWatchValues];
            this._value = this._compute();
        }
    }
    toJSON() {
        return this._value;
    }
    toString() {
        return `[Computed ${JSON.stringify(this._value)}]`;
    }
    get [Symbol.toStringTag]() {
        return Computed._type;
    }
}
export class Watcher {
    watch;
    callback;
    lastValue;
    constructor(watch, callback) {
        this.watch = watch;
        this.callback = callback;
        this.lastValue = watch();
    }
    check() {
        const newValue = this.watch();
        if (newValue !== this.lastValue) {
            this.lastValue = newValue;
            this.callback(newValue);
        }
    }
    toString() {
        return `[Watcher]`;
    }
    get [Symbol.toStringTag]() {
        return "Watcher";
    }
}
export class AsyncEffect {
    _active = true;
    constructor(effect) {
        effect()
            .catch((err) => {
            if (this._active)
                console.error("AsyncEffect error:", err);
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

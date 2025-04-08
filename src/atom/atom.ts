import { Str } from "../types/string.js";
import { AppError } from "../core/error.js";
import { Result, Ok, Err } from "../core/result.js";
import { Option } from "../core/option.js";
import { RcRefCell, Rc } from "../memory/smart_pointers.js";
import { u32 } from "../types/primitives.js";
import { HashMap } from "../types/hash_map.js";
import { Vec } from "../types/vec.js";

export type Listener = () => void;
export type Unsubscribe = () => void;
export type StateUpdater<S> = (state: S) => S;
export type EqualityFn<T> = (a: T, b: T) => boolean;

export class AtomError extends AppError {
  constructor(message: Str) {
    super(message);
  }
}

export interface AtomManager<S> {
  getState(): S;
  setState(updater: StateUpdater<S>): void;
  subscribe(listener: Listener): Unsubscribe;
  resetState(): void;
  replaceState(newState: S): void;
}

export interface AtomOptions<S> {
  name?: Str;
  equalityFn?: EqualityFn<S>;
  storageKey?: Str;
  serialize?: (state: S) => Str;
  deserialize?: (serialized: Str) => S;
}

export type Middleware<S> = (
  manager: AtomManager<S>
) => (
  next: (updater: StateUpdater<S>) => void
) => (updater: StateUpdater<S>) => void;

export class Atom<S> implements AtomManager<S> {
  private readonly _initialState: S;
  private readonly _stateContainer: RcRefCell<S>;
  private readonly _listeners: RcRefCell<Vec<Listener>>;
  private readonly _options: AtomOptions<S>;
  private readonly _middleware: Vec<Middleware<S>>;
  private readonly _name: Str;

  static readonly _type = "Atom";

  private constructor(
    initialState: S,
    options: AtomOptions<S> = {},
    middleware: Vec<Middleware<S>> = Vec.empty()
  ) {
    this._initialState = initialState;
    this._options = options;
    this._middleware = middleware;
    this._name =
      options.name ||
      Str.fromRaw(`atom-${Math.random().toString(36).substring(2, 9)}`);

    let state = initialState;

    if (
      options.storageKey &&
      typeof window !== "undefined" &&
      window.localStorage
    ) {
      try {
        const serialize =
          options.serialize || ((s: S) => Str.fromRaw(JSON.stringify(s)));
        const deserialize =
          options.deserialize || ((s: Str) => JSON.parse(s.unwrap()) as S);
        const stored = localStorage.getItem(options.storageKey.unwrap());

        if (stored) {
          state = deserialize(Str.fromRaw(stored));
        }
      } catch (e) {
        console.error(
          `Error loading persisted state for ${options.storageKey.unwrap()}:`,
          e
        );
      }
    }

    this._stateContainer = RcRefCell.new(state);
    this._listeners = RcRefCell.new(Vec.empty<Listener>());
  }

  static async create<S>(
    initialState: S,
    options: AtomOptions<S> = {}
  ): Promise<Atom<S>> {
    const stateCell = await RcRefCell.new(initialState);
    const listeners = await RcRefCell.new(Vec.empty<Listener>());

    return new Atom(initialState, options);
  }

  getState(): S {
    return this._stateContainer.borrow();
  }

  setState(updater: StateUpdater<S>): void {
    const withMiddleware = this.applyMiddleware();
    withMiddleware(updater);
  }

  private applyMiddleware(): (updater: StateUpdater<S>) => void {
    const baseDispatch = (updater: StateUpdater<S>) => {
      const oldState = this._stateContainer.borrow();
      const newState = updater(oldState);

      const equalityFn = this._options.equalityFn || ((a, b) => a === b);

      if (!equalityFn(oldState, newState)) {
        this._stateContainer.borrow_mut(() => newState);

        if (
          this._options.storageKey &&
          typeof window !== "undefined" &&
          window.localStorage
        ) {
          try {
            const serialize =
              this._options.serialize ||
              ((s: S) => Str.fromRaw(JSON.stringify(s)));
            localStorage.setItem(
              this._options.storageKey.unwrap(),
              serialize(newState).unwrap()
            );
          } catch (e) {
            console.error(
              `Error persisting state for ${this._options.storageKey?.unwrap()}:`,
              e
            );
          }
        }

        this.notify();
      }
    };

    if (this._middleware.isEmpty()) {
      return baseDispatch;
    }

    return this._middleware.fold(baseDispatch, (dispatch, middleware) =>
      middleware(this)(dispatch)
    );
  }

  private notify(): void {
    this._listeners.borrow_mut((listeners) => {
      for (const listener of listeners) {
        try {
          listener();
        } catch (error) {
          console.error("Error in atom listener:", error);
        }
      }
      return listeners;
    });
  }

  subscribe(listener: Listener): Unsubscribe {
    this._listeners.borrow_mut((listeners) => listeners.push(listener));

    return () => {
      this._listeners.borrow_mut((listeners) =>
        listeners.filter((l) => l !== listener)
      );
    };
  }

  resetState(): void {
    const oldState = this._stateContainer.borrow();
    const equalityFn = this._options.equalityFn || ((a, b) => a === b);

    if (!equalityFn(oldState, this._initialState)) {
      this._stateContainer.borrow_mut(() => this._initialState);

      if (
        this._options.storageKey &&
        typeof window !== "undefined" &&
        window.localStorage
      ) {
        try {
          localStorage.removeItem(this._options.storageKey.unwrap());
        } catch (e) {
          console.error(
            `Error removing persisted state for ${this._options.storageKey?.unwrap()}:`,
            e
          );
        }
      }

      this.notify();
    }
  }

  replaceState(newState: S): void {
    const oldState = this._stateContainer.borrow();
    const equalityFn = this._options.equalityFn || ((a, b) => a === b);

    if (!equalityFn(oldState, newState)) {
      this._stateContainer.borrow_mut(() => newState);

      if (
        this._options.storageKey &&
        typeof window !== "undefined" &&
        window.localStorage
      ) {
        try {
          const serialize =
            this._options.serialize ||
            ((s: S) => Str.fromRaw(JSON.stringify(s)));
          localStorage.setItem(
            this._options.storageKey.unwrap(),
            serialize(newState).unwrap()
          );
        } catch (e) {
          console.error(
            `Error persisting state for ${this._options.storageKey?.unwrap()}:`,
            e
          );
        }
      }

      this.notify();
    }
  }

  withMiddleware(middleware: Middleware<S>): Atom<S> {
    return new Atom<S>(
      this._initialState,
      this._options,
      this._middleware.push(middleware)
    );
  }

  get name(): Str {
    return this._name;
  }

  toString(): Str {
    return Str.fromRaw(`[Atom name=${this._name.unwrap()}]`);
  }

  get [Symbol.toStringTag](): Str {
    return Str.fromRaw(Atom._type);
  }
}

export async function createAtom<S>(
  initialState: S,
  options: AtomOptions<S> = {}
): Promise<AtomManager<S>> {
  return Atom.create(initialState, options);
}

export function createAction<S, T>(
  atom: AtomManager<S>,
  handler: (state: S, payload: T) => S
): (payload: T) => void {
  return (payload: T) => {
    atom.setState((state) => handler(state, payload));
  };
}

export async function createAsyncAction<S, T, E extends AppError = AppError>(
  atom: AtomManager<S>,
  asyncFn: () => Promise<Result<T, E>>,
  handlers: {
    pending: (state: S) => S;
    fulfilled: (state: S, result: Result<T, E>) => S;
  }
): Promise<() => Promise<Result<T, E>>> {
  return async () => {
    atom.setState(handlers.pending);
    const result = await asyncFn();
    atom.setState((state) => handlers.fulfilled(state, result));
    return result;
  };
}

export class Selector<S, R> {
  private readonly _atom: AtomManager<S>;
  private readonly _select: (state: S) => R;
  private readonly _equalityFn: EqualityFn<R>;
  private _cachedState: Option<S>;
  private _cachedResult: Option<R>;

  static readonly _type = "Selector";

  private constructor(
    atom: AtomManager<S>,
    select: (state: S) => R,
    equalityFn: EqualityFn<R> = (a, b) => a === b
  ) {
    this._atom = atom;
    this._select = select;
    this._equalityFn = equalityFn;
    this._cachedState = Option.None();
    this._cachedResult = Option.None();
  }

  static create<S, R>(
    atom: AtomManager<S>,
    select: (state: S) => R,
    equalityFn: EqualityFn<R> = (a, b) => a === b
  ): Selector<S, R> {
    return new Selector(atom, select, equalityFn);
  }

  get(): R {
    const currentState = this._atom.getState();

    if (this._cachedState.isNone()) {
      const result = this._select(currentState);
      this._cachedState = Option.Some(currentState);
      this._cachedResult = Option.Some(result);
      return result;
    }

    if (currentState !== this._cachedState.unwrap()) {
      const newResult = this._select(currentState);

      if (this._cachedResult.isSome()) {
        const cached = this._cachedResult.unwrap();

        if (!this._equalityFn(cached, newResult)) {
          this._cachedResult = Option.Some(newResult);
          this._cachedState = Option.Some(currentState);
        }

        return newResult;
      }

      this._cachedResult = Option.Some(newResult);
      this._cachedState = Option.Some(currentState);
      return newResult;
    }

    return this._cachedResult.unwrap();
  }

  subscribe(listener: Listener): Unsubscribe {
    let currentValue = this.get();

    return this._atom.subscribe(() => {
      const newValue = this.get();

      if (!this._equalityFn(currentValue, newValue)) {
        currentValue = newValue;
        listener();
      }
    });
  }

  toString(): Str {
    return Str.fromRaw(`[Selector]`);
  }

  get [Symbol.toStringTag](): Str {
    return Str.fromRaw(Selector._type);
  }
}

export function createSelector<S, R>(
  atom: AtomManager<S>,
  select: (state: S) => R,
  equalityFn: EqualityFn<R> = (a, b) => a === b
): () => R {
  const selector = Selector.create(atom, select, equalityFn);
  return () => selector.get();
}

export async function deriveAtom<S, D>(
  sourceAtom: AtomManager<S>,
  derive: (sourceState: S) => D,
  options: AtomOptions<D> = {}
): Promise<AtomManager<D>> {
  const derivedAtom = await createAtom<D>(
    derive(sourceAtom.getState()),
    options
  );

  sourceAtom.subscribe(() => {
    const newDerivedState = derive(sourceAtom.getState());
    derivedAtom.replaceState(newDerivedState);
  });

  return derivedAtom;
}

export async function combineAtoms<T extends Record<string, AtomManager<any>>>(
  atomMap: T
): Promise<AtomManager<{ [K in keyof T]: ReturnType<T[K]["getState"]> }>> {
  type CombinedState = { [K in keyof T]: ReturnType<T[K]["getState"]> };

  const getInitialState = (): CombinedState => {
    const state: Record<string, any> = {};
    for (const key in atomMap) {
      state[key] = atomMap[key].getState();
    }
    return state as CombinedState;
  };

  const combinedAtom = await createAtom<CombinedState>(getInitialState());

  for (const key in atomMap) {
    atomMap[key].subscribe(() => {
      combinedAtom.setState((state) => ({
        ...state,
        [key]: atomMap[key].getState(),
      }));
    });
  }

  return combinedAtom;
}

export function createLoggerMiddleware<S>(
  name: Str = Str.fromRaw("atom")
): Middleware<S> {
  return () => (next) => (updater) => {
    const timestamp = new Date().toISOString();
    console.group(`${name.unwrap()} update @ ${timestamp}`);
    next(updater);
    console.groupEnd();
  };
}

export function createPersistMiddleware<S>(
  key: Str,
  options: {
    serialize?: (state: S) => Str;
    deserialize?: (serialized: Str) => S;
  } = {}
): Middleware<S> {
  const serialize =
    options.serialize || ((s: S) => Str.fromRaw(JSON.stringify(s)));
  const deserialize =
    options.deserialize || ((s: Str) => JSON.parse(s.unwrap()) as S);

  return (atomManager) => {
    if (typeof window !== "undefined" && window.localStorage) {
      try {
        const stored = localStorage.getItem(key.unwrap());
        if (stored) {
          const state = deserialize(Str.fromRaw(stored));
          atomManager.replaceState(state);
        }
      } catch (e) {
        console.error(`Error loading persisted state for ${key.unwrap()}:`, e);
      }
    }

    return (next) => (updater) => {
      next(updater);

      if (typeof window !== "undefined" && window.localStorage) {
        try {
          const state = atomManager.getState();
          localStorage.setItem(key.unwrap(), serialize(state).unwrap());
        } catch (e) {
          console.error(`Error persisting state for ${key.unwrap()}:`, e);
        }
      }
    };
  };
}

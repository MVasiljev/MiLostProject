import { AtomManager, Listener, StateUpdater } from "./atom.js";
import { Str } from "../types/string.js";
import { AppError } from "../core/error.js";
import { Option } from "../core/option.js";

export class IntegrationError extends AppError {
  constructor(message: Str) {
    super(message);
  }
}

export interface Store<T> {
  getState(): T;
  subscribe(listener: Listener): () => void;
}

export interface WritableStore<T> extends Store<T> {
  setState(updater: StateUpdater<T>): void;
}

export function createStoreAdapter<S>(atom: AtomManager<S>): WritableStore<S> {
  return {
    getState: () => atom.getState(),
    setState: (updater) => atom.setState(updater),
    subscribe: (listener) => atom.subscribe(listener),
  };
}

export type Action<T = any> = {
  type: Str;
  payload?: T;
};

export type Reducer<S, A extends Action> = (state: S, action: A) => S;

export function createReducerAtom<S, A extends Action>(
  reducer: Reducer<S, A>,
  initialState: S
): [AtomManager<S>, (action: A) => void] {
  const stateContainer = { current: initialState };
  const listeners: Set<Listener> = new Set();

  const atom: AtomManager<S> = {
    getState: () => stateContainer.current,

    setState: (updater) => {
      const oldState = stateContainer.current;
      stateContainer.current = updater(oldState);

      if (oldState !== stateContainer.current) {
        listeners.forEach((listener) => listener());
      }
    },

    subscribe: (listener) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },

    resetState: () => {
      stateContainer.current = initialState;
      listeners.forEach((listener) => listener());
    },

    replaceState: (newState) => {
      stateContainer.current = newState;
      listeners.forEach((listener) => listener());
    },
  };

  const dispatch = (action: A) => {
    atom.setState((state) => reducer(state, action));
  };

  return [atom, dispatch];
}

export interface Observable<T> {
  subscribe(observer: { next: (value: T) => void }): {
    unsubscribe: () => void;
  };
}

export function fromObservable<T>(
  observable: Observable<T>
): Promise<AtomManager<Option<T>>> {
  return new Promise((resolve) => {
    const stateContainer = { current: Option.None<T>() };
    const listeners: Set<Listener> = new Set();

    const subscription = observable.subscribe({
      next: (value) => {
        stateContainer.current = Option.Some(value);
        listeners.forEach((listener) => listener());
      },
    });

    const atom: AtomManager<Option<T>> = {
      getState: () => stateContainer.current,

      setState: (updater) => {
        const oldState = stateContainer.current;
        stateContainer.current = updater(oldState);

        if (oldState !== stateContainer.current) {
          listeners.forEach((listener) => listener());
        }
      },

      subscribe: (listener) => {
        listeners.add(listener);
        return () => {
          listeners.delete(listener);

          if (listeners.size === 0) {
            subscription.unsubscribe();
          }
        };
      },

      resetState: () => {
        stateContainer.current = Option.None<T>();
        listeners.forEach((listener) => listener());
      },

      replaceState: (newState) => {
        stateContainer.current = newState;
        listeners.forEach((listener) => listener());
      },
    };

    resolve(atom);
  });
}

export function toObservable<T>(atom: AtomManager<T>): Observable<T> {
  return {
    subscribe(observer: { next: (value: T) => void }) {
      observer.next(atom.getState());

      const unsubscribe = atom.subscribe(() => {
        observer.next(atom.getState());
      });

      return {
        unsubscribe,
      };
    },
  };
}

export function createAtomSlice<S, K extends keyof S>(
  atom: AtomManager<S>,
  key: K
): AtomManager<S[K]> {
  return {
    getState: () => atom.getState()[key],

    setState: (updater) => {
      atom.setState((state) => {
        const sliceState = state[key];
        const newSliceState = updater(sliceState);

        if (sliceState === newSliceState) {
          return state;
        }

        return { ...state, [key]: newSliceState };
      });
    },

    subscribe: (listener) => {
      let prevSliceState = atom.getState()[key];

      return atom.subscribe(() => {
        const newSliceState = atom.getState()[key];

        if (prevSliceState !== newSliceState) {
          prevSliceState = newSliceState;
          listener();
        }
      });
    },

    resetState: () => {
      const initialSliceState = atom.getState()[key];
      atom.setState((state) => ({ ...state, [key]: initialSliceState }));
    },

    replaceState: (newState) => {
      atom.setState((state) => ({ ...state, [key]: newState }));
    },
  };
}

export function createAtomSliceWithOptions<S, T>(
  atom: AtomManager<S>,
  options: {
    get: (state: S) => T;
    set: (state: S, sliceState: T) => S;
  }
): AtomManager<T> {
  return {
    getState: () => options.get(atom.getState()),

    setState: (updater) => {
      atom.setState((state) => {
        const sliceState = options.get(state);
        const newSliceState = updater(sliceState);

        if (sliceState === newSliceState) {
          return state;
        }

        return options.set(state, newSliceState);
      });
    },

    subscribe: (listener) => {
      let prevSliceState = options.get(atom.getState());

      return atom.subscribe(() => {
        const newSliceState = options.get(atom.getState());

        if (prevSliceState !== newSliceState) {
          prevSliceState = newSliceState;
          listener();
        }
      });
    },

    resetState: () => {
      atom.setState((state) => {
        const initialSliceState = options.get(atom.getState());
        return options.set(state, initialSliceState);
      });
    },

    replaceState: (newState: T) => {
      atom.setState((state) => options.set(state, newState));
    },
  };
}

export function createStoreFactory<
  T extends Record<string, AtomManager<any>>
>() {
  return {
    createStore(atoms: T) {
      return {
        atoms,
        getState(): { [P in keyof T]: ReturnType<T[P]["getState"]> } {
          const state: Record<string, any> = {};

          for (const key in atoms) {
            if (Object.prototype.hasOwnProperty.call(atoms, key)) {
              state[key] = atoms[key].getState();
            }
          }

          return state as { [P in keyof T]: ReturnType<T[P]["getState"]> };
        },

        subscribe(listener: Listener): () => void {
          const unsubscribes: Array<() => void> = [];

          for (const atom of Object.values(atoms)) {
            unsubscribes.push(atom.subscribe(listener));
          }

          return () => {
            unsubscribes.forEach((unsubscribe) => unsubscribe());
          };
        },
      };
    },
  };
}

export function bindToFramework<S>(
  atom: AtomManager<S>,
  options: {
    onChange?: (state: S) => void;
    framework?: "vue" | "svelte" | "solid" | "generic";
  } = {}
) {
  if (options.framework === "vue") {
    return {
      state: atom.getState(),

      update(updater: StateUpdater<S>) {
        atom.setState(updater);
      },

      setup() {
        const unsubscribe = atom.subscribe(() => {
          this.state = atom.getState();

          if (options.onChange) {
            options.onChange(this.state);
          }
        });

        return {
          unsubscribe,
        };
      },

      beforeUnmount(context: { unsubscribe: () => void }) {
        context.unsubscribe();
      },
    };
  }

  if (options.framework === "svelte") {
    return {
      subscribe(run: (value: S) => void) {
        run(atom.getState());

        const unsubscribe = atom.subscribe(() => {
          run(atom.getState());
        });

        return unsubscribe;
      },

      set(newState: S) {
        atom.replaceState(newState);
      },

      update(updater: StateUpdater<S>) {
        atom.setState(updater);
      },
    };
  }

  if (options.framework === "solid") {
    return [
      () => atom.getState(),
      (updater: StateUpdater<S>) => atom.setState(updater),
    ];
  }

  return {
    get state() {
      return atom.getState();
    },

    setState(updater: StateUpdater<S>) {
      atom.setState(updater);
    },

    subscribe(listener: Listener) {
      return atom.subscribe(listener);
    },
  };
}

export function createSubscriber<S>(atom: AtomManager<S>) {
  return function subscribe<K extends keyof S>(
    key: K,
    callback: (value: S[K]) => void
  ): () => void {
    let prevValue = atom.getState()[key];
    callback(prevValue);

    return atom.subscribe(() => {
      const newValue = atom.getState()[key];
      if (prevValue !== newValue) {
        prevValue = newValue;
        callback(newValue);
      }
    });
  };
}

export function createComputed<S, R>(
  atom: AtomManager<S>,
  computeFn: (state: S) => R,
  equalityFn: (a: R, b: R) => boolean = (a, b) => a === b
): () => R {
  let lastState: S | undefined;
  let lastResult: R | undefined;

  return () => {
    const currentState = atom.getState();

    if (
      lastState === undefined ||
      lastResult === undefined ||
      !equalityFn(computeFn(lastState), computeFn(currentState))
    ) {
      lastState = currentState;
      lastResult = computeFn(currentState);
    }

    return lastResult;
  };
}

export interface BatchUpdatesOptions {
  debounce?: number;
}

export function createBatchUpdates<S>(
  atom: AtomManager<S>,
  options: BatchUpdatesOptions = {}
) {
  let updates: StateUpdater<S>[] = [];
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return {
    update(updater: StateUpdater<S>): void {
      updates.push(updater);

      if (options.debounce !== undefined) {
        if (timeout) {
          clearTimeout(timeout);
        }

        timeout = setTimeout(() => {
          this.flush();
        }, options.debounce);
      }
    },

    flush(): void {
      if (updates.length === 0) return;

      atom.setState((state) => {
        return updates.reduce((s, update) => update(s), state);
      });

      updates = [];

      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
    },
  };
}

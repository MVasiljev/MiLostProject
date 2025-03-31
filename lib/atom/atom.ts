import { AppError } from '../core/error.js';
import { Result } from '../core/result.js';

export interface AtomManager<S> {
  getState(): S;
  setState(updater: (state: S) => S): void;
  subscribe(listener: () => void): () => void;
  resetState(): void;
  replaceState(newState: S): void;
}

export function createAtom<S>(initialState: S): AtomManager<S> {
  const _initialState = initialState;
  const stateContainer = { current: initialState };
  const listeners: Set<() => void> = new Set();

  return {
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
      stateContainer.current = _initialState;
      listeners.forEach((listener) => listener());
    },

    replaceState: (newState) => {
      stateContainer.current = newState;
      listeners.forEach((listener) => listener());
    },
  };
}

export function createAction<S, T>(
  atom: AtomManager<S>,
  handler: (state: S, payload: T) => S
) {
  return (payload: T) => {
    atom.setState((state) => handler(state, payload));
  };
}

export function createAsyncAction<S, T, E extends AppError = AppError>(
  atom: AtomManager<S>,
  asyncFn: () => Promise<Result<T, E>>,
  handlers: {
    pending: (state: S) => S;
    fulfilled: (state: S, result: Result<T, E>) => S;
  }
) {
  return async () => {
    atom.setState(handlers.pending);
    const result = await asyncFn();
    atom.setState((state) => handlers.fulfilled(state, result));
    return result;
  };
}

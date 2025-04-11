import { AtomManager, StateUpdater } from "./atom.js";
import { AtomContext } from "./atomContext.js";
import { Str } from "../types/string.js";

export interface Provider<T> {
  provide: (value: T) => void;
  inject: () => T;
}

export function createProvider<T>(): Provider<T> {
  let currentValue: T | undefined;

  return {
    provide: (value: T) => {
      currentValue = value;
    },
    inject: () => {
      if (currentValue === undefined) {
        throw new Error("Provider value not set");
      }
      return currentValue;
    },
  };
}

const globalAtoms: Map<string, AtomManager<any>> = new Map();

export function registerGlobalAtom<T>(
  key: string,
  atom: AtomManager<T>
): AtomManager<T> {
  globalAtoms.set(key, atom);
  return atom;
}

export function getGlobalAtom<T>(key: string): AtomManager<T> | undefined {
  return globalAtoms.get(key) as AtomManager<T> | undefined;
}

export function clearGlobalAtoms(): void {
  globalAtoms.clear();
}

export function createStoreFacade<S>(atom: AtomManager<S>) {
  return {
    getState: () => atom.getState(),
    setState: atom.setState,
    subscribe: atom.subscribe,
    dispatch: (action: { type: string; payload?: any }) => {
      atom.setState((state) => {
        return { ...state, lastAction: action } as any;
      });
      return action;
    },
  };
}

export function createSimpleContext<T>(defaultValue: T) {
  let value = defaultValue;
  const listeners = new Set<(value: T) => void>();

  return {
    setValue: (newValue: T) => {
      value = newValue;
      listeners.forEach((listener) => listener(value));
    },

    getValue: () => value,

    subscribe: (listener: (value: T) => void) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };
}

export interface FrameworkAdapter<T> {
  connectAtom: <S>(atom: AtomManager<S>) => any;
  provideContext: <S extends Record<string, any>>(
    context: AtomContext<S>
  ) => any;
  injectContext: <S extends Record<string, any>>() => AtomContext<S>;
}

export function createUiUpdater<S>(atom: AtomManager<S>) {
  return {
    connect: <R>(
      selector: (state: S) => R,
      renderer: (selectedState: R) => void,
      equalityFn = (a: R, b: R) => a === b
    ) => {
      let currentSelectedState = selector(atom.getState());
      renderer(currentSelectedState);

      return atom.subscribe(() => {
        const newSelectedState = selector(atom.getState());
        if (!equalityFn(currentSelectedState, newSelectedState)) {
          currentSelectedState = newSelectedState;
          renderer(newSelectedState);
        }
      });
    },
  };
}

export function createMonitor<S>(atom: AtomManager<S>, name: string = "Atom") {
  const history: Array<{ state: S; timestamp: number }> = [];

  const unsubscribe = atom.subscribe(() => {
    history.push({
      state: atom.getState(),
      timestamp: Date.now(),
    });

    if (typeof window !== "undefined" && window.localStorage) {
      try {
        const lastStates = history.slice(-20);
        localStorage.setItem(
          `milost-debug-${name}`,
          JSON.stringify(lastStates)
        );
      } catch (e) {
        console.error(`Error storing debug info for ${name}:`, e);
      }
    }
  });

  return {
    getHistory: () => history,
    getLastUpdate: () => history[history.length - 1],
    stop: unsubscribe,
  };
}

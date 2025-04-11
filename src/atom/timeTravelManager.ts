import { AtomManager, StateUpdater, Middleware } from "./atom.js";
import { Str } from "../types/string.js";
import { Vec } from "../types/vec.js";
import { u32 } from "../types/primitives.js";

interface HistoryEntry<S> {
  state: S;
  timestamp: number;
  actionType: Str;
}

export interface TimeTravelManager<S> {
  undo(): void;
  redo(): void;
  jumpToState(index: u32): void;
  getHistory(): Vec<HistoryEntry<S>>;
  canUndo(): boolean;
  canRedo(): boolean;
  clearHistory(): void;
}

export function createTimeTravelEnhancer<S>(
  maxHistorySize: u32 = u32(50)
): (atom: AtomManager<S>) => AtomManager<S> & TimeTravelManager<S> {
  return (atom) => {
    let history: Vec<HistoryEntry<S>> = Vec.empty();
    let currentIndex: u32 = u32(0);
    let ignoreNextUpdate: boolean = false;

    history = history.push({
      state: atom.getState(),
      timestamp: Date.now(),
      actionType: Str.fromRaw("INIT"),
    });

    const enhancedAtom: AtomManager<S> & TimeTravelManager<S> = {
      getState: () => atom.getState(),

      setState: (updater: StateUpdater<S>) => {
        if (ignoreNextUpdate) {
          ignoreNextUpdate = false;
          atom.setState(updater);
          return;
        }

        atom.setState(updater);

        const newState = atom.getState();
        const actionType =
          typeof updater.name === "string"
            ? Str.fromRaw(updater.name)
            : Str.fromRaw("UNKNOWN");

        if (Number(currentIndex) < Number(history.len()) - 1) {
          history = history.filter(
            (_, idx) => Number(idx) <= Number(currentIndex)
          );
        }

        history = history.push({
          state: newState,
          timestamp: Date.now(),
          actionType,
        });

        if (Number(history.len()) > Number(maxHistorySize)) {
          history = history.drop(u32(1));
        }

        currentIndex = u32(Number(history.len()) - 1);
      },

      subscribe: (listener) => atom.subscribe(listener),
      resetState: () => atom.resetState(),
      replaceState: (newState) => atom.replaceState(newState),

      undo: () => {
        if (!enhancedAtom.canUndo()) return;

        currentIndex = u32(Number(currentIndex) - 1);
        const entryOption = history.get(currentIndex);

        if (entryOption.isSome()) {
          ignoreNextUpdate = true;
          atom.replaceState(entryOption.unwrap().state);
        }
      },

      redo: () => {
        if (!enhancedAtom.canRedo()) return;

        currentIndex = u32(Number(currentIndex) + 1);
        const entryOption = history.get(currentIndex);

        if (entryOption.isSome()) {
          ignoreNextUpdate = true;
          atom.replaceState(entryOption.unwrap().state);
        }
      },

      jumpToState: (index: u32) => {
        if (Number(index) < 0 || Number(index) >= Number(history.len())) return;

        currentIndex = index;
        const entryOption = history.get(currentIndex);

        if (entryOption.isSome()) {
          ignoreNextUpdate = true;
          atom.replaceState(entryOption.unwrap().state);
        }
      },

      getHistory: () => history,

      canUndo: () => Number(currentIndex) > 0,

      canRedo: () => Number(currentIndex) < Number(history.len()) - 1,

      clearHistory: () => {
        const currentState = atom.getState();
        history = Vec.from<HistoryEntry<S>>([
          {
            state: currentState,
            timestamp: Date.now(),
            actionType: Str.fromRaw("HISTORY_CLEARED"),
          },
        ]);
        currentIndex = u32(0);
      },
    };

    return enhancedAtom;
  };
}

export function createTimeTravelMiddleware<S>(): Middleware<S> {
  return (atomManager) => {
    let history: Vec<S> = Vec.empty();
    let currentIndex: u32 = u32(0);
    let recording = true;

    return (next) => (updater) => {
      if (recording) {
        const prevState = atomManager.getState();

        next(updater);

        if (Number(currentIndex) < Number(history.len()) - 1) {
          history = history.filter(
            (_, idx) => Number(idx) <= Number(currentIndex)
          );
        }

        history = history.push(prevState);
        currentIndex = u32(Number(history.len()) - 1);
      } else {
        next(updater);
      }
    };
  };
}

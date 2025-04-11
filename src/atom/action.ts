import { AtomManager, StateUpdater, createAtom } from "./atom.js";
import { Str } from "../types/string.js";
import { Result, Ok, Err } from "../core/result.js";
import { AppError } from "../core/error.js";
import { Vec } from "../types/vec.js";
import { Option } from "../core/option.js";
import { StrRecord } from "../types/common.js";

export interface Action<T = any> {
  type: Str;
  payload?: T;
  meta?: StrRecord<any>;
  error?: boolean;
}

export type ActionCreator<
  P = void,
  A extends Action = Action<P>
> = P extends void ? () => A : (payload: P) => A;

export type AsyncActionCreator<
  P = void,
  R = any,
  E extends AppError = AppError
> = P extends void
  ? () => Promise<Result<R, E>>
  : (payload: P) => Promise<Result<R, E>>;

export type Reducer<S, A extends Action = Action> = (state: S, action: A) => S;

export type Thunk<S, R = void> = (
  dispatch: (action: Action) => void,
  getState: () => S
) => R;

export class ActionError extends AppError {
  constructor(message: Str) {
    super(message);
  }
}

export function createStandardAction<P = void>(type: Str): ActionCreator<P> {
  return ((payload?: P) => ({
    type,
    payload,
  })) as ActionCreator<P>;
}

export interface ReduxStyleStore<S> {
  getState: () => S;
  dispatch: (action: Action | Thunk<S>) => any;
  subscribe: (listener: () => void) => () => void;
  replaceReducer: (newReducer: Reducer<S, Action>) => void;
}

export async function createReducerStore<S>(
  reducer: Reducer<S>,
  initialState: S,
  middleware: Vec<
    (
      store: ReduxStyleStore<S>
    ) => (next: (action: Action) => any) => (action: Action | Thunk<S>) => any
  > = Vec.empty()
): Promise<ReduxStyleStore<S>> {
  const atom = await createAtom<S>(initialState);

  const store: ReduxStyleStore<S> = {
    getState: () => atom.getState(),

    dispatch: (action: Action | Thunk<S>): any => {
      if (typeof action === "function") {
        return (action as Thunk<S>)(store.dispatch, store.getState);
      }

      atom.setState((state) => reducer(state, action as Action));
      return action;
    },

    subscribe: (listener) => atom.subscribe(listener),

    replaceReducer: (newReducer: Reducer<S, Action>) => {
      reducer = newReducer;
    },
  };

  if (!middleware.isEmpty()) {
    let finalDispatch: (action: Action | Thunk<S>) => any = store.dispatch;

    middleware.forEach((middlewareFn) => {
      finalDispatch = middlewareFn(store)(finalDispatch);
    });

    store.dispatch = finalDispatch;
  }

  return store;
}

export function createThunkMiddleware<S>() {
  return (store: ReduxStyleStore<S>) =>
    (next: (action: Action | Thunk<S>) => any) =>
    (action: Action | Thunk<S>): any => {
      if (typeof action === "function") {
        return (action as Thunk<S>)(store.dispatch, store.getState);
      }

      return next(action);
    };
}

export function createAsyncActionCreators<P, R, E extends AppError = AppError>(
  typePrefix: Str
) {
  const pending = createStandardAction<P>(
    typePrefix.concat(Str.fromRaw("/pending"))
  );
  const fulfilled = createStandardAction<R>(
    typePrefix.concat(Str.fromRaw("/fulfilled"))
  );
  const rejected = createStandardAction<E>(
    typePrefix.concat(Str.fromRaw("/rejected"))
  );

  return {
    pending,
    fulfilled,
    rejected,
    async execute(
      asyncFn: (payload: P) => Promise<Result<R, E>>,
      payload: P,
      dispatch: (action: Action) => void
    ): Promise<Result<R, E>> {
      dispatch(pending(payload));

      const result = await asyncFn(payload);

      if (result.isOk()) {
        dispatch(fulfilled(result.unwrap()));
        return result;
      } else {
        if (result.isErr()) {
          dispatch(rejected(result.getError() as E));
        }
        return result;
      }
    },
  };
}

export function combineReducers<S extends StrRecord<any>>(reducers: {
  [K in keyof S]: Reducer<S[K]>;
}): Reducer<S> {
  return (state: S = {} as S, action: Action) => {
    const nextState: Partial<S> = {};
    let hasChanged = false;

    for (const key in reducers) {
      const reducer = reducers[key];
      const previousStateForKey = state[key];
      const nextStateForKey = reducer(previousStateForKey, action);

      nextState[key] = nextStateForKey;
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
    }

    return hasChanged ? ({ ...state, ...nextState } as S) : state;
  };
}

export async function atomsToStore<T extends StrRecord<AtomManager<any>>>(
  atoms: T
): Promise<ReduxStyleStore<{ [K in keyof T]: ReturnType<T[K]["getState"]> }>> {
  type CombinedState = { [K in keyof T]: ReturnType<T[K]["getState"]> };

  const getState = (): CombinedState => {
    const state: StrRecord<any> = {};
    for (const key in atoms) {
      state[key] = atoms[key].getState();
    }
    return state as CombinedState;
  };

  const dispatch = (action: Action | Thunk<CombinedState>): any => {
    if (typeof action === "function") {
      return (action as Thunk<CombinedState>)(dispatch, getState);
    }

    const typeParts = action.type.unwrap().split("/");
    const atomKey = typeParts[0];

    if (atomKey in atoms) {
      const atom = atoms[atomKey];
      const actionType = typeParts.length > 1 ? typeParts[1] : "";

      atom.setState((state) => {
        return state;
      });
    }

    return action;
  };

  const subscribe = (listener: () => void): (() => void) => {
    const unsubscribes: Vec<() => void> = Vec.from<() => void>([]);

    for (const key in atoms) {
      const unsubscribe = atoms[key].subscribe(listener);
      unsubscribes.push(unsubscribe);
    }

    return () => {
      unsubscribes.forEach((unsubscribe) => unsubscribe());
    };
  };

  const store: ReduxStyleStore<CombinedState> = {
    getState,
    dispatch,
    subscribe,
    replaceReducer: () => {
      throw new ActionError(
        Str.fromRaw("replaceReducer not implemented for atomsToStore")
      );
    },
  };

  return store;
}

import { AppError } from '../core/error.js';
import { Result } from '../core/result.js';
export interface AtomManager<S> {
    getState(): S;
    setState(updater: (state: S) => S): void;
    subscribe(listener: () => void): () => void;
    resetState(): void;
    replaceState(newState: S): void;
}
export declare function createAtom<S>(initialState: S): AtomManager<S>;
export declare function createAction<S, T>(atom: AtomManager<S>, handler: (state: S, payload: T) => S): (payload: T) => void;
export declare function createAsyncAction<S, T, E extends AppError = AppError>(atom: AtomManager<S>, asyncFn: () => Promise<Result<T, E>>, handlers: {
    pending: (state: S) => S;
    fulfilled: (state: S, result: Result<T, E>) => S;
}): () => Promise<Result<T, E>>;

export function createAtom(initialState) {
    const _initialState = initialState;
    const stateContainer = { current: initialState };
    const listeners = new Set();
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
export function createAction(atom, handler) {
    return (payload) => {
        atom.setState((state) => handler(state, payload));
    };
}
export function createAsyncAction(atom, asyncFn, handlers) {
    return async () => {
        atom.setState(handlers.pending);
        const result = await asyncFn();
        atom.setState((state) => handlers.fulfilled(state, result));
        return result;
    };
}

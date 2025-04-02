export declare function createAtomContext<T extends Record<string, any>>(atoms: T): {
    getAtoms: () => Promise<T>;
    setAtoms: (updater: (prev: T) => T) => Promise<void>;
    clone: () => {
        getAtoms: () => Promise<T>;
        setAtoms: (updater: (prev: T) => T) => Promise<void>;
        clone: /*elided*/ any;
    };
};

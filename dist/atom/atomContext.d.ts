export declare function createAtomContext<T extends Record<string, any>>(atoms: T): {
    getAtoms: () => T;
    setAtoms: (updater: (prev: T) => void) => void;
    clone: () => {
        getAtoms: () => T;
        setAtoms: (updater: (prev: T) => void) => void;
        clone: /*elided*/ any;
    };
};

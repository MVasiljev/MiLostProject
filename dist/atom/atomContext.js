import { memory } from '../index.js';
export function createAtomContext(atoms) {
    const atomsContainer = memory.createRcRefCell(atoms);
    const arc = memory.createArc({ atoms });
    function getAtoms() {
        return atomsContainer.borrow();
    }
    function setAtoms(updater) {
        atomsContainer.borrow_mut(updater);
    }
    const atomGetters = {};
    for (const [key, atom] of Object.entries(atoms)) {
        if (typeof atom === "function") {
            atomGetters[key] = () => atom;
        }
    }
    return {
        getAtoms,
        setAtoms,
        clone: () => createAtomContext(atoms),
        ...atomGetters,
    };
}

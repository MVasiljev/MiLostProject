import { memory } from "../index.js";
export function createAtomContext(atoms) {
    const atomsContainer = memory.createRcRefCell(atoms);
    memory.createArc({ atoms });
    async function getAtoms() {
        return (await atomsContainer).borrow();
    }
    async function setAtoms(updater) {
        (await atomsContainer).borrow_mut(updater);
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
//# sourceMappingURL=atomContext.js.map
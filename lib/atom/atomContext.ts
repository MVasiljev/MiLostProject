import { memory } from '../index.js';

export function createAtomContext<T extends Record<string, any>>(atoms: T) {
  const atomsContainer = memory.createRcRefCell(atoms);
  const arc = memory.createArc({ atoms });

  function getAtoms(): T {
    return atomsContainer.borrow();
  }

  function setAtoms(updater: (prev: T) => void) {
    atomsContainer.borrow_mut(updater);
  }

  const atomGetters: Record<string, () => unknown> = {};
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

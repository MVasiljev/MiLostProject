import { memory } from "../index.js";

export function createAtomContext<T extends Record<string, any>>(atoms: T) {
  const atomsContainer = memory.createRcRefCell(atoms);
  memory.createArc({ atoms });

  async function getAtoms(): Promise<T> {
    return (await atomsContainer).borrow();
  }

  async function setAtoms(updater: (prev: T) => T) {
    (await atomsContainer).borrow_mut(updater);
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

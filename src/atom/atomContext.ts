import { memory } from "../index.js";
import { AtomManager } from "./atom.js";
import { Result, Ok, Err } from "../core/result.js";
import { Str } from "../types/string.js";
import { Option } from "../core/option.js";
import { Vec } from "../types/vec.js";
import { HashMap } from "../types/hash_map.js";
import { AppError } from "../core/error.js";

export class AtomContextError extends AppError {
  constructor(message: Str) {
    super(message);
  }
}

export type AtomRecord<T extends Record<string, any>> = {
  [K in keyof T]: AtomManager<T[K]>;
};

export interface AtomContext<T extends Record<string, any>> {
  getAtoms(): Promise<Result<AtomRecord<T>, AtomContextError>>;
  getAtom<K extends keyof T>(
    key: K
  ): Promise<Result<AtomManager<T[K]>, AtomContextError>>;
  setAtoms(
    updater: (prev: AtomRecord<T>) => AtomRecord<T>
  ): Promise<Result<void, AtomContextError>>;
  clone(): AtomContext<T>;
}

export class AtomContextImpl<T extends Record<string, any>>
  implements AtomContext<T>
{
  private _atomsContainer: any;
  private _arc: any;
  private _atoms: AtomRecord<T>;

  private constructor(atoms: AtomRecord<T>) {
    this._atoms = atoms;
  }

  static async create<T extends Record<string, any>>(
    atoms: AtomRecord<T>
  ): Promise<AtomContext<T>> {
    const context = new AtomContextImpl(atoms);
    context._atomsContainer = await memory.createRcRefCell(atoms);
    context._arc = await memory.createArc({ atoms });

    return context;
  }

  async getAtoms(): Promise<Result<AtomRecord<T>, AtomContextError>> {
    try {
      return Ok(this._atoms);
    } catch (error) {
      return Err(
        new AtomContextError(
          Str.fromRaw(
            `Failed to get atoms: ${
              error instanceof Error ? error.message : String(error)
            }`
          )
        )
      );
    }
  }

  async getAtom<K extends keyof T>(
    key: K
  ): Promise<Result<AtomManager<T[K]>, AtomContextError>> {
    try {
      if (key in this._atoms) {
        return Ok(this._atoms[key]);
      }

      return Err(
        new AtomContextError(
          Str.fromRaw(`Atom with key "${String(key)}" not found`)
        )
      );
    } catch (error) {
      return Err(
        new AtomContextError(
          Str.fromRaw(
            `Failed to get atom: ${
              error instanceof Error ? error.message : String(error)
            }`
          )
        )
      );
    }
  }

  async setAtoms(
    updater: (prev: AtomRecord<T>) => AtomRecord<T>
  ): Promise<Result<void, AtomContextError>> {
    try {
      this._atoms = updater(this._atoms);
      return Ok(undefined);
    } catch (error) {
      return Err(
        new AtomContextError(
          Str.fromRaw(
            `Failed to update atoms: ${
              error instanceof Error ? error.message : String(error)
            }`
          )
        )
      );
    }
  }

  clone(): AtomContext<T> {
    return this;
  }
}

export async function createAtomContext<T extends Record<string, any>>(
  atoms: AtomRecord<T>
): Promise<AtomContext<T>> {
  return AtomContextImpl.create(atoms);
}

export class AtomHub<T extends Record<string, any>> {
  private readonly _atoms: HashMap<Str, AtomManager<any>>;

  private constructor(atoms: AtomRecord<T>) {
    const entries: [Str, AtomManager<any>][] = Object.entries(atoms).map(
      ([key, atom]) => [Str.fromRaw(key), atom]
    );
    this._atoms = HashMap.from(entries);
  }

  static async create<T extends Record<string, any>>(
    atoms: AtomRecord<T>
  ): Promise<AtomHub<T>> {
    return new AtomHub(atoms);
  }

  getAtom<K extends keyof T>(key: K): Option<AtomManager<T[K]>> {
    const strKey = Str.fromRaw(String(key));
    const atom = this._atoms.get(strKey);

    if (atom === undefined) {
      return Option.None();
    }

    return Option.Some(atom as AtomManager<T[K]>);
  }

  addAtom<K extends string, V>(
    key: K,
    atom: AtomManager<V>
  ): AtomHub<T & Record<K, V>> {
    const strKey = Str.fromRaw(key);
    const newAtoms = this._atoms.insert(strKey, atom);

    return this as unknown as AtomHub<T & Record<K, V>>;
  }

  removeAtom<K extends keyof T>(key: K): AtomHub<Omit<T, K>> {
    const strKey = Str.fromRaw(String(key));
    const newAtoms = this._atoms.remove(strKey);

    return this as unknown as AtomHub<Omit<T, K>>;
  }

  getKeys(): Vec<Str> {
    return this._atoms.keys();
  }

  toObject(): AtomRecord<T> {
    const result: Record<string, AtomManager<any>> = {};

    for (const [key, atom] of this._atoms) {
      result[key.unwrap()] = atom;
    }

    return result as AtomRecord<T>;
  }
}

export async function bindAtomContext<T extends Record<string, any>>(
  context: AtomContext<T>
): Promise<{
  [K in keyof T]: {
    get: () => T[K];
    set: (
      updater: (state: T[K]) => T[K]
    ) => Promise<Result<void, AtomContextError>>;
    subscribe: (listener: () => void) => () => void;
  };
}> {
  const atomsResult = await context.getAtoms();

  if (atomsResult.isErr()) {
    throw atomsResult.getError();
  }

  const atoms = atomsResult.unwrap();
  const bound: Record<string, any> = {};

  for (const key in atoms) {
    const atom = atoms[key];

    bound[key] = {
      get: () => atom.getState(),
      set: async (updater: (state: any) => any) => {
        try {
          atom.setState(updater);
          return Ok(undefined);
        } catch (error) {
          return Err(
            new AtomContextError(
              Str.fromRaw(
                `Failed to update atom "${key}": ${
                  error instanceof Error ? error.message : String(error)
                }`
              )
            )
          );
        }
      },
      subscribe: (listener: () => void) => atom.subscribe(listener),
    };
  }

  return bound as {
    [K in keyof T]: {
      get: () => T[K];
      set: (
        updater: (state: T[K]) => T[K]
      ) => Promise<Result<void, AtomContextError>>;
      subscribe: (listener: () => void) => () => void;
    };
  };
}

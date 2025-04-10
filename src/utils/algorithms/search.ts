import {
  isWasmInitialized,
  getWasmModule,
  initWasm,
} from "../../initWasm/init";
import { callWasmStaticMethod } from "../../initWasm/lib";
import { Comparator } from "./sorting";

export type Predicate<T> = (value: T) => boolean;

export class Search {
  private static _useWasm: boolean = true;

  private static get useWasm(): boolean {
    return Search._useWasm && isWasmInitialized();
  }

  static async initialize(): Promise<void> {
    if (!isWasmInitialized()) {
      try {
        await initWasm();
      } catch (error) {
        console.warn(`WASM initialization failed: ${error}`);
        Search._useWasm = false;
      }
    }
  }

  static binarySearch<T>(
    arr: T[],
    target: T,
    comparator?: Comparator<T>
  ): number {
    if (arr.length === 0) {
      return -1;
    }

    if (Search.useWasm) {
      try {
        const wasmModule = getWasmModule();
        if (typeof wasmModule.Search?.binarySearch === "function") {
          const jsArray = new Array(...arr);
          return wasmModule.Search.binarySearch(jsArray, target, comparator);
        }
      } catch (error) {
        console.warn(`WASM binarySearch failed, using JS fallback: ${error}`);
      }
    }

    return callWasmStaticMethod(
      "Search",
      "binarySearch",
      [arr, target, comparator],
      () => {
        const compare = comparator || Search.defaultCompare;
        let low = 0;
        let high = arr.length - 1;

        while (low <= high) {
          const mid = Math.floor(low + (high - low) / 2);
          const midVal = arr[mid];

          const result = compare(midVal, target);

          if (result === 0) {
            return mid;
          } else if (result < 0) {
            low = mid + 1;
          } else {
            if (mid === 0) {
              break;
            }
            high = mid - 1;
          }
        }

        return -1;
      }
    );
  }

  static linearSearch<T>(
    arr: T[],
    target: T,
    comparator?: Comparator<T>
  ): number {
    if (Search.useWasm) {
      try {
        const wasmModule = getWasmModule();
        if (typeof wasmModule.Search?.linearSearch === "function") {
          const jsArray = new Array(...arr);
          return wasmModule.Search.linearSearch(jsArray, target, comparator);
        }
      } catch (error) {
        console.warn(`WASM linearSearch failed, using JS fallback: ${error}`);
      }
    }

    return callWasmStaticMethod(
      "Search",
      "linearSearch",
      [arr, target, comparator],
      () => {
        const compare = comparator || ((a, b) => (Object.is(a, b) ? 0 : 1));

        for (let i = 0; i < arr.length; i++) {
          if (compare(arr[i], target) === 0) {
            return i;
          }
        }

        return -1;
      }
    );
  }

  static findIndex<T>(arr: T[], predicate: Predicate<T>): number {
    if (Search.useWasm) {
      try {
        const wasmModule = getWasmModule();
        if (typeof wasmModule.Search?.findIndex === "function") {
          const jsArray = new Array(...arr);
          return wasmModule.Search.findIndex(jsArray, predicate);
        }
      } catch (error) {
        console.warn(`WASM findIndex failed, using JS fallback: ${error}`);
      }
    }

    return callWasmStaticMethod("Search", "findIndex", [arr, predicate], () => {
      for (let i = 0; i < arr.length; i++) {
        if (predicate(arr[i])) {
          return i;
        }
      }

      return -1;
    });
  }

  static findAll<T>(arr: T[], predicate: Predicate<T>): T[] {
    if (Search.useWasm) {
      try {
        const wasmModule = getWasmModule();
        if (typeof wasmModule.Search?.findAll === "function") {
          const jsArray = new Array(...arr);
          const result = wasmModule.Search.findAll(jsArray, predicate);
          return Array.from(result);
        }
      } catch (error) {
        console.warn(`WASM findAll failed, using JS fallback: ${error}`);
      }
    }

    return callWasmStaticMethod("Search", "findAll", [arr, predicate], () => {
      const result: T[] = [];

      for (let i = 0; i < arr.length; i++) {
        if (predicate(arr[i])) {
          result.push(arr[i]);
        }
      }

      return result;
    });
  }

  static kmpSearch(haystack: string, needle: string): number {
    if (needle.length === 0) {
      return 0;
    }

    if (haystack.length === 0) {
      return -1;
    }

    if (Search.useWasm) {
      try {
        const wasmModule = getWasmModule();
        if (typeof wasmModule.Search?.kmpSearch === "function") {
          return wasmModule.Search.kmpSearch(haystack, needle);
        }
      } catch (error) {
        console.warn(`WASM kmpSearch failed, using JS fallback: ${error}`);
      }
    }

    return callWasmStaticMethod(
      "Search",
      "kmpSearch",
      [haystack, needle],
      () => {
        const lps = Search.computeLPS(needle);
        let i = 0;
        let j = 0;

        while (i < haystack.length) {
          if (needle[j] === haystack[i]) {
            i++;
            j++;
          }

          if (j === needle.length) {
            return i - j;
          } else if (i < haystack.length && needle[j] !== haystack[i]) {
            if (j !== 0) {
              j = lps[j - 1];
            } else {
              i++;
            }
          }
        }

        return -1;
      }
    );
  }

  private static computeLPS(pattern: string): number[] {
    const lps = new Array(pattern.length).fill(0);
    let len = 0;
    let i = 1;

    while (i < pattern.length) {
      if (pattern[i] === pattern[len]) {
        len++;
        lps[i] = len;
        i++;
      } else {
        if (len !== 0) {
          len = lps[len - 1];
        } else {
          lps[i] = 0;
          i++;
        }
      }
    }

    return lps;
  }

  private static defaultCompare<T>(a: T, b: T): number {
    if (a === b) return 0;

    const aVal = (a as any).valueOf();
    const bVal = (b as any).valueOf();

    if (aVal === undefined && bVal === undefined) return 0;
    if (aVal === undefined) return 1;
    if (bVal === undefined) return -1;

    if (aVal < bVal) return -1;
    if (aVal > bVal) return 1;
    return 0;
  }
}

export default Search;

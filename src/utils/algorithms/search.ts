/**
 * Search Module for MiLost
 *
 * Provides search algorithms with WebAssembly acceleration
 * and JavaScript fallback capabilities.
 */
import {
  WasmModule,
  registerModule,
  getWasmModule,
} from "../../initWasm/registry.js";
import { Comparator } from "./sorting.js";

/**
 * Predicate function type for searching
 */
export type Predicate<T> = (value: T) => boolean;

/**
 * Module definition for Search WASM implementation
 */
const searchModule: WasmModule = {
  name: "Search",

  initialize(wasmModule: any) {
    console.log("Initializing Search module with WASM...");

    if (wasmModule.Search) {
      console.log("Found Search object in WASM module");
      Search._useWasm = true;

      const staticMethods = [
        "binarySearch",
        "linearSearch",
        "findIndex",
        "findAll",
        "kmpSearch",
      ];

      staticMethods.forEach((method) => {
        if (typeof wasmModule.Search[method] === "function") {
          console.log(`Found static method: Search.${method}`);
        } else {
          console.warn(`Missing static method: Search.${method}`);
        }
      });
    } else {
      throw new Error("Required WASM functions not found for Search");
    }
  },

  fallback() {
    console.log("Using JavaScript fallback for Search");
    Search._useWasm = false;
  },
};

registerModule(searchModule);

/**
 * Search class with WASM acceleration
 */
export class Search {
  static _useWasm: boolean = true;

  /**
   * Initialize WASM module
   */
  static async initialize(): Promise<void> {
    if (!Search._useWasm) {
      return;
    }

    try {
      const wasmModule = getWasmModule();
      if (!wasmModule || !wasmModule.Search) {
        Search._useWasm = false;
      }
    } catch (error) {
      console.warn(`WASM initialization failed: ${error}`);
      Search._useWasm = false;
    }
  }

  /**
   * Default comparison function
   */
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

  /**
   * Binary search algorithm
   */
  static binarySearch<T>(
    arr: T[],
    target: T,
    comparator?: Comparator<T>
  ): number {
    if (arr.length === 0) {
      return -1;
    }

    if (Search._useWasm) {
      try {
        const wasmModule = getWasmModule();
        if (wasmModule?.Search?.binarySearch) {
          const jsArray = new Array(...arr);
          return wasmModule.Search.binarySearch(jsArray, target, comparator);
        }
      } catch (error) {
        console.warn(`WASM binarySearch failed, using JS fallback: ${error}`);
      }
    }

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

  /**
   * Linear search algorithm
   */
  static linearSearch<T>(
    arr: T[],
    target: T,
    comparator?: Comparator<T>
  ): number {
    if (Search._useWasm) {
      try {
        const wasmModule = getWasmModule();
        if (wasmModule?.Search?.linearSearch) {
          const jsArray = new Array(...arr);
          return wasmModule.Search.linearSearch(jsArray, target, comparator);
        }
      } catch (error) {
        console.warn(`WASM linearSearch failed, using JS fallback: ${error}`);
      }
    }

    const compare = comparator || ((a, b) => (Object.is(a, b) ? 0 : 1));

    for (let i = 0; i < arr.length; i++) {
      if (compare(arr[i], target) === 0) {
        return i;
      }
    }

    return -1;
  }

  /**
   * Find index by predicate
   */
  static findIndex<T>(arr: T[], predicate: Predicate<T>): number {
    if (Search._useWasm) {
      try {
        const wasmModule = getWasmModule();
        if (wasmModule?.Search?.findIndex) {
          const jsArray = new Array(...arr);
          return wasmModule.Search.findIndex(jsArray, predicate);
        }
      } catch (error) {
        console.warn(`WASM findIndex failed, using JS fallback: ${error}`);
      }
    }

    for (let i = 0; i < arr.length; i++) {
      if (predicate(arr[i])) {
        return i;
      }
    }

    return -1;
  }

  /**
   * Find all elements matching predicate
   */
  static findAll<T>(arr: T[], predicate: Predicate<T>): T[] {
    if (Search._useWasm) {
      try {
        const wasmModule = getWasmModule();
        if (wasmModule?.Search?.findAll) {
          const jsArray = new Array(...arr);
          const result = wasmModule.Search.findAll(jsArray, predicate);
          return Array.from(result);
        }
      } catch (error) {
        console.warn(`WASM findAll failed, using JS fallback: ${error}`);
      }
    }

    const result: T[] = [];

    for (let i = 0; i < arr.length; i++) {
      if (predicate(arr[i])) {
        result.push(arr[i]);
      }
    }

    return result;
  }

  /**
   * KMP string search algorithm
   */
  static kmpSearch(haystack: string, needle: string): number {
    if (needle.length === 0) {
      return 0;
    }

    if (haystack.length === 0) {
      return -1;
    }

    if (Search._useWasm) {
      try {
        const wasmModule = getWasmModule();
        if (wasmModule?.Search?.kmpSearch) {
          return wasmModule.Search.kmpSearch(haystack, needle);
        }
      } catch (error) {
        console.warn(`WASM kmpSearch failed, using JS fallback: ${error}`);
      }
    }

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

  /**
   * Compute Longest Proper Prefix which is also Suffix (LPS)
   */
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
}

export default Search;

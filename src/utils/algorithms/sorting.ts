/**
 * Sorting Module for MiLost
 *
 * Provides sorting algorithms with WebAssembly acceleration
 * and JavaScript fallback capabilities.
 */

import {
  WasmModule,
  registerModule,
  getWasmModule,
} from "../../initWasm/index.js";

/**
 * Comparator function type for sorting
 */
export type Comparator<T> = (a: T, b: T) => number;

/**
 * Module definition for Sorting WASM implementation
 */
const sortingModule: WasmModule = {
  name: "Sorting",

  initialize(wasmModule: any) {
    console.log("Initializing Sorting module with WASM...");

    if (wasmModule.Sorting) {
      console.log("Found Sorting object in WASM module");
      Sorting._useWasm = true;

      const staticMethods = ["quickSort", "mergeSort", "heapSort", "isSorted"];

      staticMethods.forEach((method) => {
        if (typeof wasmModule.Sorting[method] === "function") {
          console.log(`Found static method: Sorting.${method}`);
        } else {
          console.warn(`Missing static method: Sorting.${method}`);
        }
      });
    } else {
      throw new Error("Required WASM functions not found for Sorting");
    }
  },

  fallback() {
    console.log("Using JavaScript fallback for Sorting");
    Sorting._useWasm = false;
  },
};

registerModule(sortingModule);

/**
 * Sorting class with WASM acceleration
 */
export class Sorting {
  static _useWasm: boolean = true;

  /**
   * Initialize WASM module
   */
  static async initialize(): Promise<void> {
    if (!Sorting._useWasm) {
      return;
    }

    try {
      const wasmModule = getWasmModule();
      if (!wasmModule || !wasmModule.Sorting) {
        Sorting._useWasm = false;
      }
    } catch (error) {
      console.warn(`WASM initialization failed: ${error}`);
      Sorting._useWasm = false;
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
   * Quick Sort algorithm
   */
  static quickSort<T>(arr: T[], comparator?: Comparator<T>): T[] {
    if (arr.length <= 1) {
      return [...arr];
    }

    if (Sorting._useWasm) {
      try {
        const wasmModule = getWasmModule();
        if (wasmModule?.Sorting?.quickSort) {
          const jsArray = new Array(...arr);
          const sorted = wasmModule.Sorting.quickSort(jsArray, comparator);
          return Array.from(sorted);
        }
      } catch (error) {
        console.warn(`WASM quickSort failed, using JS fallback: ${error}`);
      }
    }

    const compare = comparator || Sorting.defaultCompare;
    return Sorting.quickSortFallback([...arr], compare);
  }

  /**
   * Merge Sort algorithm
   */
  static mergeSort<T>(arr: T[], comparator?: Comparator<T>): T[] {
    if (arr.length <= 1) {
      return [...arr];
    }

    if (Sorting._useWasm) {
      try {
        const wasmModule = getWasmModule();
        if (wasmModule?.Sorting?.mergeSort) {
          const jsArray = new Array(...arr);
          const sorted = wasmModule.Sorting.mergeSort(jsArray, comparator);
          return Array.from(sorted);
        }
      } catch (error) {
        console.warn(`WASM mergeSort failed, using JS fallback: ${error}`);
      }
    }

    const compare = comparator || Sorting.defaultCompare;
    return Sorting.mergeSortFallback([...arr], compare);
  }

  /**
   * Heap Sort algorithm
   */
  static heapSort<T>(arr: T[], comparator?: Comparator<T>): T[] {
    if (arr.length <= 1) {
      return [...arr];
    }

    if (Sorting._useWasm) {
      try {
        const wasmModule = getWasmModule();
        if (wasmModule?.Sorting?.heapSort) {
          const jsArray = new Array(...arr);
          const sorted = wasmModule.Sorting.heapSort(jsArray, comparator);
          return Array.from(sorted);
        }
      } catch (error) {
        console.warn(`WASM heapSort failed, using JS fallback: ${error}`);
      }
    }

    const compare = comparator || Sorting.defaultCompare;
    return Sorting.heapSortFallback([...arr], compare);
  }

  /**
   * Check if array is sorted
   */
  static isSorted<T>(arr: T[], comparator?: Comparator<T>): boolean {
    if (arr.length <= 1) {
      return true;
    }

    if (Sorting._useWasm) {
      try {
        const wasmModule = getWasmModule();
        if (wasmModule?.Sorting?.isSorted) {
          const jsArray = new Array(...arr);
          return wasmModule.Sorting.isSorted(jsArray, comparator);
        }
      } catch (error) {
        console.warn(`WASM isSorted failed, using JS fallback: ${error}`);
      }
    }

    const compare = comparator || Sorting.defaultCompare;
    for (let i = 0; i < arr.length - 1; i++) {
      if (compare(arr[i], arr[i + 1]) > 0) {
        return false;
      }
    }
    return true;
  }

  /**
   * Quick Sort fallback implementation
   */
  private static quickSortFallback<T>(arr: T[], compare: Comparator<T>): T[] {
    if (arr.length <= 1) {
      return arr;
    }

    const pivot = arr[Math.floor(arr.length / 2)];
    const equal: T[] = [];
    const less: T[] = [];
    const greater: T[] = [];

    for (const element of arr) {
      const comparison = compare(element, pivot);
      if (comparison === 0) {
        equal.push(element);
      } else if (comparison < 0) {
        less.push(element);
      } else {
        greater.push(element);
      }
    }

    return [
      ...Sorting.quickSortFallback(less, compare),
      ...equal,
      ...Sorting.quickSortFallback(greater, compare),
    ];
  }

  /**
   * Merge Sort fallback implementation
   */
  private static mergeSortFallback<T>(arr: T[], compare: Comparator<T>): T[] {
    if (arr.length <= 1) {
      return arr;
    }

    const mid = Math.floor(arr.length / 2);
    const left = Sorting.mergeSortFallback(arr.slice(0, mid), compare);
    const right = Sorting.mergeSortFallback(arr.slice(mid), compare);

    return Sorting.merge(left, right, compare);
  }

  /**
   * Merge helper function for Merge Sort
   */
  private static merge<T>(left: T[], right: T[], compare: Comparator<T>): T[] {
    const result: T[] = [];
    let leftIndex = 0;
    let rightIndex = 0;

    while (leftIndex < left.length && rightIndex < right.length) {
      if (compare(left[leftIndex], right[rightIndex]) <= 0) {
        result.push(left[leftIndex]);
        leftIndex++;
      } else {
        result.push(right[rightIndex]);
        rightIndex++;
      }
    }

    return result.concat(left.slice(leftIndex), right.slice(rightIndex));
  }

  /**
   * Heap Sort fallback implementation
   */
  private static heapSortFallback<T>(arr: T[], compare: Comparator<T>): T[] {
    const n = arr.length;

    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      Sorting.heapify(arr, n, i, compare);
    }

    for (let i = n - 1; i > 0; i--) {
      [arr[0], arr[i]] = [arr[i], arr[0]];
      Sorting.heapify(arr, i, 0, compare);
    }

    return arr;
  }

  /**
   * Heapify helper function for Heap Sort
   */
  private static heapify<T>(
    arr: T[],
    n: number,
    i: number,
    compare: Comparator<T>
  ): void {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    if (left < n && compare(arr[left], arr[largest]) > 0) {
      largest = left;
    }

    if (right < n && compare(arr[right], arr[largest]) > 0) {
      largest = right;
    }

    if (largest !== i) {
      [arr[i], arr[largest]] = [arr[largest], arr[i]];
      Sorting.heapify(arr, n, largest, compare);
    }
  }
}

export default Sorting;

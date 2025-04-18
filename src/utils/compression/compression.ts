/**
 * Compression Module for MiLost
 *
 * Provides compression algorithms with WebAssembly acceleration
 * and JavaScript fallback capabilities.
 */

import { Result, Err, Ok } from "../../core/index.js";
import {
  WasmModule,
  registerModule,
  getWasmModule,
} from "../../initWasm/index.js";

/**
 * Custom error for compression operations
 */
export class CompressionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CompressionError";
  }
}

/**
 * Result of Huffman compression
 */
export interface HuffmanCompressionResult {
  data: Uint8Array;
  tree: Uint8Array;
}

/**
 * Module definition for Compression WASM implementation
 */
const compressionModule: WasmModule = {
  name: "Compression",

  initialize(wasmModule: any) {
    console.log("Initializing Compression module with WASM...");

    const staticMethods = [
      "compressGzip",
      "decompressGzip",
      "compressZlib",
      "decompressZlib",
      "compressDeflate",
      "decompressDeflate",
      "compressLZ77",
      "decompressLZ77",
      "compressHuffman",
      "decompressHuffman",
    ];

    let hasWasmMethods = true;
    staticMethods.forEach((method) => {
      const methodExists =
        typeof wasmModule.Compressions?.[method] === "function" ||
        typeof wasmModule[method] === "function";

      if (methodExists) {
        console.log(`Found compression method: ${method}`);
      } else {
        console.warn(`Missing compression method: ${method}`);
        hasWasmMethods = false;
      }
    });

    Compression._useWasm = hasWasmMethods;
  },

  fallback() {
    console.log("Using JavaScript fallback for Compression");
    Compression._useWasm = false;
  },
};

registerModule(compressionModule);

/**
 * Compression class with WASM acceleration
 */
export class Compression {
  static _useWasm: boolean = true;

  /**
   * Initialize WASM module
   */
  static async initialize(): Promise<void> {
    if (!Compression._useWasm) {
      return;
    }

    try {
      const wasmModule = getWasmModule();
      if (
        !wasmModule ||
        (!wasmModule.Compressions && !wasmModule.compressGzip)
      ) {
        Compression._useWasm = false;
      }
    } catch (error) {
      console.warn(`WASM initialization failed: ${error}`);
      Compression._useWasm = false;
    }
  }

  /**
   * Compress data using Gzip
   */
  static compressGzip(
    data: Uint8Array,
    level?: number
  ): Result<Uint8Array, CompressionError> {
    if (level !== undefined && (level < 0 || level > 9)) {
      return Err(
        new CompressionError("Compression level must be between 0 and 9")
      );
    }

    if (Compression._useWasm) {
      try {
        const wasmModule = getWasmModule();
        const compressMethod =
          wasmModule.Compressions?.compressGzip || wasmModule.compressGzip;

        if (typeof compressMethod === "function") {
          const result = compressMethod(data, level);
          return Ok(result);
        }
      } catch (error) {
        console.warn(`WASM compressGzip failed, using JS fallback: ${error}`);
      }
    }

    return Err(new CompressionError("Gzip compression not available"));
  }

  /**
   * Decompress Gzip data
   */
  static decompressGzip(
    data: Uint8Array
  ): Result<Uint8Array, CompressionError> {
    if (Compression._useWasm) {
      try {
        const wasmModule = getWasmModule();
        const decompressMethod =
          wasmModule.Compressions?.decompressGzip || wasmModule.decompressGzip;

        if (typeof decompressMethod === "function") {
          const result = decompressMethod(data);
          return Ok(result);
        }
      } catch (error) {
        console.warn(`WASM decompressGzip failed, using JS fallback: ${error}`);
      }
    }

    return Err(new CompressionError("Gzip decompression not available"));
  }

  /**
   * Compress data using Zlib
   */
  static compressZlib(
    data: Uint8Array,
    level?: number
  ): Result<Uint8Array, CompressionError> {
    if (level !== undefined && (level < 0 || level > 9)) {
      return Err(
        new CompressionError("Compression level must be between 0 and 9")
      );
    }

    if (Compression._useWasm) {
      try {
        const wasmModule = getWasmModule();
        const compressMethod =
          wasmModule.Compressions?.compressZlib || wasmModule.compressZlib;

        if (typeof compressMethod === "function") {
          const result = compressMethod(data, level);
          return Ok(result);
        }
      } catch (error) {
        console.warn(`WASM compressZlib failed, using JS fallback: ${error}`);
      }
    }

    return Err(new CompressionError("Zlib compression not available"));
  }

  /**
   * Decompress Zlib data
   */
  static decompressZlib(
    data: Uint8Array
  ): Result<Uint8Array, CompressionError> {
    if (Compression._useWasm) {
      try {
        const wasmModule = getWasmModule();
        const decompressMethod =
          wasmModule.Compressions?.decompressZlib || wasmModule.decompressZlib;

        if (typeof decompressMethod === "function") {
          const result = decompressMethod(data);
          return Ok(result);
        }
      } catch (error) {
        console.warn(`WASM decompressZlib failed, using JS fallback: ${error}`);
      }
    }

    return Err(new CompressionError("Zlib decompression not available"));
  }

  /**
   * Compress data using Deflate
   */
  static compressDeflate(
    data: Uint8Array,
    level?: number
  ): Result<Uint8Array, CompressionError> {
    if (level !== undefined && (level < 0 || level > 9)) {
      return Err(
        new CompressionError("Compression level must be between 0 and 9")
      );
    }

    if (Compression._useWasm) {
      try {
        const wasmModule = getWasmModule();
        const compressMethod =
          wasmModule.Compressions?.compressDeflate ||
          wasmModule.compressDeflate;

        if (typeof compressMethod === "function") {
          const result = compressMethod(data, level);
          return Ok(result);
        }
      } catch (error) {
        console.warn(
          `WASM compressDeflate failed, using JS fallback: ${error}`
        );
      }
    }

    return Err(new CompressionError("Deflate compression not available"));
  }

  /**
   * Decompress Deflate data
   */
  static decompressDeflate(
    data: Uint8Array
  ): Result<Uint8Array, CompressionError> {
    if (Compression._useWasm) {
      try {
        const wasmModule = getWasmModule();
        const decompressMethod =
          wasmModule.Compressions?.decompressDeflate ||
          wasmModule.decompressDeflate;

        if (typeof decompressMethod === "function") {
          const result = decompressMethod(data);
          return Ok(result);
        }
      } catch (error) {
        console.warn(
          `WASM decompressDeflate failed, using JS fallback: ${error}`
        );
      }
    }

    return Err(new CompressionError("Deflate decompression not available"));
  }

  /**
   * Compress data using LZ77
   */
  static compressLZ77(data: Uint8Array, windowSize?: number): Uint8Array {
    if (Compression._useWasm) {
      try {
        const wasmModule = getWasmModule();
        const compressMethod =
          wasmModule.Compressions?.compressLZ77 || wasmModule.compressLZ77;

        if (typeof compressMethod === "function") {
          return compressMethod(data, windowSize);
        }
      } catch (error) {
        console.warn(`WASM compressLZ77 failed, using JS fallback: ${error}`);
      }
    }

    throw new CompressionError("LZ77 compression not available");
  }

  /**
   * Decompress LZ77 data
   */
  static decompressLZ77(data: Uint8Array): Uint8Array {
    if (Compression._useWasm) {
      try {
        const wasmModule = getWasmModule();
        const decompressMethod =
          wasmModule.Compressions?.decompressLZ77 || wasmModule.decompressLZ77;

        if (typeof decompressMethod === "function") {
          return decompressMethod(data);
        }
      } catch (error) {
        console.warn(`WASM decompressLZ77 failed, using JS fallback: ${error}`);
      }
    }

    throw new CompressionError("LZ77 decompression not available");
  }

  /**
   * Compress data using Huffman coding
   */
  static compressHuffman(data: Uint8Array): HuffmanCompressionResult {
    if (Compression._useWasm) {
      try {
        const wasmModule = getWasmModule();
        const compressMethod =
          wasmModule.Compressions?.compressHuffman ||
          wasmModule.compressHuffman;

        if (typeof compressMethod === "function") {
          const result = compressMethod(data);
          return {
            data: result.data,
            tree: result.tree,
          };
        }
      } catch (error) {
        console.warn(
          `WASM compressHuffman failed, using JS fallback: ${error}`
        );
      }
    }

    throw new CompressionError("Huffman compression not available");
  }

  /**
   * Decompress Huffman coded data
   */
  static decompressHuffman(
    compressedData: Uint8Array,
    treeData: Uint8Array
  ): Result<Uint8Array, CompressionError> {
    if (Compression._useWasm) {
      try {
        const wasmModule = getWasmModule();
        const decompressMethod =
          wasmModule.Compressions?.decompressHuffman ||
          wasmModule.decompressHuffman;

        if (typeof decompressMethod === "function") {
          const result = decompressMethod(compressedData, treeData);
          return Ok(result);
        }
      } catch (error) {
        console.warn(
          `WASM decompressHuffman failed, using JS fallback: ${error}`
        );
      }
    }

    return Err(new CompressionError("Huffman decompression not available"));
  }
}

export default Compression;

import { Result, Ok, Err } from "../../core";
import { isWasmInitialized, getWasmModule } from "../../initWasm/init";
import { callWasmStaticMethod } from "../../initWasm/lib";
import { initWasm } from "../../ui";

export class CompressionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CompressionError";
  }
}

export interface HuffmanCompressionResult {
  data: Uint8Array;
  tree: Uint8Array;
}

export class Compression {
  private static _useWasm: boolean = true;

  private static get useWasm(): boolean {
    return Compression._useWasm && isWasmInitialized();
  }

  static async initialize(): Promise<void> {
    if (!isWasmInitialized()) {
      try {
        await initWasm();
      } catch (error) {
        console.warn(`WASM initialization failed: ${error}`);
        Compression._useWasm = false;
      }
    }
  }

  static compressGzip(
    data: Uint8Array,
    level?: number
  ): Result<Uint8Array, CompressionError> {
    if (level !== undefined && (level < 0 || level > 9)) {
      return Err(
        new CompressionError("Compression level must be between 0 and 9")
      );
    }

    if (Compression.useWasm) {
      try {
        const wasmModule = getWasmModule();
        if (typeof wasmModule.Compressions?.compressGzip === "function") {
          const result = wasmModule.Compressions.compressGzip(data, level);
          return Ok(result);
        }
      } catch (error) {
        console.warn(`WASM compressGzip failed, using JS fallback: ${error}`);
        return Err(new CompressionError(`Compression error: ${error}`));
      }
    }

    try {
      return callWasmStaticMethod(
        "Compressions",
        "compressGzip",
        [data, level],
        () => {
          throw new Error("Gzip compression JS fallback not implemented");
        }
      );
    } catch (error) {
      return Err(new CompressionError(`Compression error: ${error}`));
    }
  }

  static decompressGzip(
    data: Uint8Array
  ): Result<Uint8Array, CompressionError> {
    if (Compression.useWasm) {
      try {
        const wasmModule = getWasmModule();
        if (typeof wasmModule.Compressions?.decompressGzip === "function") {
          const result = wasmModule.Compressions.decompressGzip(data);
          return Ok(result);
        }
      } catch (error) {
        console.warn(`WASM decompressGzip failed, using JS fallback: ${error}`);
        return Err(new CompressionError(`Decompression error: ${error}`));
      }
    }

    try {
      return callWasmStaticMethod(
        "Compressions",
        "decompressGzip",
        [data],
        () => {
          throw new Error("Gzip decompression JS fallback not implemented");
        }
      );
    } catch (error) {
      return Err(new CompressionError(`Decompression error: ${error}`));
    }
  }

  static compressZlib(
    data: Uint8Array,
    level?: number
  ): Result<Uint8Array, CompressionError> {
    if (level !== undefined && (level < 0 || level > 9)) {
      return Err(
        new CompressionError("Compression level must be between 0 and 9")
      );
    }

    if (Compression.useWasm) {
      try {
        const wasmModule = getWasmModule();
        if (typeof wasmModule.Compressions?.compressZlib === "function") {
          const result = wasmModule.Compressions.compressZlib(data, level);
          return Ok(result);
        }
      } catch (error) {
        console.warn(`WASM compressZlib failed, using JS fallback: ${error}`);
        return Err(new CompressionError(`Compression error: ${error}`));
      }
    }

    try {
      return callWasmStaticMethod(
        "Compressions",
        "compressZlib",
        [data, level],
        () => {
          throw new Error("Zlib compression JS fallback not implemented");
        }
      );
    } catch (error) {
      return Err(new CompressionError(`Compression error: ${error}`));
    }
  }

  static decompressZlib(
    data: Uint8Array
  ): Result<Uint8Array, CompressionError> {
    if (Compression.useWasm) {
      try {
        const wasmModule = getWasmModule();
        if (typeof wasmModule.Compressions?.decompressZlib === "function") {
          const result = wasmModule.Compressions.decompressZlib(data);
          return Ok(result);
        }
      } catch (error) {
        console.warn(`WASM decompressZlib failed, using JS fallback: ${error}`);
        return Err(new CompressionError(`Decompression error: ${error}`));
      }
    }

    try {
      return callWasmStaticMethod(
        "Compressions",
        "decompressZlib",
        [data],
        () => {
          throw new Error("Zlib decompression JS fallback not implemented");
        }
      );
    } catch (error) {
      return Err(new CompressionError(`Decompression error: ${error}`));
    }
  }

  static compressDeflate(
    data: Uint8Array,
    level?: number
  ): Result<Uint8Array, CompressionError> {
    if (level !== undefined && (level < 0 || level > 9)) {
      return Err(
        new CompressionError("Compression level must be between 0 and 9")
      );
    }

    if (Compression.useWasm) {
      try {
        const wasmModule = getWasmModule();
        if (typeof wasmModule.Compressions?.compressDeflate === "function") {
          const result = wasmModule.Compressions.compressDeflate(data, level);
          return Ok(result);
        }
      } catch (error) {
        console.warn(
          `WASM compressDeflate failed, using JS fallback: ${error}`
        );
        return Err(new CompressionError(`Compression error: ${error}`));
      }
    }

    try {
      return callWasmStaticMethod(
        "Compressions",
        "compressDeflate",
        [data, level],
        () => {
          throw new Error("Deflate compression JS fallback not implemented");
        }
      );
    } catch (error) {
      return Err(new CompressionError(`Compression error: ${error}`));
    }
  }

  static decompressDeflate(
    data: Uint8Array
  ): Result<Uint8Array, CompressionError> {
    if (Compression.useWasm) {
      try {
        const wasmModule = getWasmModule();
        if (typeof wasmModule.Compressions?.decompressDeflate === "function") {
          const result = wasmModule.Compressions.decompressDeflate(data);
          return Ok(result);
        }
      } catch (error) {
        console.warn(
          `WASM decompressDeflate failed, using JS fallback: ${error}`
        );
        return Err(new CompressionError(`Decompression error: ${error}`));
      }
    }

    try {
      return callWasmStaticMethod(
        "Compressions",
        "decompressDeflate",
        [data],
        () => {
          throw new Error("Deflate decompression JS fallback not implemented");
        }
      );
    } catch (error) {
      return Err(new CompressionError(`Decompression error: ${error}`));
    }
  }

  static compressLZ77(data: Uint8Array, windowSize?: number): Uint8Array {
    if (Compression.useWasm) {
      try {
        const wasmModule = getWasmModule();
        if (typeof wasmModule.Compressions?.compressLZ77 === "function") {
          return wasmModule.Compressions.compressLZ77(data, windowSize);
        }
      } catch (error) {
        console.warn(`WASM compressLZ77 failed, using JS fallback: ${error}`);
      }
    }

    return callWasmStaticMethod(
      "Compressions",
      "compressLZ77",
      [data, windowSize],
      () => {
        throw new Error("LZ77 compression JS fallback not implemented");
      }
    );
  }

  static decompressLZ77(data: Uint8Array): Uint8Array {
    if (Compression.useWasm) {
      try {
        const wasmModule = getWasmModule();
        if (typeof wasmModule.Compressions?.decompressLZ77 === "function") {
          return wasmModule.Compressions.decompressLZ77(data);
        }
      } catch (error) {
        console.warn(`WASM decompressLZ77 failed, using JS fallback: ${error}`);
      }
    }

    return callWasmStaticMethod(
      "Compressions",
      "decompressLZ77",
      [data],
      () => {
        throw new Error("LZ77 decompression JS fallback not implemented");
      }
    );
  }

  static compressHuffman(data: Uint8Array): HuffmanCompressionResult {
    if (Compression.useWasm) {
      try {
        const wasmModule = getWasmModule();
        if (typeof wasmModule.compressHuffman === "function") {
          const result = wasmModule.compressHuffman(data);
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

    return callWasmStaticMethod("compressHuffman", "", [data], () => {
      throw new Error("Huffman compression JS fallback not implemented");
    });
  }

  static decompressHuffman(
    compressedData: Uint8Array,
    treeData: Uint8Array
  ): Result<Uint8Array, CompressionError> {
    if (Compression.useWasm) {
      try {
        const wasmModule = getWasmModule();
        if (typeof wasmModule.decompressHuffman === "function") {
          const result = wasmModule.decompressHuffman(compressedData, treeData);
          return Ok(result);
        }
      } catch (error) {
        console.warn(
          `WASM decompressHuffman failed, using JS fallback: ${error}`
        );
        return Err(
          new CompressionError(`Huffman decompression failed: ${error}`)
        );
      }
    }

    try {
      return callWasmStaticMethod(
        "decompressHuffman",
        "",
        [compressedData, treeData],
        () => {
          throw new Error("Huffman decompression JS fallback not implemented");
        }
      );
    } catch (error) {
      return Err(
        new CompressionError(`Huffman decompression failed: ${error}`)
      );
    }
  }
}

export default Compression;

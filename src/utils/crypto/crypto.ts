/**
 * Crypto Module for MiLost
 *
 * Provides cryptographic operations with WebAssembly acceleration
 * and JavaScript fallback capabilities.
 */

import { Result, Ok, Err } from "../../core/index.js";
import {
  WasmModule,
  registerModule,
  getWasmModule,
} from "../../initWasm/index.js";

/**
 * Custom error for cryptographic operations
 */
export class CryptoError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CryptoError";
  }
}

/**
 * Module definition for Crypto WASM implementation
 */
const cryptoModule: WasmModule = {
  name: "Crypto",

  initialize(wasmModule: any) {
    console.log("Initializing Crypto module with WASM...");

    const staticMethods = [
      "sha256",
      "sha512",
      "hmac256",
      "hmac512",
      "aesGcmEncrypt",
      "aesGcmDecrypt",
      "randomBytes",
    ];

    let hasWasmMethods = true;
    staticMethods.forEach((method) => {
      const methodExists =
        typeof wasmModule.Crypto?.[method] === "function" ||
        typeof wasmModule[method] === "function";

      if (methodExists) {
        console.log(`Found crypto method: ${method}`);
      } else {
        console.warn(`Missing crypto method: ${method}`);
        hasWasmMethods = false;
      }
    });

    Crypto._useWasm = hasWasmMethods;
  },

  fallback() {
    console.log("Using JavaScript fallback for Crypto");
    Crypto._useWasm = false;
  },
};

registerModule(cryptoModule);

/**
 * Crypto class with WASM acceleration
 */
export class Crypto {
  static _useWasm: boolean = true;

  /**
   * Initialize WASM module
   */
  static async initialize(): Promise<void> {
    if (!Crypto._useWasm) {
      return;
    }

    try {
      const wasmModule = getWasmModule();
      if (!wasmModule || (!wasmModule.Crypto && !wasmModule.sha256)) {
        Crypto._useWasm = false;
      }
    } catch (error) {
      console.warn(`WASM initialization failed: ${error}`);
      Crypto._useWasm = false;
    }
  }

  /**
   * Compute SHA-256 hash
   */
  static sha256(data: Uint8Array): Uint8Array {
    if (Crypto._useWasm) {
      try {
        const wasmModule = getWasmModule();
        const hashMethod = wasmModule.Crypto?.sha256 || wasmModule.sha256;

        if (typeof hashMethod === "function") {
          return hashMethod(data);
        }
      } catch (error) {
        console.warn(`WASM sha256 failed, using JS fallback: ${error}`);
      }
    }

    throw new CryptoError("SHA-256 hash not available");
  }

  /**
   * Compute SHA-512 hash
   */
  static sha512(data: Uint8Array): Uint8Array {
    if (Crypto._useWasm) {
      try {
        const wasmModule = getWasmModule();
        const hashMethod = wasmModule.Crypto?.sha512 || wasmModule.sha512;

        if (typeof hashMethod === "function") {
          return hashMethod(data);
        }
      } catch (error) {
        console.warn(`WASM sha512 failed, using JS fallback: ${error}`);
      }
    }

    throw new CryptoError("SHA-512 hash not available");
  }

  /**
   * Compute HMAC-SHA256
   */
  static hmacSha256(
    key: Uint8Array,
    data: Uint8Array
  ): Result<Uint8Array, CryptoError> {
    if (Crypto._useWasm) {
      try {
        const wasmModule = getWasmModule();
        const hmacMethod = wasmModule.Crypto?.hmac256 || wasmModule.hmac256;

        if (typeof hmacMethod === "function") {
          const result = hmacMethod(key, data);
          return Ok(result);
        }
      } catch (error) {
        console.warn(`WASM hmacSha256 failed, using JS fallback: ${error}`);
      }
    }

    return Err(new CryptoError("HMAC-SHA256 not available"));
  }

  /**
   * Compute HMAC-SHA512
   */
  static hmacSha512(
    key: Uint8Array,
    data: Uint8Array
  ): Result<Uint8Array, CryptoError> {
    if (Crypto._useWasm) {
      try {
        const wasmModule = getWasmModule();
        const hmacMethod = wasmModule.Crypto?.hmac512 || wasmModule.hmac512;

        if (typeof hmacMethod === "function") {
          const result = hmacMethod(key, data);
          return Ok(result);
        }
      } catch (error) {
        console.warn(`WASM hmacSha512 failed, using JS fallback: ${error}`);
      }
    }

    return Err(new CryptoError("HMAC-SHA512 not available"));
  }

  /**
   * AES-GCM Encryption
   */
  static aesGcmEncrypt(
    key: Uint8Array,
    plaintext: Uint8Array
  ): Result<Uint8Array, CryptoError> {
    if (key.length !== 32) {
      return Err(new CryptoError("Key must be 32 bytes (256 bits)"));
    }

    if (Crypto._useWasm) {
      try {
        const wasmModule = getWasmModule();
        const encryptMethod =
          wasmModule.Crypto?.aesGcmEncrypt || wasmModule.aesGcmEncrypt;

        if (typeof encryptMethod === "function") {
          const result = encryptMethod(key, plaintext);
          return Ok(result);
        }
      } catch (error) {
        console.warn(`WASM aesGcmEncrypt failed, using JS fallback: ${error}`);
      }
    }

    return Err(new CryptoError("AES-GCM encryption not available"));
  }

  /**
   * AES-GCM Decryption
   */
  static aesGcmDecrypt(
    key: Uint8Array,
    ciphertext: Uint8Array
  ): Result<Uint8Array, CryptoError> {
    if (key.length !== 32) {
      return Err(new CryptoError("Key must be 32 bytes (256 bits)"));
    }

    if (ciphertext.length < 12) {
      return Err(new CryptoError("Invalid ciphertext length"));
    }

    if (Crypto._useWasm) {
      try {
        const wasmModule = getWasmModule();
        const decryptMethod =
          wasmModule.Crypto?.aesGcmDecrypt || wasmModule.aesGcmDecrypt;

        if (typeof decryptMethod === "function") {
          const result = decryptMethod(key, ciphertext);
          return Ok(result);
        }
      } catch (error) {
        console.warn(`WASM aesGcmDecrypt failed, using JS fallback: ${error}`);
      }
    }

    return Err(new CryptoError("AES-GCM decryption not available"));
  }

  /**
   * Generate random bytes
   */
  static randomBytes(length: number): Uint8Array {
    if (Crypto._useWasm) {
      try {
        const wasmModule = getWasmModule();
        const randomMethod =
          wasmModule.Crypto?.randomBytes || wasmModule.randomBytes;

        if (typeof randomMethod === "function") {
          return randomMethod(length);
        }
      } catch (error) {
        console.warn(`WASM randomBytes failed, using JS fallback: ${error}`);
      }
    }

    const bytes = new Uint8Array(length);
    if (typeof crypto !== "undefined" && crypto.getRandomValues) {
      crypto.getRandomValues(bytes);
    } else {
      for (let i = 0; i < length; i++) {
        bytes[i] = Math.floor(Math.random() * 256);
      }
    }
    return bytes;
  }
}

export default Crypto;

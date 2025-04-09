import { Result, Ok, Err } from "../../core";
import { Option } from "../../core/option";
import { isWasmInitialized, getWasmModule } from "../../initWasm/init";
import { callWasmStaticMethod } from "../../initWasm/lib";
import { initWasm } from "../../ui";

export class CryptoError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CryptoError";
  }
}

export class Crypto {
  private static _useWasm: boolean = true;

  private static get useWasm(): boolean {
    return Crypto._useWasm && isWasmInitialized();
  }

  static async initialize(): Promise<void> {
    if (!isWasmInitialized()) {
      try {
        await initWasm();
      } catch (error) {
        console.warn(`WASM initialization failed: ${error}`);
        Crypto._useWasm = false;
      }
    }
  }

  static sha256(data: Uint8Array): Uint8Array {
    if (Crypto.useWasm) {
      try {
        const wasmModule = getWasmModule();
        if (typeof wasmModule.Crypto?.sha256 === "function") {
          return wasmModule.Crypto.sha256(data);
        }
      } catch (error) {
        console.warn(`WASM sha256 failed, using JS fallback: ${error}`);
      }
    }

    return callWasmStaticMethod("Crypto", "sha256", [data], () => {
      throw new Error("SHA-256 JS fallback not implemented");
    });
  }

  static sha512(data: Uint8Array): Uint8Array {
    if (Crypto.useWasm) {
      try {
        const wasmModule = getWasmModule();
        if (typeof wasmModule.Crypto?.sha512 === "function") {
          return wasmModule.Crypto.sha512(data);
        }
      } catch (error) {
        console.warn(`WASM sha512 failed, using JS fallback: ${error}`);
      }
    }

    return callWasmStaticMethod("Crypto", "sha512", [data], () => {
      throw new Error("SHA-512 JS fallback not implemented");
    });
  }

  static hmacSha256(
    key: Uint8Array,
    data: Uint8Array
  ): Result<Uint8Array, CryptoError> {
    if (Crypto.useWasm) {
      try {
        const wasmModule = getWasmModule();
        if (typeof wasmModule.Crypto?.hmac256 === "function") {
          const result = wasmModule.Crypto.hmac256(key, data);
          return Ok(result);
        }
      } catch (error) {
        console.warn(`WASM hmacSha256 failed, using JS fallback: ${error}`);
        return Err(new CryptoError(`HMAC-SHA256 failed: ${error}`));
      }
    }

    try {
      const result = callWasmStaticMethod(
        "Crypto",
        "hmac256",
        [key, data],
        () => {
          throw new Error("HMAC-SHA256 JS fallback not implemented");
        }
      );
      return Ok(result);
    } catch (error) {
      return Err(new CryptoError(`HMAC-SHA256 failed: ${error}`));
    }
  }

  static hmacSha512(
    key: Uint8Array,
    data: Uint8Array
  ): Result<Uint8Array, CryptoError> {
    if (Crypto.useWasm) {
      try {
        const wasmModule = getWasmModule();
        if (typeof wasmModule.Crypto?.hmac512 === "function") {
          const result = wasmModule.Crypto.hmac512(key, data);
          return Ok(result);
        }
      } catch (error) {
        console.warn(`WASM hmacSha512 failed, using JS fallback: ${error}`);
        return Err(new CryptoError(`HMAC-SHA512 failed: ${error}`));
      }
    }

    try {
      const result = callWasmStaticMethod(
        "Crypto",
        "hmac512",
        [key, data],
        () => {
          throw new Error("HMAC-SHA512 JS fallback not implemented");
        }
      );
      return Ok(result);
    } catch (error) {
      return Err(new CryptoError(`HMAC-SHA512 failed: ${error}`));
    }
  }

  static aesGcmEncrypt(
    key: Uint8Array,
    plaintext: Uint8Array
  ): Result<Uint8Array, CryptoError> {
    if (key.length !== 32) {
      return Err(new CryptoError("Key must be 32 bytes (256 bits)"));
    }

    if (Crypto.useWasm) {
      try {
        const wasmModule = getWasmModule();
        if (typeof wasmModule.Crypto?.aesGcmEncrypt === "function") {
          const result = wasmModule.Crypto.aesGcmEncrypt(key, plaintext);
          return Ok(result);
        }
      } catch (error) {
        console.warn(`WASM aesGcmEncrypt failed, using JS fallback: ${error}`);
        return Err(new CryptoError(`AES-GCM encryption failed: ${error}`));
      }
    }

    try {
      const result = callWasmStaticMethod(
        "Crypto",
        "aesGcmEncrypt",
        [key, plaintext],
        () => {
          throw new Error("AES-GCM encryption JS fallback not implemented");
        }
      );
      return Ok(result);
    } catch (error) {
      return Err(new CryptoError(`AES-GCM encryption failed: ${error}`));
    }
  }

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

    if (Crypto.useWasm) {
      try {
        const wasmModule = getWasmModule();
        if (typeof wasmModule.Crypto?.aesGcmDecrypt === "function") {
          const result = wasmModule.Crypto.aesGcmDecrypt(key, ciphertext);
          return Ok(result);
        }
      } catch (error) {
        console.warn(`WASM aesGcmDecrypt failed, using JS fallback: ${error}`);
        return Err(new CryptoError(`AES-GCM decryption failed: ${error}`));
      }
    }

    try {
      const result = callWasmStaticMethod(
        "Crypto",
        "aesGcmDecrypt",
        [key, ciphertext],
        () => {
          throw new Error("AES-GCM decryption JS fallback not implemented");
        }
      );
      return Ok(result);
    } catch (error) {
      return Err(new CryptoError(`AES-GCM decryption failed: ${error}`));
    }
  }

  static randomBytes(length: number): Uint8Array {
    if (Crypto.useWasm) {
      try {
        const wasmModule = getWasmModule();
        if (typeof wasmModule.Crypto?.randomBytes === "function") {
          return wasmModule.Crypto.randomBytes(length);
        }
      } catch (error) {
        console.warn(`WASM randomBytes failed, using JS fallback: ${error}`);
      }
    }

    return callWasmStaticMethod("Crypto", "randomBytes", [length], () => {
      const bytes = new Uint8Array(length);
      if (typeof crypto !== "undefined" && crypto.getRandomValues) {
        crypto.getRandomValues(bytes);
      } else {
        for (let i = 0; i < length; i++) {
          bytes[i] = Math.floor(Math.random() * 256);
        }
      }
      return bytes;
    });
  }
}

export default Crypto;

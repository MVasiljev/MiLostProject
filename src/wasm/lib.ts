import { getWasmModule, isWasmInitialized } from "./init";

export function callWasmInstanceMethod<T>(
  instance: any,
  methodName: string,
  args: any[] = [],
  fallback: () => T
): T {
  if (!isWasmInitialized() || !instance) {
    return fallback();
  }

  try {
    const method = instance[methodName];
    if (typeof method !== "function") {
      return fallback();
    }
    return method.apply(instance, args);
  } catch (error) {
    console.warn(
      `WASM method ${methodName} failed, using JS fallback: ${error}`
    );
    return fallback();
  }
}

export function createWasmInstance<T>(
  className: string,
  args: any[] = [],
  fallback: () => T
): T {
  if (!isWasmInitialized()) {
    return fallback();
  }

  try {
    const wasmModule = getWasmModule();
    const Constructor = wasmModule[className];

    if (typeof Constructor !== "function") {
      return fallback();
    }

    return new Constructor(...args);
  } catch (error) {
    console.warn(
      `WASM constructor ${className} failed, using JS fallback: ${error}`
    );
    return fallback();
  }
}

export function callWasmStaticMethod<T>(
  className: string,
  methodName: string,
  args: any[] = [],
  fallback: () => T
): T {
  if (!isWasmInitialized()) {
    return fallback();
  }

  try {
    const wasmModule = getWasmModule();
    const ClassType = wasmModule[className];

    if (!ClassType || typeof ClassType[methodName] !== "function") {
      return fallback();
    }

    return ClassType[methodName](...args);
  } catch (error) {
    console.warn(
      `WASM static method ${className}.${methodName} failed, using JS fallback: ${error}`
    );
    return fallback();
  }
}

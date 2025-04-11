/**
 * WebAssembly Helper Functions for MiLost
 *
 * This module provides utility functions for working with WebAssembly modules,
 * including calling methods, creating instances, and handling errors.
 */

import { getWasmModule } from "./registry.js";

/**
 * Call a method on a WebAssembly instance with fallback
 *
 * @param instance The WebAssembly instance
 * @param methodName The name of the method to call
 * @param args Arguments to pass to the method
 * @param fallback Fallback function to call if the method fails
 * @returns The result of the method call or fallback
 */
export function callWasmInstanceMethod<T>(
  instance: any,
  methodName: string,
  args: any[] = [],
  fallback: () => T
): T {
  if (!instance) {
    return fallback();
  }

  try {
    const method = instance[methodName];
    if (typeof method !== "function") {
      return fallback();
    }

    return method.apply(instance, args);
  } catch (error) {
    console.warn(`WASM method ${methodName} failed, using JS fallback:`, error);
    return fallback();
  }
}

/**
 * Create a WebAssembly instance with fallback
 *
 * @param className The name of the class to instantiate
 * @param args Arguments to pass to the constructor
 * @param fallback Fallback function to call if instantiation fails
 * @returns The created instance or fallback
 */
export function createWasmInstance<T>(
  className: string,
  args: any[] = [],
  fallback: () => T
): T {
  const wasmModule = getWasmModule();
  if (!wasmModule) {
    return fallback();
  }

  try {
    const Constructor = wasmModule[className];
    if (typeof Constructor !== "function") {
      return fallback();
    }

    return new Constructor(...args);
  } catch (error) {
    console.warn(
      `WASM constructor ${className} failed, using JS fallback:`,
      error
    );
    return fallback();
  }
}

/**
 * Call a static method on a WebAssembly class with fallback
 *
 * @param className The name of the class
 * @param methodName The name of the static method
 * @param args Arguments to pass to the method
 * @param fallback Fallback function to call if the method fails
 * @returns The result of the method call or fallback
 */
export function callWasmStaticMethod<T>(
  className: string,
  methodName: string,
  args: any[] = [],
  fallback: () => T
): T {
  const wasmModule = getWasmModule();
  if (!wasmModule) {
    return fallback();
  }

  try {
    const ClassType = wasmModule[className];
    if (!ClassType || typeof ClassType[methodName] !== "function") {
      return fallback();
    }

    return ClassType[methodName](...args);
  } catch (error) {
    console.warn(
      `WASM static method ${className}.${methodName} failed, using JS fallback:`,
      error
    );
    return fallback();
  }
}

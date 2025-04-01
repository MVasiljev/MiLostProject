/**
 * Initialize the WASM module
 */
export declare function initWasm(): Promise<void>;
/**
 * Get the WASM module
 * Only available after initialization
 */
export declare function getWasmModule(): any;
/**
 * Check if WASM is initialized
 */
export declare function isWasmInitialized(): boolean;

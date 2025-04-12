/**
 * Global type definitions for MiLost
 */

/**
 * Configuration for MiLost WebAssembly integration
 */
export interface MiLostConfig {
  isDevelopment?: boolean;

  wasmBasePath?: string;

  debug?: boolean;

  framework?: "webpack" | "vite" | "nextjs" | "rollup" | "custom";

  originalWasmPath?: string;
}

declare global {
  interface Window {
    __MILOST_DEBUG__?: boolean;

    __MILOST_CONFIG__?: MiLostConfig;
  }
}

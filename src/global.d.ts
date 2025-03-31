// global.d.ts
// This file declares global augmentations for TypeScript

// Make this file a module
export {};

// Declare global augmentations
declare global {
  interface Window {
    wasmModule: any;
    wasmReady: boolean;
    wasmError: Error | null;
  }
}

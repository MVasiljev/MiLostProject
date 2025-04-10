export {};

declare global {
  interface Window {
    wasmModule: any;
    wasmReady: boolean;
    wasmError: Error | null;
  }
}

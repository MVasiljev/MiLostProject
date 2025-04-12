declare module "*.wasm" {
  const wasmUrl: string;
  export default wasmUrl;
}

declare module "*.wasm.js" {
  const init: (input?: RequestInfo | URL | BufferSource) => Promise<any>;
  export default init;
}

declare module "milost/wasm/milost_wasm.js" {
  const init: (input?: RequestInfo | URL | BufferSource) => Promise<any>;
  export default init;
}

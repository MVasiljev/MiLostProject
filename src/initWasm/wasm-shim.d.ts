declare module "*.wasm.js" {
  const init: (input?: RequestInfo | URL) => Promise<any>;
  export default init;
}

declare module "milost/wasm/milost_wasm.js" {
  const init: (input?: RequestInfo | URL) => Promise<any>;
  export default init;
}

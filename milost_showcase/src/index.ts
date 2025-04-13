import { fileURLToPath, pathToFileURL } from "url";
import path from "path";
import fs from "fs/promises";
import express from "express";

import {
  initWasm,
  getWasmModule,
  isWasmInitialized,
  setExternalWasmInstance,
} from "milost";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ❗ Go UP out of src/, then into node_modules
const wasmBinaryPath = path.resolve(
  __dirname,
  "../node_modules/milost/dist/wasm/milost_wasm_bg.wasm"
);

const wasmJsPath = path.resolve(
  __dirname,
  "../node_modules/milost/dist/wasm/milost_wasm.js"
);

async function loadWasm() {
  const wasmInit = (await import(pathToFileURL(wasmJsPath).href)).default;
  const binary = await fs.readFile(wasmBinaryPath);
  const instance = await wasmInit(binary);

  setExternalWasmInstance(instance);
  await initWasm({ skipWasmLoading: true, debug: true });

  console.log("✅ WASM Initialized:", isWasmInitialized());
  console.log("📦 Exports:", Object.keys(getWasmModule()).slice(0, 10));
}

await loadWasm();

const app = express();
const port = 3000;

app.get("/status", (req, res) => {
  res.json({
    wasmReady: isWasmInitialized(),
    exports: Object.keys(getWasmModule()).slice(0, 10),
  });
});

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});

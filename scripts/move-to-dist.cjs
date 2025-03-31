const fs = require("fs");
const path = require("path");

const DIST = path.join(__dirname, "..", "dist");
const PKG = path.join(__dirname, "..", "pkg");
const WASM_SRC = path.join(__dirname, "..", "lib", "wasm", "index.ts");

if (!fs.existsSync(DIST)) {
  fs.mkdirSync(DIST);
}

// Copy .wasm-related files
const filesToCopy = [
  "milost_wasm.js",
  "milost_wasm_bg.js",
  "milost_wasm.d.ts",
  "milost_wasm_bg.wasm",
];

for (const file of filesToCopy) {
  const src = path.join(PKG, file);
  const dest = path.join(DIST, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`✔ Copied ${file}`);
  } else {
    console.warn(`⚠ File not found: ${file}`);
  }
}

// Copy the manual bridge (wasm wrapper)
const manualBridgeDest = path.join(DIST, "index.ts");
fs.copyFileSync(WASM_SRC, manualBridgeDest);
console.log(`✔ Added manual WASM wrapper`);

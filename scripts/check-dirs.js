// check-dirs.js
const fs = require("fs");
const path = require("path");

// Project root directory (going up one level from scripts)
const rootDir = path.resolve(__dirname, "..");

console.log("Checking directory structure...");
console.log(`Root directory: ${rootDir}`);

// Check if dist directory exists
const distDir = path.join(rootDir, "dist");
if (!fs.existsSync(distDir)) {
  console.error(`Error: 'dist' directory does not exist at ${distDir}`);
} else {
  console.log(`✓ 'dist' directory exists`);

  // Check if lib directory exists in dist
  const distLibDir = path.join(distDir, "lib");
  if (!fs.existsSync(distLibDir)) {
    console.error(
      `Error: 'dist/lib' directory does not exist at ${distLibDir}`
    );
  } else {
    console.log(`✓ 'dist/lib' directory exists`);

    // Check for wasm directory
    const wasmDir = path.join(distLibDir, "wasm");
    if (!fs.existsSync(wasmDir)) {
      console.error(
        `Error: 'dist/lib/wasm' directory does not exist at ${wasmDir}`
      );
    } else {
      console.log(`✓ 'dist/lib/wasm' directory exists`);

      // Check for init.js
      const initJsPath = path.join(wasmDir, "init.js");
      if (!fs.existsSync(initJsPath)) {
        console.error(`Error: 'init.js' file does not exist at ${initJsPath}`);
      } else {
        console.log(`✓ 'init.js' file exists`);
      }
    }

    // Check for types directory
    const typesDir = path.join(distLibDir, "types");
    if (!fs.existsSync(typesDir)) {
      console.error(
        `Error: 'dist/lib/types' directory does not exist at ${typesDir}`
      );
    } else {
      console.log(`✓ 'dist/lib/types' directory exists`);

      // Check for string.js
      const stringJsPath = path.join(typesDir, "string.js");
      if (!fs.existsSync(stringJsPath)) {
        console.error(
          `Error: 'string.js' file does not exist at ${stringJsPath}`
        );
      } else {
        console.log(`✓ 'string.js' file exists`);
      }
    }
  }
}

// Check WASM files
const pkgDir = path.join(rootDir, "pkg");
if (!fs.existsSync(pkgDir)) {
  console.error(`Error: 'pkg' directory does not exist at ${pkgDir}`);
} else {
  console.log(`✓ 'pkg' directory exists`);

  // Check for WASM file
  const wasmPath = path.join(pkgDir, "milost_wasm_bg.wasm");
  if (!fs.existsSync(wasmPath)) {
    console.error(
      `Error: 'milost_wasm_bg.wasm' file does not exist at ${wasmPath}`
    );
  } else {
    console.log(`✓ 'milost_wasm_bg.wasm' file exists`);
  }

  // Check for JS glue code
  const jsPath = path.join(pkgDir, "milost_wasm.js");
  if (!fs.existsSync(jsPath)) {
    console.error(`Error: 'milost_wasm.js' file does not exist at ${jsPath}`);
  } else {
    console.log(`✓ 'milost_wasm.js' file exists`);
  }
}

console.log("\nDone checking directory structure.");

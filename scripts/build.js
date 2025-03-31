// scripts/build.js
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// Project root directory
const rootDir = path.resolve(__dirname, "..");

// Directories
const WASM_CRATE_DIR = path.join(rootDir, "crates/wasm");
const WASM_PKG_SOURCE_DIR = path.join(WASM_CRATE_DIR, "pkg");
const WASM_PKG_TARGET_DIR = path.join(rootDir, "pkg");
const TS_SOURCE_DIR = path.join(rootDir, "src");
const TS_TARGET_DIR = path.join(rootDir, "dist");

// Make sure a directory exists
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    console.log(`Creating directory: ${dir}`);
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Copy files from one directory to another
function copyDir(sourceDir, targetDir) {
  ensureDir(targetDir);

  const files = fs.readdirSync(sourceDir);
  for (const file of files) {
    const sourcePath = path.join(sourceDir, file);
    const targetPath = path.join(targetDir, file);

    if (fs.statSync(sourcePath).isDirectory()) {
      copyDir(sourcePath, targetPath);
    } else {
      fs.copyFileSync(sourcePath, targetPath);
      console.log(`Copied: ${sourcePath} -> ${targetPath}`);
    }
  }
}

// Build the WASM module
function buildWasm() {
  console.log("\n--- Building WASM module ---");

  try {
    // Navigate to the wasm crate directory
    process.chdir(WASM_CRATE_DIR);
    console.log(`Current directory: ${process.cwd()}`);

    // Build with wasm-pack targeting web
    console.log("Running wasm-pack build...");
    execSync("wasm-pack build --target web", { stdio: "inherit" });

    // Copy the generated files to the root pkg directory
    console.log(`Copying WASM files to ${WASM_PKG_TARGET_DIR}`);
    ensureDir(WASM_PKG_TARGET_DIR);

    // Copy all files from crates/wasm/pkg to root pkg directory
    copyDir(WASM_PKG_SOURCE_DIR, WASM_PKG_TARGET_DIR);

    console.log("WASM module built successfully");
  } catch (error) {
    console.error("Failed to build WASM module:", error);
    process.exit(1);
  } finally {
    // Return to the root directory
    process.chdir(rootDir);
  }
}

// Build the TypeScript library
function buildTs() {
  console.log("\n--- Building TypeScript library ---");

  try {
    process.chdir(rootDir);
    console.log(`Current directory: ${process.cwd()}`);

    // Compile the TypeScript code
    console.log("Running TypeScript compiler...");
    execSync("tsc -p tsconfig.json", { stdio: "inherit" });

    // Add JS extensions to imports if needed
    if (fs.existsSync(path.join(rootDir, "scripts/add-js-extensions.js"))) {
      console.log("Adding .js extensions to imports...");
      execSync("node scripts/add-js-extensions.js", { stdio: "inherit" });
    }

    console.log("TypeScript library built successfully");
  } catch (error) {
    console.error("Failed to build TypeScript library:", error);
    process.exit(1);
  }
}

// Clean build directories
function clean() {
  console.log("\n--- Cleaning build directories ---");

  const dirsToClean = [WASM_PKG_TARGET_DIR, TS_TARGET_DIR];

  for (const dir of dirsToClean) {
    if (fs.existsSync(dir)) {
      console.log(`Removing directory: ${dir}`);
      fs.rmSync(dir, { recursive: true, force: true });
    }
  }

  console.log("Clean completed");
}

// Main function
function main() {
  const args = process.argv.slice(2);

  if (args.includes("--clean")) {
    clean();
  } else if (args.includes("--wasm")) {
    buildWasm();
  } else if (args.includes("--ts")) {
    buildTs();
  } else if (args.includes("--all")) {
    clean();
    buildWasm();
    buildTs();
  } else {
    console.log("Usage: node build.js [--clean|--wasm|--ts|--all]");
    console.log("  --clean  Clean build directories");
    console.log("  --wasm   Build the WASM module");
    console.log("  --ts     Build the TypeScript library");
    console.log("  --all    Clean and build everything");
  }
}

main();

// scripts/build.js
import fs from "fs-extra";
import path from "path";
import { execSync } from "child_process";

const BUILD_CONFIG = {
  paths: {
    root: path.resolve(process.cwd()),
    wasmCrate: path.resolve(process.cwd(), "crates/wasm"),
    dist: path.resolve(process.cwd(), "dist"),
    wasmOutput: path.resolve(process.cwd(), "dist/wasm"),
  },
};

function log(message, type = "info") {
  const colors = {
    info: "\x1b[36m%s\x1b[0m", // Cyan
    success: "\x1b[32m%s\x1b[0m", // Green
    warning: "\x1b[33m%s\x1b[0m", // Yellow
    error: "\x1b[31m%s\x1b[0m", // Red
  };
  console.log(colors[type], message);
}

function validateWasmBinary(filePath) {
  try {
    const buffer = fs.readFileSync(filePath);

    // Check WASM magic number (0x00 0x61 0x73 0x6D = \0asm)
    const magicBytes = buffer.slice(0, 4);
    if (
      magicBytes[0] !== 0x00 ||
      magicBytes[1] !== 0x61 ||
      magicBytes[2] !== 0x73 ||
      magicBytes[3] !== 0x6d
    ) {
      throw new Error("Invalid WASM binary");
    }

    return true;
  } catch (error) {
    log(`WASM validation failed: ${error.message}`, "error");
    return false;
  }
}

function buildWasm() {
  log("🏗️  Building WebAssembly module", "info");

  try {
    // Ensure wasm output directory exists
    fs.ensureDirSync(BUILD_CONFIG.paths.wasmOutput);

    // Change to WASM crate directory
    process.chdir(BUILD_CONFIG.paths.wasmCrate);

    // Build with wasm-pack
    execSync("wasm-pack build --target web --release", { stdio: "inherit" });

    // Find generated files
    const pkgDir = path.join(BUILD_CONFIG.paths.wasmCrate, "pkg");
    const files = fs.readdirSync(pkgDir);

    // Look for the key files
    const wasmBgFile = files.find((f) => f.endsWith("_bg.wasm"));
    const wasmJsFile = files.find(
      (f) => f.endsWith(".js") && !f.endsWith(".d.js")
    );
    const wasmTsFile = files.find((f) => f.endsWith(".d.ts"));

    if (!wasmBgFile || !wasmJsFile) {
      throw new Error("WASM build artifacts not found");
    }

    log(`Found WASM binary: ${wasmBgFile}`, "info");
    log(`Found WASM JS module: ${wasmJsFile}`, "info");
    if (wasmTsFile) {
      log(`Found TypeScript definitions: ${wasmTsFile}`, "info");
    }

    // Copy files without renaming to maintain the expected structure
    const sourceWasmBg = path.join(pkgDir, wasmBgFile);
    const sourceWasmJs = path.join(pkgDir, wasmJsFile);

    const targetWasmBg = path.join(BUILD_CONFIG.paths.wasmOutput, wasmBgFile);
    const targetWasmJs = path.join(BUILD_CONFIG.paths.wasmOutput, wasmJsFile);

    // Validate WASM binary before copying
    if (!validateWasmBinary(sourceWasmBg)) {
      throw new Error("Invalid WASM binary generated");
    }

    // Copy all files from the pkg directory to maintain the full structure
    fs.copySync(pkgDir, BUILD_CONFIG.paths.wasmOutput);

    // 🧹 Remove .gitignore if present
    const gitignorePath = path.join(
      BUILD_CONFIG.paths.wasmOutput,
      ".gitignore"
    );
    if (fs.existsSync(gitignorePath)) {
      fs.removeSync(gitignorePath);
      log(`🧹 Removed .gitignore from WASM output`, "info");
    }

    log(`✅ WASM built and copied successfully:`, "success");
    log(`   - ${wasmBgFile}`, "success");
    log(`   - ${wasmJsFile}`, "success");

    return true;
  } catch (error) {
    log(`❌ WASM build failed: ${error.message}`, "error");
    return false;
  } finally {
    // Return to original directory
    process.chdir(BUILD_CONFIG.paths.root);
  }
}

function buildTypeScript() {
  log("🔨 Compiling TypeScript", "info");

  try {
    execSync("tsc -p tsconfig.json", { stdio: "inherit" });
    log("✅ TypeScript compiled successfully", "success");
    return true;
  } catch (error) {
    log(`❌ TypeScript compilation failed: ${error.message}`, "error");
    return false;
  }
}

function main() {
  const command = process.argv[2] || "all";

  switch (command) {
    case "wasm":
      buildWasm();
      break;
    case "ts":
      buildTypeScript();
      break;
    case "all":
    default:
      buildWasm() && buildTypeScript();
      break;
  }
}

main();

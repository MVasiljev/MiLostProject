// build.js - Simplified WASM build process
import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.resolve(__dirname, "..");

// Directory paths
const WASM_CRATE_DIR = path.join(rootDir, "crates/wasm");
const WASM_PKG_SOURCE_DIR = path.join(WASM_CRATE_DIR, "pkg");
const TS_SOURCE_DIR = path.join(rootDir, "src");
const TS_TARGET_DIR = path.join(rootDir, "dist");
const WASM_TARGET_DIR = path.join(TS_TARGET_DIR, "wasm");

// Helper functions
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function copyBinaryFile(sourcePath, targetPath) {
  // Read file as a buffer to preserve binary data
  const buffer = fs.readFileSync(sourcePath);
  fs.writeFileSync(targetPath, buffer);

  // Verify magic bytes for WASM files
  if (path.extname(sourcePath) === ".wasm") {
    const verifyBuffer = fs.readFileSync(targetPath);
    if (verifyBuffer.length >= 4) {
      const magicBytes = Array.from(verifyBuffer.slice(0, 4))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join(" ");

      if (magicBytes !== "00 61 73 6d") {
        console.error(
          `⚠️ Warning: WASM file ${path.basename(
            targetPath
          )} has incorrect magic bytes: ${magicBytes}`
        );
      } else {
        console.log(
          `✅ WASM file ${path.basename(targetPath)} verified successfully (${
            verifyBuffer.length
          } bytes)`
        );
      }
    }
  }
}

function copyFile(sourcePath, targetPath) {
  // Use binary mode for WASM and other binary files
  if ([".wasm", ".bin", ".data"].includes(path.extname(sourcePath))) {
    copyBinaryFile(sourcePath, targetPath);
  } else {
    // Regular copy for text files
    fs.copyFileSync(sourcePath, targetPath);
  }
}

// Clean up build directories
function clean() {
  console.log("🧹 Cleaning build directories...");

  const dirsToClean = [
    TS_TARGET_DIR,
    // Do NOT clean src/wasm - we don't want WASM in src anymore
  ];

  for (const dir of dirsToClean) {
    if (fs.existsSync(dir)) {
      fs.rmSync(dir, { recursive: true, force: true });
      console.log(`Removed: ${dir}`);
    }
  }
}

// Build the WASM module
function buildWasm() {
  console.log("🔨 Building WASM module...");

  try {
    process.chdir(WASM_CRATE_DIR);
    execSync("wasm-pack build --target web --out-dir pkg", {
      stdio: "inherit",
    });
    console.log("✅ WASM build completed successfully");
  } catch (error) {
    console.error("❌ Failed to build WASM module:", error);
    process.exit(1);
  } finally {
    process.chdir(rootDir);
  }
}

// Copy WASM files directly to dist
function copyWasmToDist() {
  console.log("📦 Copying WASM files to dist...");

  ensureDir(WASM_TARGET_DIR);

  if (!fs.existsSync(WASM_PKG_SOURCE_DIR)) {
    console.error(
      `❌ WASM package source directory not found: ${WASM_PKG_SOURCE_DIR}`
    );
    process.exit(1);
  }

  // Copy all files from the WASM package directly to dist/wasm
  const files = fs.readdirSync(WASM_PKG_SOURCE_DIR);
  for (const file of files) {
    const sourcePath = path.join(WASM_PKG_SOURCE_DIR, file);
    const targetPath = path.join(WASM_TARGET_DIR, file);

    if (fs.statSync(sourcePath).isDirectory()) {
      // Copy subdirectories if any
      copyDir(sourcePath, targetPath);
    } else {
      copyFile(sourcePath, targetPath);
      console.log(`Copied: ${file} to dist/wasm`);
    }
  }

  // Verify the WASM binary size
  const wasmFile = path.join(WASM_TARGET_DIR, "milost_wasm_bg.wasm");
  if (fs.existsSync(wasmFile)) {
    const stats = fs.statSync(wasmFile);
    console.log(`📊 WASM binary size: ${stats.size} bytes`);
  } else {
    console.error(`❌ WASM binary not found in target directory: ${wasmFile}`);
  }
}

// Build TypeScript
function buildTs() {
  console.log("🔨 Building TypeScript...");

  try {
    // Make sure src/wasm does NOT exist to avoid confusion
    const srcWasmDir = path.join(TS_SOURCE_DIR, "wasm");
    if (fs.existsSync(srcWasmDir)) {
      console.log(`🧹 Removing WASM files from src directory...`);
      fs.rmSync(srcWasmDir, { recursive: true, force: true });
    }

    // Add type definitions
    createGlobalDtsFile();

    // Build TypeScript
    execSync("tsc -p tsconfig.json", { stdio: "inherit" });
    console.log("✅ TypeScript build completed successfully");

    // Add JS extensions if needed
    const extensionsScriptPath = path.join(
      rootDir,
      "scripts/add-js-extensions.js"
    );
    if (fs.existsSync(extensionsScriptPath)) {
      try {
        execSync("node scripts/add-js-extensions.js", { stdio: "inherit" });
      } catch (error) {
        console.warn("⚠️ Could not add .js extensions to imports:", error);
      }
    }
  } catch (error) {
    console.error("❌ Failed to build TypeScript:", error);
    process.exit(1);
  }
}

function validateWasmBinary(wasmPath) {
  if (!fs.existsSync(wasmPath)) {
    console.error(`❌ WASM file not found: ${wasmPath}`);
    process.exit(1);
  }

  const fd = fs.openSync(wasmPath, "r");
  const buffer = Buffer.alloc(4);
  fs.readSync(fd, buffer, 0, 4, 0);
  fs.closeSync(fd);

  const magic = buffer.toString("hex");
  if (magic !== "0061736d") {
    console.error(`❌ Invalid WASM binary: wrong magic bytes (${magic})`);
    process.exit(1);
  }

  console.log(`✅ Valid WASM binary (${wasmPath})`);
}

// Create TypeScript definition files
function createGlobalDtsFile() {
  const globalDtsPath = path.join(TS_SOURCE_DIR, "global.d.ts");

  if (!fs.existsSync(globalDtsPath)) {
    const globalDtsContent = `export {};

declare global {
  interface Window {
    __MILOST_CONFIG__?: {
      isDevelopment?: boolean;
      wasmBasePath?: string;
      debug?: boolean;
      framework?: "webpack" | "vite" | "nextjs" | "rollup" | "custom";
    };
    __MILOST_DEBUG__?: boolean;
  }
}
`;
    fs.writeFileSync(globalDtsPath, globalDtsContent);
    console.log("✅ Created global.d.ts");
  }

  // Create WASM typings
  const wasmDtsPath = path.join(TS_SOURCE_DIR, "wasm.d.ts");
  if (!fs.existsSync(wasmDtsPath)) {
    const wasmDtsContent = `declare module "*.wasm" {
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
`;
    fs.writeFileSync(wasmDtsPath, wasmDtsContent);
    console.log("✅ Created wasm.d.ts");
  }
}

// Update package.json to correctly export WASM files
function updatePackageJson() {
  console.log("📝 Updating package.json...");

  const pkgJsonPath = path.join(rootDir, "package.json");

  if (fs.existsSync(pkgJsonPath)) {
    const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, "utf-8"));

    // Set exports
    pkgJson.exports = {
      ".": {
        import: "./dist/index.js",
        require: "./dist/index.js",
        types: "./dist/index.d.ts",
      },
      "./wasm/*": "./dist/wasm/*",
      "./wasm": {
        import: "./dist/wasm/milost_wasm.js",
        types: "./dist/wasm/milost_wasm.d.ts",
      },
    };

    // Ensure WASM files are included
    if (!pkgJson.files) {
      pkgJson.files = [];
    }

    if (!pkgJson.files.includes("dist")) {
      pkgJson.files.push("dist");
    }

    // Remove any references to src/wasm
    pkgJson.files = pkgJson.files.filter((file) => file !== "src/wasm");

    fs.writeFileSync(pkgJsonPath, JSON.stringify(pkgJson, null, 2));
    console.log("✅ Updated package.json");
  } else {
    console.warn("⚠️ package.json not found");
  }
}

// Create server configuration file for proper MIME types
function createServerConfig() {
  console.log("📝 Creating server configuration files...");

  // Create .htaccess for Apache servers
  const htaccessPath = path.join(rootDir, ".htaccess");
  const htaccessContent = `# Serve WebAssembly files with proper MIME type
AddType application/wasm .wasm
AddType application/javascript .js .mjs

# CORS headers
<IfModule mod_headers.c>
    Header set Access-Control-Allow-Origin "*"
    Header set X-Content-Type-Options "nosniff"
    # Ensure WASM files are served with correct Content-Type
    <FilesMatch "\\.wasm$">
        Header set Content-Type "application/wasm"
    </FilesMatch>
</IfModule>
`;
  fs.writeFileSync(htaccessPath, htaccessContent);

  // Create web.config for IIS servers
  const webConfigPath = path.join(rootDir, "web.config");
  const webConfigContent = `<?xml version="1.0" encoding="UTF-8"?>
<configuration>
  <system.webServer>
    <staticContent>
      <remove fileExtension=".wasm" />
      <mimeMap fileExtension=".wasm" mimeType="application/wasm" />
    </staticContent>
    <httpProtocol>
      <customHeaders>
        <add name="Access-Control-Allow-Origin" value="*" />
      </customHeaders>
    </httpProtocol>
  </system.webServer>
</configuration>
`;
  fs.writeFileSync(webConfigPath, webConfigContent);

  console.log("✅ Created server configuration files");
}

// Create helper files for direct browser loading
function createLoaderHelpers() {
  console.log("📝 Creating WASM loader helpers...");

  const loaderPath = path.join(WASM_TARGET_DIR, "wasm-loader.js");
  const loaderContent = `/**
 * Helper for loading MiLost WASM in browser environments
 */
export async function loadMiLostWasm(options = {}) {
  const { wasmUrl, jsUrl, debug = false } = options;
  
  // Default paths relative to the current directory
  const defaultJsUrl = './milost_wasm.js';
  const defaultWasmUrl = './milost_wasm_bg.wasm';
  
  const actualJsUrl = jsUrl || defaultJsUrl;
  const actualWasmUrl = wasmUrl || defaultWasmUrl;
  
  if (debug) {
    console.log(\`Loading MiLost WASM from JS: \${actualJsUrl}, WASM: \${actualWasmUrl}\`);
  }
  
  try {
    // Step 1: Import the JS glue code
    const wasmModuleImport = await import(actualJsUrl);
    const initWasm = wasmModuleImport.default;
    
    if (typeof initWasm !== 'function') {
      throw new Error('WASM JS module did not export an initialization function');
    }
    
    // Step 2: Fetch the WASM binary
    const response = await fetch(actualWasmUrl);
    if (!response.ok) {
      throw new Error(\`Failed to fetch WASM file: \${response.status} \${response.statusText}\`);
    }
    
    const wasmBinary = await response.arrayBuffer();
    
    // Step 3: Initialize the WASM module
    const wasmModule = await initWasm(wasmBinary);
    
    if (debug) {
      console.log('WASM module initialized successfully');
    }
    
    return wasmModule;
  } catch (error) {
    console.error('Failed to load MiLost WASM:', error);
    throw error;
  }
}

// Simple helper for browser script tags
if (typeof window !== 'undefined') {
  window.loadMiLostWasm = loadMiLostWasm;
}
`;
  fs.writeFileSync(loaderPath, loaderContent);
  console.log("✅ Created WASM loader helper");
}

// Copy a directory recursively
function copyDir(sourceDir, targetDir) {
  ensureDir(targetDir);

  const files = fs.readdirSync(sourceDir);
  for (const file of files) {
    const sourcePath = path.join(sourceDir, file);
    const targetPath = path.join(targetDir, file);

    if (fs.statSync(sourcePath).isDirectory()) {
      copyDir(sourcePath, targetPath);
    } else {
      copyFile(sourcePath, targetPath);
    }
  }
}

// Main function
function main() {
  const args = process.argv.slice(2);

  if (args.includes("--clean")) {
    clean();
  } else if (args.includes("--wasm")) {
    // Build WASM and copy to dist
    clean();
    buildWasm();
    validateWasmBinary("dist/wasm/milost_wasm_bg.wasm");
    ensureDir(TS_TARGET_DIR);
    copyWasmToDist();
    createLoaderHelpers();
  } else if (args.includes("--ts")) {
    // Build TypeScript (make sure there's no src/wasm)
    buildTs();
    updatePackageJson();
  } else if (args.includes("--all")) {
    // Full build process
    clean();
    buildWasm();
    ensureDir(TS_TARGET_DIR);
    copyWasmToDist();
    buildTs();
    updatePackageJson();
    createServerConfig();
    createLoaderHelpers();
  } else {
    console.log("Usage: node build.js [--clean|--wasm|--ts|--all]");
    console.log("  --clean   Clean build directories");
    console.log("  --wasm    Build WASM module and copy to dist");
    console.log("  --ts      Build TypeScript (no WASM in src)");
    console.log("  --all     Perform complete build");
  }
}

main();

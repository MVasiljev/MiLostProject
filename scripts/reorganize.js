// scripts/reorganize.js
const fs = require("fs");
const path = require("path");

// Project root directory
const rootDir = path.resolve(__dirname, "..");

// Source and destination directories
const sourceDir = path.join(rootDir, "lib");
const destDir = path.join(rootDir, "src");

// Make sure a directory exists
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    console.log(`Creating directory: ${dir}`);
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Copy a directory recursively
function copyDir(source, destination) {
  ensureDir(destination);

  const entries = fs.readdirSync(source, { withFileTypes: true });

  for (const entry of entries) {
    const sourcePath = path.join(source, entry.name);
    const destPath = path.join(destination, entry.name);

    if (entry.isDirectory()) {
      copyDir(sourcePath, destPath);
    } else {
      fs.copyFileSync(sourcePath, destPath);
      console.log(`Copied: ${sourcePath} -> ${destPath}`);
    }
  }
}

// Create the new structure
function createStructure() {
  console.log("Creating new project structure...");

  // Ensure src directory exists
  ensureDir(destDir);

  // Copy lib to src if lib exists
  if (fs.existsSync(sourceDir)) {
    console.log(`Copying files from ${sourceDir} to ${destDir}`);
    copyDir(sourceDir, destDir);
  } else {
    console.log(
      `Source directory ${sourceDir} does not exist, creating src structure from scratch`
    );

    // Create basic structure
    const directories = [
      path.join(destDir, "core"),
      path.join(destDir, "types"),
      path.join(destDir, "wasm"),
    ];

    for (const dir of directories) {
      ensureDir(dir);
    }
  }

  // Create index.ts if it doesn't exist
  const indexPath = path.join(destDir, "index.ts");
  if (!fs.existsSync(indexPath)) {
    console.log(`Creating index.ts`);

    const indexContent = `// MiLost - A Rust-like TypeScript library
// Re-export all public modules

// Core exports
export * from './core/index.js';

// Types exports
export * from './types/index.js';
`;

    fs.writeFileSync(indexPath, indexContent);
  }

  // Create wasm/init.ts if it doesn't exist
  const wasmInitPath = path.join(destDir, "wasm/init.ts");
  if (!fs.existsSync(wasmInitPath)) {
    console.log(`Creating wasm/init.ts`);

    const wasmInitContent = `// WASM initialization module
let wasmModule: any = null;
let initPromise: Promise<any> | null = null;

/**
 * Initialize the WASM module
 * @returns A promise that resolves when the WASM module is initialized
 */
export async function initWasm(): Promise<void> {
  // If already initialized, return immediately
  if (wasmModule) {
    return;
  }
  
  // If initialization is in progress, wait for it to complete
  if (initPromise) {
    await initPromise;
    return;
  }
  
  // Start initialization
  initPromise = (async () => {
    try {
      // Dynamic import of the WASM module
      const module = await import('../../pkg/milost_wasm.js');
      
      // Initialize the WASM module
      await module.default();
      
      // Store the initialized module
      wasmModule = module;
      
      return module;
    } catch (error) {
      console.error('Failed to initialize WASM module:', error);
      throw error;
    }
  })();
  
  await initPromise;
}

/**
 * Get the initialized WASM module
 * @returns The initialized WASM module
 * @throws Error if the WASM module is not initialized
 */
export function getWasmModule(): any {
  if (!wasmModule) {
    throw new Error('WASM module not initialized. Call initWasm() first.');
  }
  return wasmModule;
}
`;

    fs.writeFileSync(wasmInitPath, wasmInitContent);
  }

  console.log("Project structure reorganization completed");
}

// Main function
function main() {
  createStructure();
}

main();

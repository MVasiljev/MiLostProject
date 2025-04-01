import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.resolve(__dirname, "..");

const WASM_CRATE_DIR = path.join(rootDir, "crates/wasm");
const WASM_PKG_SOURCE_DIR = path.join(WASM_CRATE_DIR, "pkg");
const WASM_PKG_TARGET_DIR = path.join(rootDir, "pkg");
const TS_SOURCE_DIR = path.join(rootDir, "src");
const TS_TARGET_DIR = path.join(rootDir, "dist");

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    console.log(`Creating directory: ${dir}`);
    fs.mkdirSync(dir, { recursive: true });
  }
}

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

function createGlobalDtsFile() {
  console.log("\n--- Creating TypeScript global declarations ---");

  const globalDtsPath = path.join(TS_SOURCE_DIR, "global.d.ts");

  if (!fs.existsSync(globalDtsPath)) {
    const globalDtsContent = `// global.d.ts
// This file declares global augmentations for TypeScript

// Make this file a module
export {};

// Declare global augmentations
declare global {
  interface Window {
    wasmModule: any;
    wasmReady: boolean;
    wasmError: Error | null;
  }
}
`;

    fs.writeFileSync(globalDtsPath, globalDtsContent);
    console.log(`Created global.d.ts file at ${globalDtsPath}`);
  } else {
    console.log(`global.d.ts file already exists at ${globalDtsPath}`);
  }
}

function buildWasm() {
  console.log("\n--- Building WASM module ---");

  try {
    process.chdir(WASM_CRATE_DIR);
    console.log(`Current directory: ${process.cwd()}`);

    console.log("Running wasm-pack build...");
    execSync("wasm-pack build --target web --out-dir ../../pkg", {
      stdio: "inherit",
    });

    console.log("WASM module built successfully");
  } catch (error) {
    console.error("Failed to build WASM module:", error);
    process.exit(1);
  } finally {
    process.chdir(rootDir);
  }
}

function buildTs() {
  console.log("\n--- Building TypeScript library ---");

  try {
    process.chdir(rootDir);
    console.log(`Current directory: ${process.cwd()}`);

    createGlobalDtsFile();

    console.log("Running TypeScript compiler...");
    execSync("tsc -p tsconfig.json", { stdio: "inherit" });

    const extensionsScriptPath = path.join(
      rootDir,
      "scripts/add-js-extensions.js"
    );
    if (fs.existsSync(extensionsScriptPath)) {
      console.log("Adding .js extensions to imports...");
      try {
        execSync("node scripts/add-js-extensions.js", { stdio: "inherit" });
      } catch (error) {
        console.warn(
          "Could not add .js extensions to imports. This might cause issues in ES modules."
        );
      }
    }

    console.log("TypeScript library built successfully");
  } catch (error) {
    console.error("Failed to build TypeScript library:", error);
    process.exit(1);
  }
}

function createTestHtml() {
  console.log("\n--- Creating test HTML file ---");

  const testHtmlPath = path.join(rootDir, "test-wasm.html");
  const testHtmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MiLost WASM Test</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
    .container { border: 1px solid #ccc; border-radius: 5px; padding: 15px; margin-top: 20px; }
    h1 { color: #333; }
    #output { background: #f5f5f5; padding: 10px; border-radius: 3px; min-height: 200px; }
    .success { color: green; }
    .error { color: red; }
  </style>
</head>
<body>
  <h1>MiLost WASM Test</h1>
  
  <div class="container">
    <div id="output"></div>
  </div>

  <script type="module">
    // Output element
    const output = document.getElementById('output');
    
    // Helper function to log output
    function log(message, isError = false, isSuccess = false) {
      console.log(message);
      const p = document.createElement('p');
      p.textContent = message;
      if (isError) p.className = 'error';
      if (isSuccess) p.className = 'success';
      output.appendChild(p);
    }
    
    // Initialize WASM
    async function init() {
      try {
        log('Loading WASM module...');
        
        // Import and initialize the WASM module
        const wasm = await import('/pkg/milost_wasm.js');
        await wasm.default();
        
        log('WASM module loaded successfully!', false, true);
        
        // Create a test string
        const str = new wasm.Str("Hello from WASM!");
        log(\`Test string created: \${str.unwrap()}\`);
        
        log(\`String length: \${str.len()}\`);
        log(\`Is empty: \${str.is_empty()}\`);
        log(\`Contains "WASM": \${str.contains("WASM")}\`);
        
        const upper = str.to_uppercase();
        log(\`Uppercase: \${upper.unwrap()}\`);
        
        const lower = str.to_lowercase();
        log(\`Lowercase: \${lower.unwrap()}\`);
        
        const trimmedUpper = new wasm.Str("  hello, world!  ")
          .to_uppercase()
          .trim();
        log(\`Trimmed uppercase: "\${trimmedUpper.unwrap()}"\`);
        
        log('All tests completed successfully!', false, true);
      } catch (error) {
        log(\`Error: \${error.message}\`, true);
        console.error('Error:', error);
      }
    }
    
    init();
  </script>
</body>
</html>`;

  fs.writeFileSync(testHtmlPath, testHtmlContent);
  console.log(`Test HTML file created: ${testHtmlPath}`);
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

// Create .htaccess file
function createHtaccess() {
  console.log("\n--- Creating .htaccess file ---");

  const htaccessPath = path.join(rootDir, ".htaccess");
  const htaccessContent = `# .htaccess for proper MIME types and CORS
# Proper MIME types for JavaScript and WASM
AddType application/javascript .js .mjs
AddType application/wasm .wasm

# CORS headers
<IfModule mod_headers.c>
    Header set Access-Control-Allow-Origin "*"
    Header set X-Content-Type-Options "nosniff"
</IfModule>

# Performance settings
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresDefault "access plus 1 month"
    
    # Set caching for WASM and JS files
    ExpiresByType application/wasm "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 month"
</IfModule>

# Fix for module imports without extensions
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME}.js -f
    RewriteRule ^(.*)$ $1.js [L]
</IfModule>
`;

  fs.writeFileSync(htaccessPath, htaccessContent);
  console.log(`Created .htaccess file at ${htaccessPath}`);
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
    createTestHtml();
    createHtaccess();
    console.log("\n--- Build completed successfully ---");
    console.log(
      "To test the WASM module, run a web server and open test-wasm.html"
    );
  } else {
    console.log("Usage: node build.js [--clean|--wasm|--ts|--all]");
    console.log("  --clean  Clean build directories");
    console.log("  --wasm   Build the WASM module");
    console.log("  --ts     Build the TypeScript library");
    console.log("  --all    Clean and build everything");
  }
}

main();

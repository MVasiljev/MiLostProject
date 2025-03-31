// scripts/build-all.js
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// Project root directory
const rootDir = path.resolve(__dirname, "..");
console.log(`Root directory: ${rootDir}`);

// Create necessary directories
function createDirIfNotExists(dir) {
  if (!fs.existsSync(dir)) {
    console.log(`Creating directory: ${dir}`);
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Step 1: Build WASM module
function buildWasm() {
  console.log("\n--- Building WASM module ---");

  try {
    // Navigate to the wasm crate directory
    process.chdir(path.join(rootDir, "crates/wasm"));
    console.log(`Current directory: ${process.cwd()}`);

    // Build with wasm-pack targeting web
    console.log("Running wasm-pack build...");
    execSync("wasm-pack build --target web", { stdio: "inherit" });

    // Copy the generated files to the root pkg directory
    const pkgDir = path.join(rootDir, "pkg");
    createDirIfNotExists(pkgDir);

    // Copy all files from crates/wasm/pkg to root pkg directory
    const wasmPkgDir = path.join(rootDir, "crates/wasm/pkg");
    console.log(`Copying files from ${wasmPkgDir} to ${pkgDir}`);

    fs.readdirSync(wasmPkgDir).forEach((file) => {
      fs.copyFileSync(path.join(wasmPkgDir, file), path.join(pkgDir, file));
      console.log(`Copied ${file}`);
    });

    console.log("WASM module built successfully");
  } catch (error) {
    console.error("Failed to build WASM module:", error);
    process.exit(1);
  } finally {
    // Return to the root directory
    process.chdir(rootDir);
  }
}

// Step 2: Build TypeScript
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

// Step 3: Create a simple test file
function createTestFile() {
  console.log("\n--- Creating test file ---");

  const testHtmlPath = path.join(rootDir, "test-wasm.html");
  const testHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MiLost WASM Test</title>
</head>
<body>
  <h1>MiLost WASM Test</h1>
  <div id="output">Loading...</div>

  <script type="module">
    // Import the WASM module
    async function init() {
      try {
        const output = document.getElementById('output');
        output.innerHTML = '<p>Loading WASM module...</p>';
        
        // Import and initialize the WASM module
        const wasm = await import('./pkg/milost_wasm.js');
        await wasm.default();
        
        // Create a test string
        const wasmStr = new wasm.Str("Hello from WASM!");
        
        output.innerHTML += '<p>WASM module loaded successfully!</p>';
        output.innerHTML += \`<p>Test string: \${wasmStr.toString()}</p>\`;
        output.innerHTML += \`<p>Length: \${wasmStr.len()}</p>\`;
      } catch (error) {
        document.getElementById('output').innerHTML = \`
          <p>Error loading WASM module:</p>
          <pre>\${error.message}</pre>
          <pre>\${error.stack}</pre>
        \`;
        console.error('Error:', error);
      }
    }
    
    init();
  </script>
</body>
</html>`;

  fs.writeFileSync(testHtmlPath, testHtml);
  console.log(`Test file created: ${testHtmlPath}`);
}

// Step 4: Create .htaccess for local servers
function createHtaccess() {
  console.log("\n--- Creating .htaccess file ---");

  const htaccessPath = path.join(rootDir, ".htaccess");
  const htaccessContent = `# Proper MIME types for JavaScript and WASM
AddType application/javascript .js
AddType application/wasm .wasm

# CORS headers if needed
<IfModule mod_headers.c>
    Header set Access-Control-Allow-Origin "*"
</IfModule>
`;

  fs.writeFileSync(htaccessPath, htaccessContent);
  console.log(`.htaccess file created: ${htaccessPath}`);
}

// Step 5: Create server.js
function createServer() {
  console.log("\n--- Creating Express server ---");

  const serverPath = path.join(rootDir, "server.js");
  const serverContent = `const express = require('express');
const path = require('path');
const app = express();
const port = 8080;

// Set appropriate MIME types
app.use((req, res, next) => {
  // Set correct MIME types for JavaScript and WASM files
  if (req.path.endsWith('.js')) {
    res.type('application/javascript');
  } else if (req.path.endsWith('.wasm')) {
    res.type('application/wasm');
  }
  next();
});

// Serve static files from the current directory
app.use(express.static(__dirname, {
  // Set appropriate headers for all responses
  setHeaders: (res) => {
    // Disable caching for development
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
}));

// Start the server
app.listen(port, () => {
  console.log(\`Server running at http://localhost:\${port}\`);
  console.log(\`Try accessing http://localhost:\${port}/test-wasm.html\`);
});
`;

  fs.writeFileSync(serverPath, serverContent);
  console.log(`Express server created: ${serverPath}`);
}

// Main function
function main() {
  console.log("Starting build process...");

  // Build everything
  buildWasm();
  buildTs();
  createTestFile();
  createHtaccess();
  createServer();

  console.log("\n--- Build process completed ---");
  console.log("To run the server:");
  console.log("1. Install Express if needed: npm install express");
  console.log("2. Start the server: node server.js");
  console.log("3. Access the test page: http://localhost:8080/test-wasm.html");
}

main();

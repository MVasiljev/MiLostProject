// scripts/setup.js
import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { fileURLToPath } from "url";

// Get current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Project root directory
const rootDir = path.resolve(__dirname, "..");

// Set up the example directory
function setupExample() {
  console.log("\n--- Setting up example directory ---");

  const exampleDir = path.join(rootDir, "example");

  // Create example directory if it doesn't exist
  if (!fs.existsSync(exampleDir)) {
    console.log(`Creating directory: ${exampleDir}`);
    fs.mkdirSync(exampleDir, { recursive: true });
  }

  // Create index.html in the example directory
  const indexPath = path.join(exampleDir, "index.html");

  // Copy from the updated example html
  const exampleHtmlContent = fs.readFileSync(
    path.join(rootDir, "example-updated.html"),
    "utf8"
  );

  fs.writeFileSync(indexPath, exampleHtmlContent);
  console.log(`Created example/index.html`);

  console.log("Example setup completed");
}

// Create a basic README if it doesn't exist
function createReadme() {
  console.log("\n--- Creating README.md ---");

  const readmePath = path.join(rootDir, "README.md");

  if (!fs.existsSync(readmePath)) {
    const readmeContent = `# MiLost

A Rust-like TypeScript library with WebAssembly optimizations.

## Project Structure

\`\`\`
milost/
├── src/           # TypeScript source code
│   ├── core/      # Core TypeScript implementations
│   ├── types/     # TypeScript type definitions
│   └── wasm/      # WASM bindings and integration
├── crates/        # Rust code
│   ├── core/      # Core Rust implementations 
│   └── wasm/      # WASM bindings
├── dist/          # Built TypeScript code (generated)
├── pkg/           # Built WASM code (generated)
├── example/       # Example code using the library
├── scripts/       # Build scripts
└── package.json   # Node package definition
\`\`\`

## Development Setup

1. **Prerequisites**
   - Node.js (v16+)
   - Rust and Cargo
   - wasm-pack (\`cargo install wasm-pack\`)

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Build the library**
   \`\`\`bash
   # Build everything (WASM + TypeScript)
   npm run build
   
   # Build only WASM
   npm run build:wasm
   
   # Build only TypeScript
   npm run build:ts
   \`\`\`

4. **Run development server**
   \`\`\`bash
   npm run dev
   \`\`\`

## Usage

\`\`\`typescript
import { Str, Option, Result } from 'milost';

// Use Rust-like types in TypeScript
const str = await Str.create('Hello, MiLost!');
console.log(str.toString());  // Hello, MiLost!
console.log(str.len());       // 15
\`\`\`

## WASM Module 

The library uses WebAssembly for performance-critical operations. The WASM module is loaded asynchronously, so remember to await initialization:

\`\`\`typescript
import { initWasm, Str } from 'milost';

// Initialize WASM
await initWasm();

// Now you can use WASM-accelerated features
const str = Str.fromRaw('This uses WASM under the hood');
\`\`\`
`;

    fs.writeFileSync(readmePath, readmeContent);
    console.log(`Created README.md`);
  } else {
    console.log(`README.md already exists, skipping`);
  }
}

// Create a proper MIME types server script
function createServerScript() {
  console.log("\n--- Creating server script ---");

  const serverPath = path.join(rootDir, "server.js");

  const serverContent = `import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 8080;

// Set proper MIME types
app.use((req, res, next) => {
  if (req.path.endsWith('.js')) {
    res.type('application/javascript');
  } else if (req.path.endsWith('.wasm')) {
    res.type('application/wasm');
  } else if (req.path.endsWith('.mjs')) {
    res.type('application/javascript');
  }
  next();
});

// Disable caching for development
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

// Serve static files from project root
app.use(express.static(__dirname));

// Log all requests
app.use((req, res, next) => {
  console.log(\`\${req.method} \${req.url}\`);
  next();
});

// Start the server
app.listen(port, () => {
  console.log(\`Server running at http://localhost:\${port}\`);
  console.log(\`Try the example at http://localhost:\${port}/example/\`);
});
`;

  fs.writeFileSync(serverPath, serverContent);
  console.log(`Created server.js`);

  // Make sure Express is listed as a dependency in package.json
  let packageContent = {};
  const packagePath = path.join(rootDir, "package.json");

  if (fs.existsSync(packagePath)) {
    try {
      packageContent = JSON.parse(fs.readFileSync(packagePath, "utf8"));
    } catch (error) {
      console.error("Error reading package.json:", error);
    }
  }

  if (!packageContent.dependencies) {
    packageContent.dependencies = {};
  }

  if (!packageContent.dependencies.express) {
    packageContent.dependencies.express = "^4.18.2";

    try {
      fs.writeFileSync(packagePath, JSON.stringify(packageContent, null, 2));
      console.log("Added express to package.json dependencies");
    } catch (error) {
      console.error("Error writing to package.json:", error);
    }
  }
}

// Update package.json scripts
function updatePackageJson() {
  console.log("\n--- Updating package.json scripts ---");

  const packagePath = path.join(rootDir, "package.json");

  if (fs.existsSync(packagePath)) {
    try {
      const packageContent = JSON.parse(fs.readFileSync(packagePath, "utf8"));

      // Add/update scripts
      packageContent.scripts = {
        ...packageContent.scripts,
        clean: "node scripts/build.js --clean",
        "build:wasm": "node scripts/build.js --wasm",
        "build:ts": "node scripts/build.js --ts",
        build: "node scripts/build.js --all",
        dev: "node server.js",
        "fix-ts": "node scripts/fix-typescript.js --all",
      };

      fs.writeFileSync(packagePath, JSON.stringify(packageContent, null, 2));
      console.log("Updated package.json scripts");
    } catch (error) {
      console.error("Error updating package.json:", error);
    }
  } else {
    console.error("package.json not found");
  }
}

// Main function
function main() {
  // Save the updated example HTML
  const exampleHtmlPath = path.join(rootDir, "example-updated.html");
  const exampleHtml = fs.readFileSync(
    path.join(rootDir, "updated-example-html.html"),
    "utf8"
  );
  fs.writeFileSync(exampleHtmlPath, exampleHtml);

  // Set up the example directory
  setupExample();

  // Create a README if it doesn't exist
  createReadme();

  // Create a proper server script
  createServerScript();

  // Update package.json scripts
  updatePackageJson();

  console.log("\n--- Project setup completed ---");
  console.log("Next steps:");
  console.log("1. Run npm install to install dependencies");
  console.log("2. Run npm run build to build the project");
  console.log("3. Run npm run dev to start the development server");
  console.log("4. Open http://localhost:8080/example/ in your browser");
}

main();

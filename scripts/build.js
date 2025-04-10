import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.resolve(__dirname, "..");

const WASM_CRATE_DIR = path.join(rootDir, "crates/wasm");
const WASM_PKG_SOURCE_DIR = path.join(WASM_CRATE_DIR, "pkg");
const TS_SOURCE_DIR = path.join(rootDir, "src");
const TS_TARGET_DIR = path.join(rootDir, "dist");

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
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
    }
  }
}

function createGlobalDtsFile() {
  const globalDtsPath = path.join(TS_SOURCE_DIR, "global.d.ts");

  if (!fs.existsSync(globalDtsPath)) {
    const globalDtsContent = `export {};

declare global {
  interface Window {
    wasmModule: any;
    wasmReady: boolean;
    wasmError: Error | null;
  }
}
`;
    fs.writeFileSync(globalDtsPath, globalDtsContent);
  }
}

function buildWasm() {
  try {
    process.chdir(WASM_CRATE_DIR);

    execSync("wasm-pack build --target web --out-dir pkg", {
      stdio: "inherit",
    });
  } catch (error) {
    console.error("Failed to build WASM module:", error);
    process.exit(1);
  } finally {
    process.chdir(rootDir);
  }
}

function copyWasmToSrc() {
  const targetDir = path.join(TS_SOURCE_DIR, "wasm");

  if (fs.existsSync(targetDir)) {
    fs.rmSync(targetDir, { recursive: true, force: true });
  }

  ensureDir(targetDir);
  copyDir(WASM_PKG_SOURCE_DIR, targetDir);
}

function copyWasmToDist() {
  const sourceDir = path.join(TS_SOURCE_DIR, "wasm");
  const targetDir = path.join(TS_TARGET_DIR, "wasm");

  ensureDir(targetDir);
  copyDir(sourceDir, targetDir);
}

function buildTs() {
  try {
    process.chdir(rootDir);
    createGlobalDtsFile();

    execSync("tsc -p tsconfig.json", { stdio: "inherit" });

    const extensionsScriptPath = path.join(
      rootDir,
      "scripts/add-js-extensions.js"
    );
    if (fs.existsSync(extensionsScriptPath)) {
      try {
        execSync("node scripts/add-js-extensions.js", { stdio: "inherit" });
      } catch (error) {
        console.warn(
          "Could not add .js extensions to imports. This might cause issues in ES modules."
        );
      }
    }
  } catch (error) {
    console.error("Failed to build TypeScript library:", error);
    process.exit(1);
  }
}

function updateExportsInPackageJson() {
  const pkgJsonPath = path.join(rootDir, "package.json");

  if (fs.existsSync(pkgJsonPath)) {
    const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, "utf-8"));

    pkgJson.exports = {
      ".": {
        import: "./dist/index.js",
        require: "./dist/index.js",
        types: "./dist/index.d.ts",
      },
      "./wasm": {
        import: "./dist/wasm-index.js",
        require: "./dist/wasm-index.js",
        types: "./dist/wasm-index.d.ts",
      },
      "./wasm/*": "./dist/wasm/*",
    };

    fs.writeFileSync(pkgJsonPath, JSON.stringify(pkgJson, null, 2));
  }
}

function clean() {
  const dirsToClean = [TS_TARGET_DIR];

  for (const dir of dirsToClean) {
    if (fs.existsSync(dir)) {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  }
}

function createHtaccess() {
  const htaccessPath = path.join(rootDir, ".htaccess");
  const htaccessContent = `AddType application/javascript .js .mjs
AddType application/wasm .wasm

<IfModule mod_headers.c>
    Header set Access-Control-Allow-Origin "*"
    Header set X-Content-Type-Options "nosniff"
</IfModule>

<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresDefault "access plus 1 month"
    
    ExpiresByType application/wasm "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 month"
</IfModule>

<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME}.js -f
    RewriteRule ^(.*)$ $1.js [L]
</IfModule>
`;

  fs.writeFileSync(htaccessPath, htaccessContent);
}

function main() {
  const args = process.argv.slice(2);

  if (args.includes("--clean")) {
    clean();
  } else if (args.includes("--wasm")) {
    buildWasm();
    copyWasmToSrc();
  } else if (args.includes("--ts")) {
    buildTs();
    copyWasmToDist();
    updateExportsInPackageJson();
  } else if (args.includes("--all")) {
    clean();
    buildWasm();
    copyWasmToSrc();
    buildTs();
    copyWasmToDist();
    updateExportsInPackageJson();
    createHtaccess();
  } else {
    console.log("Usage: node build.js [--clean|--wasm|--ts|--all]");
    console.log("  --clean  Clean build directories");
    console.log("  --wasm   Build the WASM module");
    console.log("  --ts     Build the TypeScript library");
    console.log("  --all    Clean and build everything");
  }
}

main();

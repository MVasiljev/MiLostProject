// scripts/fix-js-extensions.js
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Project root directory
const rootDir = path.resolve(__dirname, "..");

// Directory containing compiled JavaScript files
const distDir = path.join(rootDir, "dist");

// Find all JS files in the directory and its subdirectories
function findJsFiles(dir) {
  const results = [];

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      results.push(...findJsFiles(fullPath));
    } else if (entry.name.endsWith(".js")) {
      results.push(fullPath);
    }
  }

  return results;
}

// Add .js extensions to imports
function addJsExtensions(filePath) {
  console.log(`Processing ${filePath}`);

  let content = fs.readFileSync(filePath, "utf8");
  let modified = false;

  // Regular expression to match import statements without file extensions
  // This handles both single and double quotes, and different import syntaxes
  const importRegex = /from\s+(['"])([^'"]+)(?:\.js)?(['"])/g;

  content = content.replace(
    importRegex,
    (match, quote1, importPath, quote2) => {
      // Skip external modules and absolute paths that don't start with /
      if (!importPath.startsWith(".") && !importPath.startsWith("/")) {
        return match;
      }

      // Skip if it already has a file extension
      if (path.extname(importPath) !== "") {
        return match;
      }

      modified = true;
      return `from ${quote1}${importPath}.js${quote2}`;
    }
  );

  // Save the file if it was modified
  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`  Added .js extensions to imports in ${filePath}`);
  } else {
    console.log(`  No changes needed in ${filePath}`);
  }
}

// Main function
function main() {
  if (!fs.existsSync(distDir)) {
    console.error(`Error: Dist directory ${distDir} not found`);
    process.exit(1);
  }

  console.log(`Finding JS files in ${distDir}...`);
  const jsFiles = findJsFiles(distDir);
  console.log(`Found ${jsFiles.length} JS files`);

  console.log("\nAdding .js extensions to imports...");
  for (const file of jsFiles) {
    addJsExtensions(file);
  }

  console.log("\nDone!");
}

main();

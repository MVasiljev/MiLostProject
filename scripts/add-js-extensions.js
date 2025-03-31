// scripts/add-js-extensions.js
const fs = require("fs");
const path = require("path");

// Project root directory
const rootDir = path.resolve(__dirname, "..");
const distDir = path.join(rootDir, "dist");

/**
 * Add .js extensions to imports in the compiled JS files
 * This is necessary for ES modules to work in browsers
 * @param {string} dir The directory to process
 */
function addJsExtensions(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });

  for (const file of files) {
    const filePath = path.join(dir, file.name);

    if (file.isDirectory()) {
      // Recursively process subdirectories
      addJsExtensions(filePath);
    } else if (file.name.endsWith(".js")) {
      // Process JavaScript files
      let content = fs.readFileSync(filePath, "utf8");

      // Find import statements without .js extension
      const importRegex = /from ['"]([^'"]+)['"]/g;
      let match;
      let newContent = content;

      while ((match = importRegex.exec(content)) !== null) {
        const importPath = match[1];

        // Skip external modules and those that already have extensions
        if (
          (!importPath.startsWith(".") && !importPath.startsWith("/")) ||
          importPath.endsWith(".js")
        ) {
          continue;
        }

        // Add .js extension
        const newImportPath = `${importPath}.js`;
        newContent = newContent.replace(
          `from '${importPath}'`,
          `from '${newImportPath}'`
        );
        newContent = newContent.replace(
          `from "${importPath}"`,
          `from "${newImportPath}"`
        );
      }

      // Write the modified content back to the file
      if (newContent !== content) {
        fs.writeFileSync(filePath, newContent, "utf8");
        console.log(`Added .js extensions to imports in ${filePath}`);
      }
    }
  }
}

// Check if the dist directory exists
if (!fs.existsSync(distDir)) {
  console.error(
    `Dist directory '${distDir}' does not exist. Build the TypeScript code first.`
  );
  process.exit(1);
}

console.log("Adding .js extensions to imports in compiled JS files...");
addJsExtensions(distDir);
console.log("Done.");

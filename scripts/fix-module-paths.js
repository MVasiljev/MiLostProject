// scripts/fix-module-paths.js
const fs = require("fs");
const path = require("path");
const glob = require("glob");

// Find all JS files in dist
const files = glob.sync("dist/**/*.js");
console.log(`Found ${files.length} files to process`);

files.forEach((file) => {
  let content = fs.readFileSync(file, "utf8");

  // Fix problematic imports
  const originalContent = content;

  // Fix specific problematic imports
  content = content.replace(
    /from ['"]\.\.\/types\.js['"]/g,
    "from '../types/index.js'"
  );
  content = content.replace(
    /from ['"]\.\.\/core\.js['"]/g,
    "from '../core/index.js'"
  );
  content = content.replace(/from ['"]\.\.['"]/g, "from '../index.js'");
  content = content.replace(/from ['"]\.\.js['"]/g, "from '../index.js'");

  // Only write if changed
  if (content !== originalContent) {
    console.log(`Fixed imports in: ${file}`);
    fs.writeFileSync(file, content);
  }
});

console.log("Module path fixing completed");

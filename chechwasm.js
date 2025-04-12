const fs = require("fs");
const path = require("path");
function inspectWasmFiles(directory) {
  // Check if directory exists
  if (!fs.existsSync(directory)) {
    console.log("Directory ${directory} does not exist.");
    return;
  }
  console.log(`Inspecting directory: ${directory}`);
  const files = fs.readdirSync(directory);
  files.forEach((file) => {
    const fullPath = path.join(directory, file);
    const stats = fs.statSync(fullPath);
    // Skip directories
    if (stats.isDirectory()) {
      console.log(`Skipping directory: ${file}`);
      return;
    }

    console.log(`File: ${file}`);
    console.log(`Size: ${stats.size} bytes`);

    try {
      // Read first 50 bytes to inspect
      const buffer = Buffer.alloc(50);
      const fd = fs.openSync(fullPath, "r");
      fs.readSync(fd, buffer, 0, 50, 0);
      fs.closeSync(fd);

      console.log("First 50 bytes (hex):");
      console.log(buffer.toString("hex"));
      console.log("First 50 bytes (text):");
      console.log(
        buffer.toString("utf-8").replace(/[\x00-\x1F\x7F-\x9F]/g, ".")
      );
    } catch (error) {
      console.error(`Error reading file ${file}:`, error);
    }

    console.log("---");
  });
}
// Directories to inspect
const directories = ["./crates/wasm/pkg", "./dist/wasm", "./src/wasm"];
// Inspect each directory
directories.forEach(inspectWasmFiles);

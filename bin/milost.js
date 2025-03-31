#!/usr/bin/env node
const { execSync } = require("child_process");
const path = require("path");

// Dynamically find the CLI executable
function findCliExecutable() {
  const possiblePaths = [
    path.join(__dirname, "../target/release/milost"),
    path.join(__dirname, "../target/debug/milost"),
    path.join(__dirname, "../../target/release/milost"),
    path.join(__dirname, "../../target/debug/milost"),
  ];

  for (const execPath of possiblePaths) {
    try {
      // Check if file exists and is executable
      execSync(`test -x ${execPath}`);
      return execPath;
    } catch {
      // File doesn't exist or isn't executable, continue searching
      continue;
    }
  }

  throw new Error("Could not find milost CLI executable");
}

try {
  const cliPath = findCliExecutable();
  const args = process.argv.slice(2);

  // Execute the Rust CLI with forwarded arguments
  const result = execSync(`${cliPath} ${args.join(" ")}`, {
    stdio: "inherit",
  });
} catch (error) {
  console.error("Failed to run milost CLI:", error);
  process.exit(1);
}

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// Process command line arguments
const args = process.argv.slice(2);
const PROJECT_ROOT = process.cwd();
let START_DIR = PROJECT_ROOT;

// Check for --dirname argument
for (let i = 0; i < args.length; i++) {
  if (args[i].startsWith("--")) {
    const dirName = args[i].slice(2);
    const potentialDir = path.join(PROJECT_ROOT, dirName);

    if (
      fs.existsSync(potentialDir) &&
      fs.statSync(potentialDir).isDirectory()
    ) {
      START_DIR = potentialDir;
      console.log(`Starting snapshot from directory: ${dirName}`);
    } else {
      console.warn(
        `Warning: Directory '${dirName}' not found, using project root instead.`
      );
    }
    break;
  }
}

const IGNORE_FILE = path.join(PROJECT_ROOT, ".gitignore");
const MAX_WORDS_PER_FILE = 6000;
let currentWords = 0;
let snapshotIndex = 1;
let outputFile = `project_snapshot_${snapshotIndex}.txt`;

// Directories to ignore
let IGNORE_DIRS = ["node_modules", "dist", "build", "target", ".git"];

// Read additional ignores from .gitignore
if (fs.existsSync(IGNORE_FILE)) {
  const gitignoreContent = fs.readFileSync(IGNORE_FILE, "utf8");
  gitignoreContent.split("\n").forEach((line) => {
    line = line.trim();
    if (!line || line.startsWith("#")) return;
    IGNORE_DIRS.push(line);
  });
}

// Function to write data to the current snapshot file
function writeToFile(data) {
  const wordCount = data.split(/\s+/).length;
  if (currentWords + wordCount > MAX_WORDS_PER_FILE) {
    snapshotIndex++;
    outputFile = `project_snapshot_${snapshotIndex}.txt`;
    currentWords = 0;
  }
  fs.appendFileSync(outputFile, data);
  currentWords += wordCount;
}

// Get relative path for display in tree command
const relativeStartDir = path.relative(PROJECT_ROOT, START_DIR);
const treeStartDir = relativeStartDir || ".";

// Generate directory tree
writeToFile("# Project Structure\n");
try {
  const treeCommand = `tree -L 3 -I "${IGNORE_DIRS.join("|")}" ${treeStartDir}`;
  const treeOutput = execSync(treeCommand, { encoding: "utf8" });
  writeToFile(treeOutput + "\n");
} catch (err) {
  try {
    const treeCliCommand = `npx tree-cli -l 3 --ignore "${IGNORE_DIRS.join(
      ","
    )}" ${treeStartDir}`;
    const treeCliOutput = execSync(treeCliCommand, { encoding: "utf8" });
    writeToFile(treeCliOutput + "\n");
  } catch (err) {
    writeToFile("(tree command not found, skipping directory tree)\n");
  }
}

writeToFile("\n# Project Snapshot\n\n");

// Recursively scan directory
function scanDirectory(dir) {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const fullPath = path.join(dir, file);
    const relPath = path.relative(PROJECT_ROOT, fullPath);
    if (IGNORE_DIRS.some((ignore) => relPath.includes(ignore))) return;

    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      scanDirectory(fullPath);
    } else {
      const ext = path.extname(file).slice(1);
      try {
        const content = fs.readFileSync(fullPath, "utf8");
        const fileData = `\n📄 ${relPath}\n\n\`\`\`${ext}\n${content}\n\`\`\`\n`;
        writeToFile(fileData);
      } catch (err) {
        writeToFile(`📄 ${relPath} (Error reading file)\n`);
      }
    }
  });
}

// Start scanning from the specified directory
scanDirectory(START_DIR);

console.log(
  `Project snapshot saved to project_snapshot_*.txt (started from ${
    START_DIR === PROJECT_ROOT
      ? "project root"
      : "directory: " + path.relative(PROJECT_ROOT, START_DIR)
  })`
);

import fs from "fs";
import path from "path";

const baseDir = path.resolve("./src");
const invalidImports: { file: string, line: number, code: string }[] = [];

function walk(dir: string, cb: (filePath: string) => void) {
  for (const file of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      walk(fullPath, cb);
    } else if (file.endsWith(".ts")) {
      cb(fullPath);
    }
  }
}

function checkFile(filePath: string) {
  const lines = fs.readFileSync(filePath, "utf-8").split("\n");

  lines.forEach((line, idx) => {
    const match = line.match(/from\s+["'](\.\/|\.\.\/)[^"']+["']/);
    if (match) {
      const importPath = match[0];
      const isValid =
        importPath.endsWith('.js"') ||
        importPath.endsWith(".js'") ||
        importPath.endsWith('/index.js"') ||
        importPath.endsWith("/index.js'");
      if (!isValid) {
        invalidImports.push({
          file: filePath,
          line: idx + 1,
          code: line.trim(),
        });
      }
    }
  });
}

walk(baseDir, checkFile);

if (invalidImports.length === 0) {
  console.log("✅ All ESM imports are valid!");
} else {
  console.error("❌ Invalid ESM imports found (missing .js or /index.js):\n");
  for (const entry of invalidImports) {
    console.log(`→ ${entry.file}:${entry.line}`);
    console.log(`   ${entry.code}\n`);
  }
  process.exit(1);
}

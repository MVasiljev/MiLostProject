"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var node_process_1 = require("node:process");
var fs = require("fs/promises");
var path = require("path");
var readline = require("readline");
var child_process_1 = require("child_process");
function prompt(question) {
    var rl = readline.createInterface({
        input: node_process_1.default.stdin,
        output: node_process_1.default.stdout,
    });
    return new Promise(function (resolve) {
        rl.question(question, function (answer) {
            rl.close();
            resolve(answer);
        });
    });
}
function executeCommand(command, args, cwd) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    var childProcess = (0, child_process_1.spawn)(command, args, {
                        cwd: cwd,
                        stdio: "inherit",
                        shell: node_process_1.default.platform === "win32", // Use shell on Windows
                    });
                    childProcess.on("close", function (code) {
                        if (code === 0)
                            resolve();
                        else
                            reject(new Error("Command ".concat(command, " ").concat(args.join(" "), " failed with code ").concat(code)));
                    });
                })];
        });
    });
}
function createProject() {
    return __awaiter(this, void 0, void 0, function () {
        var projectName, description, useTypeScript, installDeps, projectDir, overwrite, err_1, dirs, _i, dirs_1, dir, packageJson, indexHtml, viteConfig, mainTsx, appTsx, appCss, indexCss, readmeMd, gitignore, eslintrcJson, tsconfigJson, tsconfigNodeJson, buttonComponentTsx, useLocalStorageTsx, error_1, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, prompt("Project name: ")];
                case 1:
                    projectName = _a.sent();
                    return [4 /*yield*/, prompt("Project description (optional): ")];
                case 2:
                    description = _a.sent();
                    return [4 /*yield*/, prompt("Use TypeScript? (Y/n): ")];
                case 3:
                    useTypeScript = (_a.sent()).toLowerCase() !== "n";
                    return [4 /*yield*/, prompt("Install dependencies? (Y/n): ")];
                case 4:
                    installDeps = (_a.sent()).toLowerCase() !== "n";
                    projectDir = path.resolve(node_process_1.default.cwd(), projectName);
                    _a.label = 5;
                case 5:
                    _a.trys.push([5, 8, , 9]);
                    return [4 /*yield*/, fs.access(projectDir)];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, prompt("Directory ".concat(projectName, " already exists. Overwrite? (y/N): "))];
                case 7:
                    overwrite = _a.sent();
                    if (overwrite.toLowerCase() !== "y") {
                        console.log("Operation cancelled.");
                        return [2 /*return*/];
                    }
                    return [3 /*break*/, 9];
                case 8:
                    err_1 = _a.sent();
                    return [3 /*break*/, 9];
                case 9:
                    console.log("\nCreating project: ".concat(projectName));
                    dirs = [
                        "src",
                        "src/styles",
                        "src/components",
                        "src/hooks",
                        "src/utils",
                        "public",
                    ];
                    _i = 0, dirs_1 = dirs;
                    _a.label = 10;
                case 10:
                    if (!(_i < dirs_1.length)) return [3 /*break*/, 13];
                    dir = dirs_1[_i];
                    return [4 /*yield*/, fs.mkdir(path.join(projectDir, dir), { recursive: true })];
                case 11:
                    _a.sent();
                    _a.label = 12;
                case 12:
                    _i++;
                    return [3 /*break*/, 10];
                case 13:
                    packageJson = {
                        name: projectName,
                        version: "0.1.0",
                        description: description || "",
                        type: "module",
                        scripts: {
                            dev: "vite",
                            build: "tsc && vite build",
                            preview: "vite preview",
                            lint: "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
                            test: "vitest run",
                        },
                        dependencies: {
                            milost: "latest",
                            react: "^18.2.0",
                            "react-dom": "^18.2.0",
                        },
                        devDependencies: {
                            "@types/react": "^18.0.28",
                            "@types/react-dom": "^18.0.11",
                            "@typescript-eslint/eslint-plugin": "^6.0.0",
                            "@typescript-eslint/parser": "^6.0.0",
                            "@vitejs/plugin-react": "^3.1.0",
                            eslint: "^8.45.0",
                            "eslint-plugin-react-hooks": "^4.6.0",
                            "eslint-plugin-react-refresh": "^0.4.3",
                            typescript: "^4.9.3",
                            vite: "^4.2.0",
                            vitest: "^0.34.4",
                        },
                    };
                    indexHtml = "\n<!DOCTYPE html>\n<html lang=\"en\">\n  <head>\n    <meta charset=\"UTF-8\" />\n    <link rel=\"icon\" type=\"image/svg+xml\" href=\"/vite.svg\" />\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n    <title>".concat(projectName, "</title>\n  </head>\n  <body>\n    <div id=\"root\"></div>\n    <script type=\"module\" src=\"/src/main.tsx\"></script>\n  </body>\n</html>\n");
                    viteConfig = "\nimport { defineConfig } from 'vite';\nimport react from '@vitejs/plugin-react';\n\nexport default defineConfig({\n  plugins: [react()],\n  server: {\n    port: 3000,\n    open: true\n  },\n  build: {\n    outDir: 'dist',\n    sourcemap: true\n  },\n  test: {\n    globals: true,\n    environment: 'jsdom'\n  }\n});\n";
                    mainTsx = "\nimport React from 'react';\nimport ReactDOM from 'react-dom/client';\nimport App from './App';\nimport './styles/index.css';\n\nReactDOM.createRoot(document.getElementById('root')!).render(\n  <React.StrictMode>\n    <App />\n  </React.StrictMode>\n);\n";
                    appTsx = "\nimport React, { useState } from 'react';\nimport { Str } from 'milost';\nimport './styles/App.css';\n\nfunction App() {\n  const [message] = useState(Str.create('Hello, MiLost!'));\n\n  return (\n    <div className=\"app\">\n      <header className=\"app-header\">\n        <h1>{message.toUpperCase().unwrap()}</h1>\n        <p>Edit <code>src/App.tsx</code> and save to reload.</p>\n      </header>\n    </div>\n  );\n}\n\nexport default App;\n";
                    appCss = "\n.app {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  min-height: 100vh;\n  text-align: center;\n}\n\n.app-header {\n  padding: 2rem;\n}\n\ncode {\n  background-color: #f5f5f5;\n  padding: 0.2em 0.4em;\n  border-radius: 3px;\n  font-family: monospace;\n}\n";
                    indexCss = "\n:root {\n  --primary-color: #646cff;\n  --background-color: #ffffff;\n  --text-color: #213547;\n}\n\n@media (prefers-color-scheme: dark) {\n  :root {\n    --primary-color: #747bff;\n    --background-color: #213547;\n    --text-color: rgba(255, 255, 255, 0.87);\n  }\n}\n\n* {\n  box-sizing: border-box;\n  margin: 0;\n  padding: 0;\n}\n\nbody {\n  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;\n  line-height: 1.5;\n  color: var(--text-color);\n  background-color: var(--background-color);\n  font-synthesis: none;\n  text-rendering: optimizeLegibility;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}\n\na {\n  text-decoration: none;\n  color: var(--primary-color);\n}\n\na:hover {\n  text-decoration: underline;\n}\n";
                    readmeMd = "\n# ".concat(projectName, "\n\n").concat(description || "A React project using MiLost library", "\n\n## Getting Started\n\nThese instructions will get you a copy of the project up and running on your local machine for development and testing purposes.\n\n### Prerequisites\n\n- Node.js (v14 or later)\n- npm or yarn\n\n### Installation\n\n1. Clone the repository\n2. Install dependencies:\n\n```bash\nnpm install\n# or\nyarn install\n```\n\n3. Start the development server:\n\n```bash\nnpm run dev\n# or\nyarn dev\n```\n\n## Built With\n\n- [React](https://reactjs.org/) - Frontend library\n- [TypeScript](https://www.typescriptlang.org/) - Type safety\n- [Vite](https://vitejs.dev/) - Build tool\n- [MiLost](https://github.com/your-username/milost) - MiLost library\n\n## License\n\nThis project is licensed under the MIT License - see the LICENSE file for details.\n");
                    gitignore = "\n# Logs\nlogs\n*.log\nnpm-debug.log*\nyarn-debug.log*\nyarn-error.log*\npnpm-debug.log*\nlerna-debug.log*\n\n# Dependencies\nnode_modules\n.pnp\n.pnp.js\n\n# Build\ndist\ndist-ssr\n*.local\nbuild\n\n# Testing\ncoverage\n\n# Editor directories and files\n.vscode/*\n!.vscode/extensions.json\n!.vscode/settings.json\n.idea\n.DS_Store\n*.suo\n*.ntvs*\n*.njsproj\n*.sln\n*.sw?\n\n# Environment variables\n.env\n.env.local\n.env.development.local\n.env.test.local\n.env.production.local\n";
                    eslintrcJson = {
                        root: true,
                        env: {
                            browser: true,
                            es2020: true,
                        },
                        extends: [
                            "eslint:recommended",
                            "plugin:@typescript-eslint/recommended",
                            "plugin:react-hooks/recommended",
                        ],
                        ignorePatterns: ["dist", ".eslintrc.json"],
                        parser: "@typescript-eslint/parser",
                        plugins: ["react-refresh"],
                        rules: {
                            "react-refresh/only-export-components": [
                                "warn",
                                { allowConstantExport: true },
                            ],
                        },
                    };
                    tsconfigJson = {
                        compilerOptions: {
                            target: "ES2020",
                            useDefineForClassFields: true,
                            lib: ["ES2020", "DOM", "DOM.Iterable"],
                            module: "ESNext",
                            skipLibCheck: true,
                            esModuleInterop: true,
                            allowSyntheticDefaultImports: true,
                            strict: true,
                            forceConsistentCasingInFileNames: true,
                            moduleResolution: "node",
                            resolveJsonModule: true,
                            isolatedModules: true,
                            noEmit: true,
                            jsx: "react-jsx",
                            paths: {
                                "@/*": ["./src/*"],
                            },
                        },
                        include: ["src"],
                        references: [{ path: "./tsconfig.node.json" }],
                    };
                    tsconfigNodeJson = {
                        compilerOptions: {
                            composite: true,
                            module: "ESNext",
                            moduleResolution: "node",
                        },
                        include: ["vite.config.ts"],
                    };
                    // Write files
                    return [4 /*yield*/, fs.writeFile(path.join(projectDir, "package.json"), JSON.stringify(packageJson, null, 2))];
                case 14:
                    // Write files
                    _a.sent();
                    return [4 /*yield*/, fs.writeFile(path.join(projectDir, "index.html"), indexHtml.trim())];
                case 15:
                    _a.sent();
                    return [4 /*yield*/, fs.writeFile(path.join(projectDir, "vite.config.ts"), viteConfig.trim())];
                case 16:
                    _a.sent();
                    return [4 /*yield*/, fs.writeFile(path.join(projectDir, "tsconfig.json"), JSON.stringify(tsconfigJson, null, 2))];
                case 17:
                    _a.sent();
                    return [4 /*yield*/, fs.writeFile(path.join(projectDir, "tsconfig.node.json"), JSON.stringify(tsconfigNodeJson, null, 2))];
                case 18:
                    _a.sent();
                    return [4 /*yield*/, fs.writeFile(path.join(projectDir, ".gitignore"), gitignore.trim())];
                case 19:
                    _a.sent();
                    return [4 /*yield*/, fs.writeFile(path.join(projectDir, ".eslintrc.json"), JSON.stringify(eslintrcJson, null, 2))];
                case 20:
                    _a.sent();
                    return [4 /*yield*/, fs.writeFile(path.join(projectDir, "README.md"), readmeMd.trim())];
                case 21:
                    _a.sent();
                    return [4 /*yield*/, fs.writeFile(path.join(projectDir, "src", "main.tsx"), mainTsx.trim())];
                case 22:
                    _a.sent();
                    return [4 /*yield*/, fs.writeFile(path.join(projectDir, "src", "App.tsx"), appTsx.trim())];
                case 23:
                    _a.sent();
                    return [4 /*yield*/, fs.writeFile(path.join(projectDir, "src", "styles", "index.css"), indexCss.trim())];
                case 24:
                    _a.sent();
                    return [4 /*yield*/, fs.writeFile(path.join(projectDir, "src", "styles", "App.css"), appCss.trim())];
                case 25:
                    _a.sent();
                    buttonComponentTsx = "\nimport React from 'react';\n\ninterface ButtonProps {\n  text: string;\n  onClick?: () => void;\n  variant?: 'primary' | 'secondary' | 'outlined';\n}\n\nexport const Button: React.FC<ButtonProps> = ({ \n  text, \n  onClick, \n  variant = 'primary' \n}) => {\n  const getButtonClass = () => {\n    switch (variant) {\n      case 'primary':\n        return 'bg-blue-500 hover:bg-blue-700 text-white';\n      case 'secondary':\n        return 'bg-gray-500 hover:bg-gray-700 text-white';\n      case 'outlined':\n        return 'bg-transparent hover:bg-blue-500 text-blue-700 hover:text-white border border-blue-500 hover:border-transparent';\n      default:\n        return 'bg-blue-500 hover:bg-blue-700 text-white';\n    }\n  };\n\n  return (\n    <button\n      className={`font-bold py-2 px-4 rounded ${getButtonClass()}`}\n      onClick={onClick}\n    >\n      {text}\n    </button>\n  );\n};\n";
                    return [4 /*yield*/, fs.writeFile(path.join(projectDir, "src", "components", "Button.tsx"), buttonComponentTsx.trim())];
                case 26:
                    _a.sent();
                    useLocalStorageTsx = "\nimport { useState, useEffect } from 'react';\n\nexport function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {\n  // Get from local storage then parse stored json or return initialValue\n  const readValue = (): T => {\n    if (typeof window === 'undefined') {\n      return initialValue;\n    }\n\n    try {\n      const item = window.localStorage.getItem(key);\n      return item ? (JSON.parse(item) as T) : initialValue;\n    } catch (error) {\n      console.warn(`Error reading localStorage key \"${key}\":`, error);\n      return initialValue;\n    }\n  };\n\n  const [storedValue, setStoredValue] = useState<T>(readValue);\n\n  const setValue = (value: T) => {\n    try {\n      // Save state\n      setStoredValue(value);\n      \n      // Save to local storage\n      if (typeof window !== 'undefined') {\n        window.localStorage.setItem(key, JSON.stringify(value));\n      }\n    } catch (error) {\n      console.warn(`Error setting localStorage key \"${key}\":`, error);\n    }\n  };\n\n  useEffect(() => {\n    const handleStorageChange = () => {\n      setStoredValue(readValue());\n    };\n    \n    // this only works for other documents, not the current one\n    window.addEventListener('storage', handleStorageChange);\n    \n    return () => {\n      window.removeEventListener('storage', handleStorageChange);\n    };\n  }, []);\n\n  return [storedValue, setValue];\n}\n";
                    return [4 /*yield*/, fs.writeFile(path.join(projectDir, "src", "hooks", "useLocalStorage.ts"), useLocalStorageTsx.trim())];
                case 27:
                    _a.sent();
                    _a.label = 28;
                case 28:
                    _a.trys.push([28, 30, , 31]);
                    console.log("Initializing git repository...");
                    return [4 /*yield*/, executeCommand("git", ["init"], projectDir)];
                case 29:
                    _a.sent();
                    console.log("Git repository initialized.");
                    return [3 /*break*/, 31];
                case 30:
                    error_1 = _a.sent();
                    console.warn("Failed to initialize git repository:", error_1.message);
                    console.warn("You can manually initialize git later.");
                    return [3 /*break*/, 31];
                case 31:
                    if (!installDeps) return [3 /*break*/, 35];
                    _a.label = 32;
                case 32:
                    _a.trys.push([32, 34, , 35]);
                    console.log("Installing dependencies...");
                    return [4 /*yield*/, executeCommand("npm", ["install"], projectDir)];
                case 33:
                    _a.sent();
                    console.log("Dependencies installed successfully.");
                    return [3 /*break*/, 35];
                case 34:
                    error_2 = _a.sent();
                    console.error("Failed to install dependencies:", error_2.message);
                    console.log('You can manually install dependencies later with "npm install".');
                    return [3 /*break*/, 35];
                case 35:
                    console.log("\n\u2728 Project ".concat(projectName, " created successfully!"));
                    console.log("\nNext steps:\n  cd ".concat(projectName, "\n  ").concat(installDeps ? "" : "npm install", "\n  npm run dev\n  \nHappy coding! \uD83D\uDE80\n"));
                    return [2 /*return*/];
            }
        });
    });
}
// Main function
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("🚀 MiLost Project Generator 🚀");
                    console.log("===============================\n");
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, createProject()];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_3 = _a.sent();
                    console.error("Error creating project:", error_3.message);
                    node_process_1.default.exit(1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
main();

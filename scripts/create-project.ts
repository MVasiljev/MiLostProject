import process from "node:process";
import * as fs from "fs/promises";
import * as path from "path";
import * as readline from "readline";
import { spawn } from "child_process";

function prompt(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

async function executeCommand(
  command: string,
  args: string[],
  cwd: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    const childProcess = spawn(command, args, {
      cwd,
      stdio: "inherit",
      shell: process.platform === "win32", // Use shell on Windows
    });

    childProcess.on("close", (code) => {
      if (code === 0) resolve();
      else
        reject(
          new Error(
            `Command ${command} ${args.join(" ")} failed with code ${code}`
          )
        );
    });
  });
}

async function createProject() {
  // Get project information
  const projectName = await prompt("Project name: ");
  const description = await prompt("Project description (optional): ");
  const useTypeScript =
    (await prompt("Use TypeScript? (Y/n): ")).toLowerCase() !== "n";
  const installDeps =
    (await prompt("Install dependencies? (Y/n): ")).toLowerCase() !== "n";

  const projectDir = path.resolve(process.cwd(), projectName);

  // Check if directory already exists
  try {
    await fs.access(projectDir);
    const overwrite = await prompt(
      `Directory ${projectName} already exists. Overwrite? (y/N): `
    );
    if (overwrite.toLowerCase() !== "y") {
      console.log("Operation cancelled.");
      return;
    }
  } catch (err) {
    // Directory doesn't exist, we can proceed
  }

  console.log(`\nCreating project: ${projectName}`);

  // Create project structure
  const dirs = [
    "src",
    "src/styles",
    "src/components",
    "src/hooks",
    "src/utils",
    "public",
  ];

  for (const dir of dirs) {
    await fs.mkdir(path.join(projectDir, dir), { recursive: true });
  }

  // Package.json
  const packageJson = {
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

  // index.html
  const indexHtml = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${projectName}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`;

  // vite.config.ts
  const viteConfig = `
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  },
  test: {
    globals: true,
    environment: 'jsdom'
  }
});
`;

  // main.tsx
  const mainTsx = `
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
`;

  // App.tsx
  const appTsx = `
import React, { useState } from 'react';
import { Str } from 'milost';
import './styles/App.css';

function App() {
  const [message] = useState(Str.create('Hello, MiLost!'));

  return (
    <div className="app">
      <header className="app-header">
        <h1>{message.toUpperCase().unwrap()}</h1>
        <p>Edit <code>src/App.tsx</code> and save to reload.</p>
      </header>
    </div>
  );
}

export default App;
`;

  // App.css
  const appCss = `
.app {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  text-align: center;
}

.app-header {
  padding: 2rem;
}

code {
  background-color: #f5f5f5;
  padding: 0.2em 0.4em;
  border-radius: 3px;
  font-family: monospace;
}
`;

  // index.css
  const indexCss = `
:root {
  --primary-color: #646cff;
  --background-color: #ffffff;
  --text-color: #213547;
}

@media (prefers-color-scheme: dark) {
  :root {
    --primary-color: #747bff;
    --background-color: #213547;
    --text-color: rgba(255, 255, 255, 0.87);
  }
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  color: var(--text-color);
  background-color: var(--background-color);
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

a {
  text-decoration: none;
  color: var(--primary-color);
}

a:hover {
  text-decoration: underline;
}
`;

  // README.md
  const readmeMd = `
# ${projectName}

${description || "A React project using MiLost library"}

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

\`\`\`bash
npm install
# or
yarn install
\`\`\`

3. Start the development server:

\`\`\`bash
npm run dev
# or
yarn dev
\`\`\`

## Built With

- [React](https://reactjs.org/) - Frontend library
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Vite](https://vitejs.dev/) - Build tool
- [MiLost](https://github.com/your-username/milost) - MiLost library

## License

This project is licensed under the MIT License - see the LICENSE file for details.
`;

  // .gitignore
  const gitignore = `
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

# Dependencies
node_modules
.pnp
.pnp.js

# Build
dist
dist-ssr
*.local
build

# Testing
coverage

# Editor directories and files
.vscode/*
!.vscode/extensions.json
!.vscode/settings.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
`;

  // eslintrc.json
  const eslintrcJson = {
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

  // tsconfig.json
  const tsconfigJson = {
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

  // tsconfig.node.json
  const tsconfigNodeJson = {
    compilerOptions: {
      composite: true,
      module: "ESNext",
      moduleResolution: "node",
    },
    include: ["vite.config.ts"],
  };

  // Write files
  await fs.writeFile(
    path.join(projectDir, "package.json"),
    JSON.stringify(packageJson, null, 2)
  );
  await fs.writeFile(path.join(projectDir, "index.html"), indexHtml.trim());
  await fs.writeFile(
    path.join(projectDir, "vite.config.ts"),
    viteConfig.trim()
  );
  await fs.writeFile(
    path.join(projectDir, "tsconfig.json"),
    JSON.stringify(tsconfigJson, null, 2)
  );
  await fs.writeFile(
    path.join(projectDir, "tsconfig.node.json"),
    JSON.stringify(tsconfigNodeJson, null, 2)
  );
  await fs.writeFile(path.join(projectDir, ".gitignore"), gitignore.trim());
  await fs.writeFile(
    path.join(projectDir, ".eslintrc.json"),
    JSON.stringify(eslintrcJson, null, 2)
  );
  await fs.writeFile(path.join(projectDir, "README.md"), readmeMd.trim());

  await fs.writeFile(path.join(projectDir, "src", "main.tsx"), mainTsx.trim());
  await fs.writeFile(path.join(projectDir, "src", "App.tsx"), appTsx.trim());
  await fs.writeFile(
    path.join(projectDir, "src", "styles", "index.css"),
    indexCss.trim()
  );
  await fs.writeFile(
    path.join(projectDir, "src", "styles", "App.css"),
    appCss.trim()
  );

  // Sample component
  const buttonComponentTsx = `
import React from 'react';

interface ButtonProps {
  text: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outlined';
}

export const Button: React.FC<ButtonProps> = ({ 
  text, 
  onClick, 
  variant = 'primary' 
}) => {
  const getButtonClass = () => {
    switch (variant) {
      case 'primary':
        return 'bg-blue-500 hover:bg-blue-700 text-white';
      case 'secondary':
        return 'bg-gray-500 hover:bg-gray-700 text-white';
      case 'outlined':
        return 'bg-transparent hover:bg-blue-500 text-blue-700 hover:text-white border border-blue-500 hover:border-transparent';
      default:
        return 'bg-blue-500 hover:bg-blue-700 text-white';
    }
  };

  return (
    <button
      className={\`font-bold py-2 px-4 rounded \${getButtonClass()}\`}
      onClick={onClick}
    >
      {text}
    </button>
  );
};
`;

  await fs.writeFile(
    path.join(projectDir, "src", "components", "Button.tsx"),
    buttonComponentTsx.trim()
  );

  // Sample hook
  const useLocalStorageTsx = `
import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  // Get from local storage then parse stored json or return initialValue
  const readValue = (): T => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.warn(\`Error reading localStorage key "\${key}":\`, error);
      return initialValue;
    }
  };

  const [storedValue, setStoredValue] = useState<T>(readValue);

  const setValue = (value: T) => {
    try {
      // Save state
      setStoredValue(value);
      
      // Save to local storage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.warn(\`Error setting localStorage key "\${key}":\`, error);
    }
  };

  useEffect(() => {
    const handleStorageChange = () => {
      setStoredValue(readValue());
    };
    
    // this only works for other documents, not the current one
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return [storedValue, setValue];
}
`;

  await fs.writeFile(
    path.join(projectDir, "src", "hooks", "useLocalStorage.ts"),
    useLocalStorageTsx.trim()
  );

  // Initialize git with proper gitignore
  try {
    console.log("Initializing git repository...");
    await executeCommand("git", ["init"], projectDir);
    console.log("Git repository initialized.");
  } catch (error) {
    console.warn("Failed to initialize git repository:", error.message);
    console.warn("You can manually initialize git later.");
  }

  // Install dependencies if requested
  if (installDeps) {
    try {
      console.log("Installing dependencies...");
      await executeCommand("npm", ["install"], projectDir);
      console.log("Dependencies installed successfully.");
    } catch (error) {
      console.error("Failed to install dependencies:", error.message);
      console.log(
        'You can manually install dependencies later with "npm install".'
      );
    }
  }

  console.log(`\n✨ Project ${projectName} created successfully!`);
  console.log(`
Next steps:
  cd ${projectName}
  ${installDeps ? "" : "npm install"}
  npm run dev
  
Happy coding! 🚀
`);
}

// Main function
async function main() {
  console.log("🚀 MiLost Project Generator 🚀");
  console.log("===============================\n");

  try {
    await createProject();
  } catch (error) {
    console.error("Error creating project:", error.message);
    process.exit(1);
  }
}

main();

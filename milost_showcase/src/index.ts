import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

// Detailed module loading debug
console.log("Current module:", import.meta.url);
console.log("__filename:", fileURLToPath(import.meta.url));
console.log("__dirname:", dirname(fileURLToPath(import.meta.url)));

// Explicit module imports with error handling
async function safeImport(modulePath: string) {
  try {
    console.log(`Attempting to import: ${modulePath}`);
    const module = await import(modulePath);
    console.log(`Successfully imported: ${modulePath}`);
    return module;
  } catch (error) {
    console.error(`Failed to import ${modulePath}:`, error);
    throw error;
  }
}

async function startApplication() {
  try {
    // Sequentially import and log each module
    const createApp = await safeImport("./app.js");
    const { initializeWasm } = await safeImport("./services/wasm.js");
    const config = await safeImport("./config/index.js");
    const logger = await safeImport("./utils/logger.js");

    console.log("All modules imported successfully");

    // Rest of the application startup logic
    console.log("Initializing WASM...");
    const wasmInitialized = await initializeWasm();

    if (!wasmInitialized) {
      console.error("WASM initialization failed. Exiting...");
      process.exit(1);
    }

    console.log("Creating Express app...");
    const app = createApp.default();

    const port = config.default.port;
    console.log(`Attempting to listen on port ${port}`);

    app.listen(port, () => {
      console.log(`🚀 Server running at http://localhost:${port}`);
      console.log(`API available at http://localhost:${port}/api`);
    });
  } catch (error) {
    console.error("Application startup failed:", error);
    process.exit(1);
  }
}

// Global error handlers
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

// Start the application
startApplication().catch((error) => {
  console.error("Fatal error during application startup:", error);
  process.exit(1);
});

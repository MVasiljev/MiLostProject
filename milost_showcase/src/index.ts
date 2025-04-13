import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { loadWasm, getWasmStatus } from "./utils/wasm-loader.js";
import stringRoutes from "./routes/string.js";
import welcomeView from "./views/welcome.js";
import debugView from "./views/debug.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, "../public");

console.log("📁 Serving static files from:", publicDir);

async function startServer() {
  try {
    console.log("Initializing MiLost WASM...");
    const wasmResult = await loadWasm();
    console.log("WASM initialization complete:", wasmResult);

    const app = express();
    const port = process.env.PORT || 3000;

    const distDir = path.join(__dirname, "../dist");
    app.use(express.static(path.join(__dirname, "../public")));
    app.use(express.static(path.join(__dirname, "../dist")));
    app.use(express.json());

    app.get("/api/status", (req, res) => {
      const status = getWasmStatus();
      res.json(status);
    });

    app.use("/api/string", stringRoutes);
    app.get("/welcome", welcomeView.renderWelcomePage);
    app.get("/debug-info", debugView.renderDebugPage);

    app.get("/", (req, res) => {
      res.sendFile(path.join(publicDir, "index.html"));
    });

    app.use((req, res, next) => {
      console.log("➡️ Incoming request:", req.method, req.originalUrl);
      next();
    });

    app.listen(port, () => {
      console.log(`🚀 Server running at http://localhost:${port}`);
      console.log(`📄 Welcome page: http://localhost:${port}/welcome`);
      console.log(`🔍 Debug info: http://localhost:${port}/debug-info`);
      console.log(`🧪 API status: http://localhost:${port}/api/status`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();

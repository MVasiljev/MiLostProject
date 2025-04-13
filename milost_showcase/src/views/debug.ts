import { Request, Response } from "express";
import { getWasmModule, isWasmInitialized } from "milost";
import { getWasmStatus } from "../utils/wasm-loader.js";

/**
 * Render the debug information page
 */
export function renderDebugPage(req: Request, res: Response): void {
  const status = getWasmStatus();

  let wasmExports: string[] = [];
  let wasmModuleInfo = "WASM not initialized";

  if (isWasmInitialized()) {
    const wasmModule = getWasmModule();
    wasmExports = Object.keys(wasmModule);
    wasmModuleInfo = `WASM Module initialized with ${wasmExports.length} exports`;
  }

  const exportListHtml =
    wasmExports.length > 0
      ? `<ul class="exports-list">${wasmExports
          .map((exp) => `<li>${exp}</li>`)
          .join("")}</ul>`
      : "<p>No exports available.</p>";

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>MiLost Debug Information</title>
      <link rel="stylesheet" href="/css/style.css">
      <style>
        .exports-list {
          max-height: 400px;
          overflow-y: auto;
          padding: 1rem;
          background-color: #f5f5f5;
          border-radius: 4px;
          border: 1px solid #ddd;
          list-style-position: inside;
        }
        .exports-list li {
          padding: 0.25rem 0;
          border-bottom: 1px solid #eee;
        }
        .exports-list li:last-child {
          border-bottom: none;
        }
      </style>
    </head>
    <body>
      <header>
        <h1>MiLost Debug Information</h1>
        <nav>
          <ul>
            <li><a href="/">Back to Home</a></li>
          </ul>
        </nav>
      </header>
      
      <main>
        <section id="debug" class="active">
          <h2>WASM Module Debug Information</h2>
          
          <div class="debug-container">
            <h3>Initialization Status</h3>
            <pre>${JSON.stringify(status, null, 2)}</pre>
            
            <h3>${wasmModuleInfo}</h3>
            ${exportListHtml}
            
            <h3>Environment</h3>
            <pre>Node.js Version: ${process.version}
Platform: ${process.platform}
Architecture: ${process.arch}</pre>
          </div>
          
          <div class="button-group">
            <a href="/" class="button">Back to Demo</a>
          </div>
        </section>
      </main>
      
      <footer>
        <p>&copy; 2025 MiLost Showcase</p>
      </footer>
    </body>
    </html>
  `;

  res.send(html);
}

export default { renderDebugPage };

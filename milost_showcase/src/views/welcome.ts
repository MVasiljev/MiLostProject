import { Request, Response } from "express";
import { getWasmStatus } from "../utils/wasm-loader.js";

/**
 * Render the welcome page with WASM status information
 */
export function renderWelcomePage(req: Request, res: Response): void {
  const status = getWasmStatus();

  const statusHtml = `
    <div class="status-container">
      <h3>WASM Status</h3>
      <pre>${JSON.stringify(status, null, 2)}</pre>
    </div>
  `;

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to MiLost Showcase</title>
      <link rel="stylesheet" href="/css/style.css">
    </head>
    <body>
      <header>
        <h1>MiLost Library Showcase</h1>
      </header>
      
      <main>
        <section id="welcome" class="active">
          <h2>Welcome to MiLost Showcase</h2>
          <p>This is a server-side rendered welcome page.</p>
          <p>MiLost is a powerful library that provides type-safe, immutable data structures with WebAssembly acceleration.</p>
          ${statusHtml}
          <div class="button-group">
            <a href="/" class="button">Go to Interactive Demo</a>
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

export default { renderWelcomePage };

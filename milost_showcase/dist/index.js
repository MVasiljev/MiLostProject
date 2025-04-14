import createApp from "./app.js";
import { initializeWasm } from "./services/wasm.js";
import config from "./config/index.js";
import logger from "./utils/logger.js";
(async () => {
    try {
        logger.info("Initializing WASM...");
        const wasmInitialized = await initializeWasm();
        if (!wasmInitialized) {
            logger.error("WASM initialization failed. Exiting...");
            process.exit(1);
        }
        const app = createApp();
        app.listen(config.port, () => {
            logger.info(`🚀 Server running at http://localhost:${config.port}`);
            logger.info(`API available at http://localhost:${config.port}/api`);
        });
    }
    catch (error) {
        logger.error({ error }, "Failed to start server");
        process.exit(1);
    }
})();
//# sourceMappingURL=index.js.map
import express from "express";
import cors from "cors";
import routes from "./routes/index.js";
import { errorHandler } from "./middleware/error.js";
import logger from "./utils/logger.js";
export default function createApp() {
    const app = express();
    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use((req, res, next) => {
        logger.info({
            method: req.method,
            url: req.originalUrl,
        }, "Request received");
        next();
    });
    app.use("/api", routes);
    app.use((req, res) => {
        res.status(404).json({
            error: {
                message: "Not Found",
                status: 404,
            },
        });
    });
    app.use(errorHandler);
    return app;
}
//# sourceMappingURL=app.js.map
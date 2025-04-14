import express, { Request, Response, NextFunction, Application } from "express";
import cors from "cors";
import routes from "./routes/index.js";
import { errorHandler } from "./middleware/error.js";
import logger from "./utils/logger.js";
import { ApiError } from "./types/index.js";

export default function createApp(): Application {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use((req: Request, res: Response, next: NextFunction) => {
    logger.info(
      {
        method: req.method,
        url: req.originalUrl,
      },
      "Request received"
    );
    next();
  });

  app.use("/api", routes);

  app.use((req: Request, res: Response) => {
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

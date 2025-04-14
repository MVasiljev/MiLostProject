import express, { Request, Response } from "express";
import stringRoutes from "./string.js";
import vectorRoutes from "./vector.js";
import { getWasmStatus } from "../services/wasm.js";
import logger from "../utils/logger.js";

const router = express.Router();

/**
 * @route GET /api/status
 * @desc Get WASM status
 * @access Public
 */
router.get("/status", (req: Request, res: Response) => {
  logger.debug("Status endpoint called");
  res.json(getWasmStatus());
});

/**
 * @route GET /api
 * @desc Welcome message
 * @access Public
 */
router.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Welcome to MiLost Showcase API",
    version: "0.1.0",
    documentation: "/api/docs",
    wasm: getWasmStatus(),
  });
});

router.use("/string", stringRoutes);
router.use("/vector", vectorRoutes);

export default router;

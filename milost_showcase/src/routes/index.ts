import express, { Request, Response } from "express";
import { getWasmStatus } from "../services/wasm.js";
import logger from "../utils/logger.js";
import stringRoutes from "./string.js";
import vectorRoutes from "./vector.js";
import tupleRoutes from "./tuple.js";
import structRoutes from "./struct.js";
import hashMapRoutes from "./hash_map.js";
import hashSetRoutes from "./hash_set.js";
import primitiveRoutes from "./primitives.js";
import brandingRoutes from "./branding.js";
import commonRoutes from "./common.js";
import errorRoutes from "./errors.js";
import optionRoutes from "./option.js";
import iterRoutes from "./iter.js";
import resultRoutes from "./result.js";
import functionalRoutes from "./functional.js";
import syncPrimitivesRoutes from "./sync_primitives.js";

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
router.use("/tuple", tupleRoutes);
router.use("/struct", structRoutes);
router.use("/hashmap", hashMapRoutes);
router.use("/hashset", hashSetRoutes);
router.use("/primitive", primitiveRoutes);
router.use("/branded", brandingRoutes);
router.use("/common", commonRoutes);
router.use("/errors", errorRoutes);
router.use("/option", optionRoutes);
router.use("/iter", iterRoutes);
router.use("/result", resultRoutes);
router.use("/functional", functionalRoutes);
router.use("/sync-primitives", syncPrimitivesRoutes);

export default router;

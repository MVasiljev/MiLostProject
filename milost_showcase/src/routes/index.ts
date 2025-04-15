import express, { Request, Response } from "express";
import stringRoutes from "./string.js";
import vectorRoutes from "./vector.js";
import tupleRoutes from "./tuple.js";
import structRoutes from "./struct.js";
import hashMapRoutes from "./hash_map.js";
import hashSetRoutes from "./hash_set.js";
import primitiveRoutes from "./primitives.js";
// import brandingRoutes from "./branding.js";
import commonRoutes from "./common.js";
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
router.use("/tuple", tupleRoutes);
router.use("/struct", structRoutes);
router.use("/hashmap", hashMapRoutes);
router.use("/hashset", hashSetRoutes);
console.log("Primitive routes:", primitiveRoutes);
router.use("/primitive", primitiveRoutes);
console.log(
  "Routes registered:",
  router.stack.map((r) => r.route)
);

// router.use("/branded", brandingRoutes);
router.use("/common", commonRoutes);

export default router;

import express from "express";
import { optionController } from "../controllers/index.js";

const router = express.Router();

/**
 * @route POST /api/option/operation
 * @desc Perform various Option operations
 * @access Public
 */
router.post("/operation", optionController.optionOperations);

export default router;

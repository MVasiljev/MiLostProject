import express from "express";
import { stringController } from "../controllers/index.js";

const router = express.Router();

/**
 * @route POST /api/string
 * @desc Create a new string
 * @access Public
 */
router.post("/", stringController.createString);

/**
 * @route POST /api/string/operation
 * @desc Perform operations on a string
 * @access Public
 */
router.post("/operation", stringController.stringOperations);

export default router;

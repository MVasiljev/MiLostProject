import express from "express";
import { primitiveController } from "../controllers/index.js";

const router = express.Router();

/**
 * @route POST /api/primitive
 * @desc Create a new primitive value
 * @access Public
 */
router.post("/", primitiveController.createPrimitive);

/**
 * @route POST /api/primitive/arithmetic
 * @desc Perform arithmetic operations on primitive values
 * @access Public
 */
router.post("/arithmetic", primitiveController.arithmeticOperations);

/**
 * @route POST /api/primitive/bitwise
 * @desc Perform bitwise operations on primitive values
 * @access Public
 */
router.post("/bitwise", primitiveController.bitwiseOperations);

/**
 * @route POST /api/primitive/format
 * @desc Format primitive values (binary, hex, octal, etc.)
 * @access Public
 */
router.post("/format", primitiveController.formatOperations);

/**
 * @route POST /api/primitive/bit-manipulation
 * @desc Perform bit manipulation operations
 * @access Public
 */
router.post("/bit-manipulation", primitiveController.bitManipulationOperations);

/**
 * @route POST /api/primitive/validate
 * @desc Validate a primitive value
 * @access Public
 */
router.post("/validate", primitiveController.validatePrimitive);

/**
 * @route POST /api/primitive/convert
 * @desc Convert between primitive types
 * @access Public
 */
router.post("/convert", primitiveController.convertPrimitive);

export default router;

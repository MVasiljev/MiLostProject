import express from "express";
import { resultController } from "../controllers/index.js";

const router = express.Router();

/**
 * @route POST /api/result
 * @desc Create a new Result
 * @access Public
 */
router.post("/", resultController.createResult);

/**
 * @route POST /api/result/operation
 * @desc Perform various Result operations
 * @access Public
 */
router.post("/operation", resultController.resultOperations);

/**
 * @route POST /api/result/create
 * @desc Create a Result (Ok or Err)
 * @access Public
 */
router.post("/create", resultController.createResult);

/**
 * @route POST /api/result/check
 * @desc Perform Result checking operations
 * @access Public
 */
router.post("/check", resultController.checkResult);

/**
 * @route POST /api/result/unwrap
 * @desc Perform Result unwrapping operations
 * @access Public
 */
router.post("/unwrap", resultController.unwrapResult);

/**
 * @route POST /api/result/transform
 * @desc Perform Result transformation operations
 * @access Public
 */
router.post("/transform", resultController.transformResult);

/**
 * @route POST /api/result/match
 * @desc Perform Result matching operations
 * @access Public
 */
router.post("/match", resultController.matchResult);

/**
 * @route POST /api/result/utility
 * @desc Perform Result utility operations
 * @access Public
 */
router.post("/utility", resultController.utilityResult);

export default router;

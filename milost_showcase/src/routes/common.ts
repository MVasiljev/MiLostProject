import express from "express";
import { commonController } from "../controllers/index.js";

const router = express.Router();

/**
 * @route POST /api/common/operation
 * @desc Perform various common operations
 * @access Public
 */
router.post("/operation", commonController.commonOperations);

/**
 * @route POST /api/common/type-check
 * @desc Check the type of a value
 * @access Public
 */
router.post("/type-check", commonController.typeCheck);

/**
 * @route POST /api/common/convert
 * @desc Convert values to different types
 * @access Public
 */
router.post("/convert", commonController.convertToVec);

/**
 * @route POST /api/common/loading-states
 * @desc Get loading states
 * @access Public
 */
router.post("/loading-states", commonController.getLoadingStates);

/**
 * @route POST /api/common/brand-types
 * @desc Get brand types
 * @access Public
 */
router.post("/brand-types", commonController.getBrandTypes);

/**
 * @route POST /api/common/option
 * @desc Perform Option operations
 * @access Public
 */
router.post("/option", commonController.optionOperations);

/**
 * @route POST /api/common/result
 * @desc Perform Result operations
 * @access Public
 */
router.post("/result", commonController.resultOperations);

export default router;

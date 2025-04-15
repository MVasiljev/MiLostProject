import express from "express";
import { functionalController } from "../controllers/index.js";

const router = express.Router();

/**
 * @route POST /api/functional
 * @desc Create functional operation
 * @access Public
 */
router.post("/", functionalController.createFunctional);

/**
 * @route POST /api/functional/operation
 * @desc Perform various functional operations
 * @access Public
 */
router.post("/operation", functionalController.functionalOperations);

/**
 * @route POST /api/functional/map
 * @desc Perform mapping operations
 * @access Public
 */
router.post("/map", functionalController.mapFunctional);

/**
 * @route POST /api/functional/transform
 * @desc Perform transformation operations
 * @access Public
 */
router.post("/transform", functionalController.transformFunctional);

/**
 * @route POST /api/functional/execution
 * @desc Perform execution-related operations
 * @access Public
 */
router.post("/execution", functionalController.executionFunctional);

/**
 * @route POST /api/functional/predicate
 * @desc Perform predicate-related operations
 * @access Public
 */
router.post("/predicate", functionalController.predicateFunctional);

/**
 * @route POST /api/functional/utility
 * @desc Perform utility operations
 * @access Public
 */
router.post("/utility", functionalController.utilityFunctional);

export default router;

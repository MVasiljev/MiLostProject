import express from "express";
import { vectorController } from "../controllers/index.js";
const router = express.Router();
/**
 * @route POST /api/vector
 * @desc Create a new vector
 * @access Public
 */
router.post("/", vectorController.createVector);
/**
 * @route POST /api/vector/operation
 * @desc Perform operations on a vector
 * @access Public
 */
router.post("/operation", vectorController.vectorOperations);
/**
 * @route POST /api/vector/map
 * @desc Map a vector
 * @access Public
 */
router.post("/map", vectorController.mapVector);
/**
 * @route POST /api/vector/filter
 * @desc Filter a vector
 * @access Public
 */
router.post("/filter", vectorController.filterVector);
/**
 * @route POST /api/vector/reduce
 * @desc Reduce a vector
 * @access Public
 */
router.post("/reduce", vectorController.reduceVector);
/**
 * @route POST /api/vector/takedrop
 * @desc Take or drop elements from a vector
 * @access Public
 */
router.post("/takedrop", vectorController.takeDropVector);
/**
 * @route POST /api/vector/check
 * @desc Check if all or any elements satisfy a predicate
 * @access Public
 */
router.post("/check", vectorController.checkVector);
export default router;
//# sourceMappingURL=vector.js.map
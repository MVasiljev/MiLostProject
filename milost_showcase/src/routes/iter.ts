import express from "express";
import { iterController } from "../controllers/index.js";

const router = express.Router();

/**
 * @route POST /api/iter
 * @desc Create a new Iter
 * @access Public
 */
router.post("/", iterController.createIter);

/**
 * @route POST /api/iter/operation
 * @desc Perform various Iter operations
 * @access Public
 */
router.post("/operation", iterController.iterOperations);

/**
 * @route POST /api/iter/from-vec
 * @desc Create an Iter from a Vec
 * @access Public
 */
router.post("/from-vec", iterController.createIterFromVec);

/**
 * @route POST /api/iter/range
 * @desc Create a range Iter
 * @access Public
 */
router.post("/range", iterController.createRangeIter);

/**
 * @route POST /api/iter/map
 * @desc Map elements of an Iter
 * @access Public
 */
router.post("/map", iterController.mapIter);

/**
 * @route POST /api/iter/filter
 * @desc Filter elements of an Iter
 * @access Public
 */
router.post("/filter", iterController.filterIter);

/**
 * @route POST /api/iter/collect
 * @desc Collect Iter into a Vec
 * @access Public
 */
router.post("/collect", iterController.collectIter);

export default router;

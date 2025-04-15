import express from "express";
import { asyncUtilsController } from "../controllers/index.js";

const router = express.Router();

/**
 * @route POST /api/async-utils/all
 * @desc Execute multiple promises in parallel and wait for all
 * @access Public
 */
router.post("/all", asyncUtilsController.all);

/**
 * @route POST /api/async-utils/all-settled
 * @desc Execute multiple promises in parallel and collect results
 * @access Public
 */
router.post("/all-settled", asyncUtilsController.allSettled);

/**
 * @route POST /api/async-utils/map-series
 * @desc Execute async operations on items in series
 * @access Public
 */
router.post("/map-series", asyncUtilsController.mapSeries);

/**
 * @route POST /api/async-utils/retry
 * @desc Retry an async operation with backoff
 * @access Public
 */
router.post("/retry", asyncUtilsController.retry);

/**
 * @route POST /api/async-utils/debounce
 * @desc Create a debounced version of an async function
 * @access Public
 */
router.post("/debounce", asyncUtilsController.debounce);

/**
 * @route POST /api/async-utils/with-timeout
 * @desc Execute an async operation with a timeout
 * @access Public
 */
router.post("/with-timeout", asyncUtilsController.withTimeout);

/**
 * @route POST /api/async-utils/cancellable
 * @desc Create a cancellable async operation
 * @access Public
 */
router.post("/cancellable", asyncUtilsController.cancellable);

/**
 * @route POST /api/async-utils/operation
 * @desc Perform various async utility operations
 * @access Public
 */
router.post("/operation", asyncUtilsController.asyncUtilsOperations);

export default router;

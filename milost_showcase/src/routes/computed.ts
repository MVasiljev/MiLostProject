import express from "express";
import { computedController } from "../controllers/index.js";

const router = express.Router();

/**
 * @route POST /api/computed
 * @desc Create a new reactive object (Computed, Watcher, AsyncEffect)
 * @access Public
 */
router.post("/", computedController.createReactive);

/**
 * @route POST /api/computed/operation
 * @desc Perform various reactive operations
 * @access Public
 */
router.post("/operation", computedController.reactiveOperations);

/**
 * @route POST /api/computed/computed
 * @desc Perform Computed operations
 * @access Public
 */
router.post("/computed", computedController.computedOperations);

/**
 * @route POST /api/computed/watcher
 * @desc Perform Watcher operations
 * @access Public
 */
router.post("/watcher", computedController.watcherOperations);

/**
 * @route POST /api/computed/async-effect
 * @desc Perform AsyncEffect operations
 * @access Public
 */
router.post("/async-effect", computedController.asyncEffectOperations);

export default router;

import express from "express";
import { resourceController } from "../controllers/index.js";

const router = express.Router();

/**
 * @route POST /api/resource
 * @desc Create a new resource
 * @access Public
 */
router.post("/", resourceController.createResource);

/**
 * @route POST /api/resource/use
 * @desc Use a resource with a function
 * @access Public
 */
router.post("/use", resourceController.useResource);

/**
 * @route POST /api/resource/use-async
 * @desc Use a resource with an async function
 * @access Public
 */
router.post("/use-async", resourceController.useResourceAsync);

/**
 * @route POST /api/resource/dispose
 * @desc Dispose a resource
 * @access Public
 */
router.post("/dispose", resourceController.disposeResource);

/**
 * @route POST /api/resource/status
 * @desc Check if a resource is disposed
 * @access Public
 */
router.post("/status", resourceController.resourceStatus);

/**
 * @route POST /api/resource/with-resource
 * @desc Use a resource and automatically dispose it
 * @access Public
 */
router.post("/with-resource", resourceController.withResourceFunc);

/**
 * @route POST /api/resource/disposable-group
 * @desc Create a new disposable group
 * @access Public
 */
router.post("/disposable-group", resourceController.createDisposableGroup);

/**
 * @route POST /api/resource/disposable-group/add
 * @desc Add a disposable to a group
 * @access Public
 */
router.post("/disposable-group/add", resourceController.addToDisposableGroup);

/**
 * @route POST /api/resource/disposable-group/dispose
 * @desc Dispose a disposable group
 * @access Public
 */
router.post(
  "/disposable-group/dispose",
  resourceController.disposeDisposableGroup
);

/**
 * @route POST /api/resource/disposable-group/status
 * @desc Check status of a disposable group
 * @access Public
 */
router.post(
  "/disposable-group/status",
  resourceController.disposableGroupStatus
);

/**
 * @route POST /api/resource/use-disposable
 * @desc Create a resource from a disposable
 * @access Public
 */
router.post("/use-disposable", resourceController.useDisposableResourceFunc);

/**
 * @route POST /api/resource/operation
 * @desc Perform various resource operations
 * @access Public
 */
router.post("/operation", resourceController.resourceOperations);

export default router;

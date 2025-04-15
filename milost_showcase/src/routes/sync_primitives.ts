import express from "express";
import { syncPrimitivesController } from "../controllers/index.js";

const router = express.Router();

/**
 * @route POST /api/sync-primitives
 * @desc Create a sync primitive
 * @access Public
 */
router.post("/", syncPrimitivesController.createSyncPrimitive);

/**
 * @route POST /api/sync-primitives/operation
 * @desc Perform various sync primitive operations
 * @access Public
 */
router.post("/operation", syncPrimitivesController.syncPrimitiveOperations);

/**
 * @route POST /api/sync-primitives/mutex
 * @desc Perform Mutex operations
 * @access Public
 */
router.post("/mutex", syncPrimitivesController.mutexOperations);

/**
 * @route POST /api/sync-primitives/rwlock
 * @desc Perform RwLock operations
 * @access Public
 */
router.post("/rwlock", syncPrimitivesController.rwLockOperations);

/**
 * @route POST /api/sync-primitives/arc-mutex
 * @desc Perform ArcMutex operations
 * @access Public
 */
router.post("/arc-mutex", syncPrimitivesController.arcMutexOperations);

export default router;

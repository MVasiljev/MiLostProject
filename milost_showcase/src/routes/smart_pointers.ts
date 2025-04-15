import express from "express";
import { smartPointersController } from "../controllers/index.js";

const router = express.Router();

/**
 * @route POST /api/smart-pointers
 * @desc Create a new smart pointer
 * @access Public
 */
router.post("/", smartPointersController.createSmartPointer);

/**
 * @route POST /api/smart-pointers/operation
 * @desc Perform various smart pointer operations
 * @access Public
 */
router.post("/operation", smartPointersController.smartPointerOperations);

/**
 * @route POST /api/smart-pointers/rc
 * @desc Perform Rc operations
 * @access Public
 */
router.post("/rc", smartPointersController.rcOperations);

/**
 * @route POST /api/smart-pointers/weak
 * @desc Perform Weak operations
 * @access Public
 */
router.post("/weak", smartPointersController.weakOperations);

/**
 * @route POST /api/smart-pointers/refcell
 * @desc Perform RefCell operations
 * @access Public
 */
router.post("/refcell", smartPointersController.refCellOperations);

/**
 * @route POST /api/smart-pointers/rcrefcell
 * @desc Perform RcRefCell operations
 * @access Public
 */
router.post("/rcrefcell", smartPointersController.rcRefCellOperations);

/**
 * @route POST /api/smart-pointers/arc
 * @desc Perform Arc operations
 * @access Public
 */
router.post("/arc", smartPointersController.arcOperations);

export default router;

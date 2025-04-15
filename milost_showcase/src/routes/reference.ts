import express from "express";
import { referenceController } from "../controllers/index.js";

const router = express.Router();

/**
 * @route POST /api/reference
 * @desc Create a new reference (Ref or RefMut)
 * @access Public
 */
router.post("/", referenceController.createReference);

/**
 * @route POST /api/reference/operation
 * @desc Perform various reference operations
 * @access Public
 */
router.post("/operation", referenceController.referenceOperations);

/**
 * @route POST /api/reference/ref
 * @desc Create a new immutable reference (Ref)
 * @access Public
 */
router.post("/ref", referenceController.createRef);

/**
 * @route POST /api/reference/refmut
 * @desc Create a new mutable reference (RefMut)
 * @access Public
 */
router.post("/refmut", referenceController.createRefMut);

/**
 * @route POST /api/reference/ref/operation
 * @desc Perform operations on a Ref
 * @access Public
 */
router.post("/ref/operation", referenceController.refOperations);

/**
 * @route POST /api/reference/refmut/operation
 * @desc Perform operations on a RefMut
 * @access Public
 */
router.post("/refmut/operation", referenceController.refMutOperations);

/**
 * @route POST /api/reference/get
 * @desc Get the value from a reference
 * @access Public
 */
router.post("/get", referenceController.getValue);

/**
 * @route POST /api/reference/set
 * @desc Set the value of a mutable reference
 * @access Public
 */
router.post("/set", referenceController.setValue);

/**
 * @route POST /api/reference/drop
 * @desc Drop a reference
 * @access Public
 */
router.post("/drop", referenceController.dropReference);

/**
 * @route POST /api/reference/status
 * @desc Check if a reference is active
 * @access Public
 */
router.post("/status", referenceController.checkReferenceStatus);

export default router;

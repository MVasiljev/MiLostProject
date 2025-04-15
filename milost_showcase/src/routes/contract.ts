import express from "express";
import { contractController } from "../controllers/index.js";

const router = express.Router();

/**
 * @route POST /api/contract/requires
 * @desc Check a precondition
 * @access Public
 */
router.post("/requires", contractController.checkRequires);

/**
 * @route POST /api/contract/ensures
 * @desc Check a postcondition
 * @access Public
 */
router.post("/ensures", contractController.checkEnsures);

/**
 * @route POST /api/contract/function
 * @desc Create a contracted function
 * @access Public
 */
router.post("/function", contractController.createContractFunction);

/**
 * @route POST /api/contract/invariant
 * @desc Create a new invariant
 * @access Public
 */
router.post("/invariant", contractController.createInvariant);

/**
 * @route POST /api/contract/invariant/get
 * @desc Get the value from an invariant
 * @access Public
 */
router.post("/invariant/get", contractController.getInvariantValue);

/**
 * @route POST /api/contract/invariant/map
 * @desc Map an invariant to a new one
 * @access Public
 */
router.post("/invariant/map", contractController.mapInvariant);

/**
 * @route POST /api/contract/operation
 * @desc Perform various contract operations
 * @access Public
 */
router.post("/operation", contractController.contractOperations);

export default router;

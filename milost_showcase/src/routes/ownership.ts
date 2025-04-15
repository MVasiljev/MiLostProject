import express from "express";
import { ownershipController } from "../controllers/index.js";

const router = express.Router();

/**
 * @route POST /api/ownership
 * @desc Create a new Owned value
 * @access Public
 */
router.post("/", ownershipController.createOwned);

/**
 * @route POST /api/ownership/operation
 * @desc Perform various operations on Owned values
 * @access Public
 */
router.post("/operation", ownershipController.ownedOperations);

/**
 * @route POST /api/ownership/consume
 * @desc Consume an Owned value
 * @access Public
 */
router.post("/consume", ownershipController.consumeOwned);

/**
 * @route POST /api/ownership/borrow
 * @desc Borrow an Owned value
 * @access Public
 */
router.post("/borrow", ownershipController.borrowOwned);

/**
 * @route POST /api/ownership/borrow-mut
 * @desc Mutably borrow an Owned value
 * @access Public
 */
router.post("/borrow-mut", ownershipController.borrowMutOwned);

/**
 * @route POST /api/ownership/status
 * @desc Check status of an Owned value (consumed/alive)
 * @access Public
 */
router.post("/status", ownershipController.checkOwnedStatus);

export default router;

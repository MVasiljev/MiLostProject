import express from "express";
import { errorController } from "../controllers/index.js";

const router = express.Router();

/**
 * @route POST /api/error
 * @desc Create a new generic error
 * @access Public
 */
router.post("/", errorController.createError);

/**
 * @route POST /api/error/operation
 * @desc Perform various error operations
 * @access Public
 */
router.post("/operation", errorController.errorOperations);

/**
 * @route POST /api/error/validation
 * @desc Create a validation error
 * @access Public
 */
router.post("/validation", errorController.createValidationError);

/**
 * @route POST /api/error/authentication
 * @desc Create an authentication error
 * @access Public
 */
router.post("/authentication", errorController.createAuthenticationError);

/**
 * @route POST /api/error/not-found
 * @desc Create a not found error
 * @access Public
 */
router.post("/not-found", errorController.createNotFoundError);

/**
 * @route POST /api/error/server
 * @desc Create a server error
 * @access Public
 */
router.post("/server", errorController.createServerError);

/**
 * @route POST /api/error/factory
 * @desc Create an error factory
 * @access Public
 */
router.post("/factory", errorController.createErrorFactoryOperation);

export default router;

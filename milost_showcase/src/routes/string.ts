import express from "express";
import { stringController } from "../controllers/index.js";

const router = express.Router();

/**
 * @route POST /api/string
 * @desc Create a new string
 * @access Public
 */
router.post("/", stringController.createString);

/**
 * @route POST /api/string/transformation
 * @desc Transform a string (uppercase, lowercase, trim, reverse)
 * @access Public
 */
router.post("/transformation", stringController.stringTransformations);

/**
 * @route POST /api/string/substring
 * @desc Perform substring operations (substring, charAt, startsWith, endsWith)
 * @access Public
 */
router.post("/substring", stringController.substringOperations);

/**
 * @route POST /api/string/search
 * @desc Perform search operations (contains, indexOf, lastIndexOf, replace, split)
 * @access Public
 */
router.post("/search", stringController.searchOperations);

/**
 * @route POST /api/string/compare
 * @desc Compare two strings
 * @access Public
 */
router.post("/compare", stringController.compareStrings);

/**
 * @route POST /api/string/concatenate
 * @desc Concatenate two strings
 * @access Public
 */
router.post("/concatenate", stringController.concatenateStrings);

export default router;

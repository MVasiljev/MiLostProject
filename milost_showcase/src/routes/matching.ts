import express from "express";
import { matchingController } from "../controllers/index.js";

const router = express.Router();

/**
 * @route POST /api/matching/builder
 * @desc Create a new match builder
 * @access Public
 */
router.post("/builder", matchingController.createMatchBuilder);

/**
 * @route POST /api/matching/builder/with
 * @desc Add a pattern arm to a match builder
 * @access Public
 */
router.post("/builder/with", matchingController.matchBuilderWith);

/**
 * @route POST /api/matching/builder/otherwise
 * @desc Execute match builder with a default handler
 * @access Public
 */
router.post("/builder/otherwise", matchingController.matchBuilderOtherwise);

/**
 * @route POST /api/matching/pattern/matches
 * @desc Check if a value matches a pattern
 * @access Public
 */
router.post(
  "/pattern/matches",
  matchingController.patternMatcherMatchesPattern
);

/**
 * @route POST /api/matching/pattern/extract
 * @desc Extract a value from a pattern match
 * @access Public
 */
router.post("/pattern/extract", matchingController.patternMatcherExtractValue);

/**
 * @route POST /api/matching/pattern/match
 * @desc Match a value against patterns
 * @access Public
 */
router.post("/pattern/match", matchingController.patternMatcherMatchValue);

/**
 * @route POST /api/matching/operation
 * @desc Perform various matching operations
 * @access Public
 */
router.post("/operation", matchingController.matchingOperations);

export default router;

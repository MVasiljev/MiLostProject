import express from "express";
import { hashSetController } from "../controllers/index.js";

const router = express.Router();

/**
 * @route POST /api/hashset
 * @desc Create a new hash set
 * @access Public
 */
router.post("/", hashSetController.createHashSet);

/**
 * @route POST /api/hashset/operation
 * @desc Perform various operations on a hash set
 * @access Public
 */
router.post("/operation", hashSetController.hashSetOperations);

/**
 * @route POST /api/hashset/contains
 * @desc Check if a hash set contains a value
 * @access Public
 */
router.post("/contains", hashSetController.containsHashSetValue);

/**
 * @route POST /api/hashset/insert
 * @desc Insert a value into a hash set
 * @access Public
 */
router.post("/insert", hashSetController.insertHashSetValue);

/**
 * @route POST /api/hashset/remove
 * @desc Remove a value from a hash set
 * @access Public
 */
router.post("/remove", hashSetController.removeHashSetValue);

/**
 * @route POST /api/hashset/map
 * @desc Map values in a hash set
 * @access Public
 */
router.post("/map", hashSetController.mapHashSet);

/**
 * @route POST /api/hashset/filter
 * @desc Filter values in a hash set
 * @access Public
 */
router.post("/filter", hashSetController.filterHashSet);

/**
 * @route POST /api/hashset/set-operation
 * @desc Perform set operations (union, intersection, etc.)
 * @access Public
 */
router.post("/set-operation", hashSetController.setOperations);

/**
 * @route POST /api/hashset/analyze
 * @desc Parse and analyze a hash set from a string
 * @access Public
 */
router.post("/analyze", hashSetController.analyzeHashSet);

export default router;

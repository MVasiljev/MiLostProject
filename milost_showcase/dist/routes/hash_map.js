import express from "express";
import { hashMapController } from "../controllers/index.js";
const router = express.Router();
/**
 * @route POST /api/hashmap
 * @desc Create a new hash map
 * @access Public
 */
router.post("/", hashMapController.createHashMap);
/**
 * @route POST /api/hashmap/operation
 * @desc Perform various operations on a hash map
 * @access Public
 */
router.post("/operation", hashMapController.hashMapOperations);
/**
 * @route POST /api/hashmap/get
 * @desc Get a value from a hash map by key
 * @access Public
 */
router.post("/get", hashMapController.getHashMapValue);
/**
 * @route POST /api/hashmap/contains
 * @desc Check if a hash map contains a key
 * @access Public
 */
router.post("/contains", hashMapController.containsHashMapKey);
/**
 * @route POST /api/hashmap/set
 * @desc Set a value in a hash map
 * @access Public
 */
router.post("/set", hashMapController.setHashMapValue);
/**
 * @route POST /api/hashmap/remove
 * @desc Remove a key-value pair from a hash map
 * @access Public
 */
router.post("/remove", hashMapController.removeHashMapEntry);
/**
 * @route POST /api/hashmap/keys
 * @desc Get keys of a hash map
 * @access Public
 */
router.post("/keys", hashMapController.getHashMapKeys);
/**
 * @route POST /api/hashmap/values
 * @desc Get values of a hash map
 * @access Public
 */
router.post("/values", hashMapController.getHashMapValues);
/**
 * @route POST /api/hashmap/entries
 * @desc Get entries of a hash map
 * @access Public
 */
router.post("/entries", hashMapController.getHashMapEntries);
/**
 * @route POST /api/hashmap/map
 * @desc Map values in a hash map
 * @access Public
 */
router.post("/map", hashMapController.mapHashMap);
/**
 * @route POST /api/hashmap/filter
 * @desc Filter values in a hash map
 * @access Public
 */
router.post("/filter", hashMapController.filterHashMap);
/**
 * @route POST /api/hashmap/analyze
 * @desc Parse and analyze a hash map from a string
 * @access Public
 */
router.post("/analyze", hashMapController.analyzeHashMap);
export default router;
//# sourceMappingURL=hash_map.js.map
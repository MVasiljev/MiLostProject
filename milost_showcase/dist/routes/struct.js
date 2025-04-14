import express from "express";
import { structController } from "../controllers/index.js";
const router = express.Router();
/**
 * @route POST /api/struct
 * @desc Create a new struct
 * @access Public
 */
router.post("/", structController.createStruct);
/**
 * @route POST /api/struct/operation
 * @desc Perform various operations on a struct
 * @access Public
 */
router.post("/operation", structController.structOperations);
/**
 * @route POST /api/struct/get
 * @desc Get a value from a struct by key
 * @access Public
 */
router.post("/get", structController.getStructValue);
/**
 * @route POST /api/struct/set
 * @desc Set a value in a struct
 * @access Public
 */
router.post("/set", structController.setStructValue);
/**
 * @route POST /api/struct/keys
 * @desc Get keys of a struct
 * @access Public
 */
router.post("/keys", structController.getStructKeys);
/**
 * @route POST /api/struct/entries
 * @desc Get entries of a struct
 * @access Public
 */
router.post("/entries", structController.getStructEntries);
/**
 * @route POST /api/struct/map
 * @desc Map values in a struct
 * @access Public
 */
router.post("/map", structController.mapStruct);
/**
 * @route POST /api/struct/filter
 * @desc Filter values in a struct
 * @access Public
 */
router.post("/filter", structController.filterStruct);
/**
 * @route POST /api/struct/analyze
 * @desc Parse and analyze a struct from a string
 * @access Public
 */
router.post("/analyze", structController.analyzeStruct);
export default router;
//# sourceMappingURL=struct.js.map
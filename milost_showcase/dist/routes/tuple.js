import express from "express";
import { tupleController } from "../controllers/index.js";
const router = express.Router();
/**
 * @route POST /api/tuple
 * @desc Create a new tuple
 * @access Public
 */
router.post("/", tupleController.createTuple);
/**
 * @route POST /api/tuple/operation
 * @desc Perform various operations on a tuple
 * @access Public
 */
router.post("/operation", tupleController.tupleOperations);
/**
 * @route POST /api/tuple/get
 * @desc Get an item from a tuple by index
 * @access Public
 */
router.post("/get", tupleController.getTupleItem);
/**
 * @route POST /api/tuple/first
 * @desc Get the first item from a tuple
 * @access Public
 */
router.post("/first", tupleController.getFirstItem);
/**
 * @route POST /api/tuple/second
 * @desc Get the second item from a tuple
 * @access Public
 */
router.post("/second", tupleController.getSecondItem);
/**
 * @route POST /api/tuple/replace
 * @desc Replace an item in a tuple
 * @access Public
 */
router.post("/replace", tupleController.replaceTupleItem);
/**
 * @route POST /api/tuple/map
 * @desc Map a tuple
 * @access Public
 */
router.post("/map", tupleController.mapTuple);
/**
 * @route POST /api/tuple/length
 * @desc Get the length of a tuple
 * @access Public
 */
router.post("/length", tupleController.getTupleLength);
/**
 * @route POST /api/tuple/analyze
 * @desc Parse and analyze a tuple from a string
 * @access Public
 */
router.post("/analyze", tupleController.analyzeTuple);
export default router;
//# sourceMappingURL=tuple.js.map
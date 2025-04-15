import express from "express";
import { asyncController } from "../controllers/index.js";

const router = express.Router();

/**
 * @route POST /api/async/channel
 * @desc Create a new channel
 * @access Public
 */
router.post("/channel", asyncController.createChannel);

/**
 * @route POST /api/async/channel/send
 * @desc Send a value through a channel
 * @access Public
 */
router.post("/channel/send", asyncController.sendToChannel);

/**
 * @route POST /api/async/channel/try-send
 * @desc Try to send a value through a channel without blocking
 * @access Public
 */
router.post("/channel/try-send", asyncController.trySendToChannel);

/**
 * @route POST /api/async/channel/receive
 * @desc Receive a value from a channel
 * @access Public
 */
router.post("/channel/receive", asyncController.receiveFromChannel);

/**
 * @route POST /api/async/channel/try-receive
 * @desc Try to receive a value from a channel without blocking
 * @access Public
 */
router.post("/channel/try-receive", asyncController.tryReceiveFromChannel);

/**
 * @route POST /api/async/channel/close
 * @desc Close a channel
 * @access Public
 */
router.post("/channel/close", asyncController.closeChannel);

/**
 * @route POST /api/async/task
 * @desc Create a new task
 * @access Public
 */
router.post("/task", asyncController.createTask);

/**
 * @route POST /api/async/task/map
 * @desc Map a task to a new one
 * @access Public
 */
router.post("/task/map", asyncController.mapTask);

/**
 * @route POST /api/async/task/flat-map
 * @desc Flat map a task to a new one
 * @access Public
 */
router.post("/task/flat-map", asyncController.flatMapTask);

/**
 * @route POST /api/async/task/catch
 * @desc Add error handling to a task
 * @access Public
 */
router.post("/task/catch", asyncController.catchTask);

/**
 * @route POST /api/async/task/run
 * @desc Run a task
 * @access Public
 */
router.post("/task/run", asyncController.runTask);

/**
 * @route POST /api/async/task/cancel
 * @desc Cancel a task
 * @access Public
 */
router.post("/task/cancel", asyncController.cancelTask);

/**
 * @route POST /api/async/operation
 * @desc Perform various async operations
 * @access Public
 */
router.post("/operation", asyncController.asyncOperations);

export default router;

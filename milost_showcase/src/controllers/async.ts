import { Request, Response } from "express";
import { Task, ChannelError, TaskError, AppError } from "milost";
import { createChannel as milostCreateChannel } from "milost";
import { u32, Str, Option, Result, Ok, Err } from "milost";
import logger from "../utils/logger.js";
import {
  CreateChannelRequest,
  ChannelResponse,
  ChannelSenderOperationRequest,
  ChannelReceiverOperationRequest,
  ChannelSenderOperationResponse,
  ChannelReceiverOperationResponse,
  CreateTaskRequest,
  TaskResponse,
  TaskMapRequest,
  TaskFlatMapRequest,
  TaskCatchRequest,
  TaskRunRequest,
  TaskOperationResponse,
  AsyncOperationRequest,
  AsyncOperationResponse,
} from "../types/async.js";

function extractErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

/**
 * Create a new channel
 */
export async function createChannel(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const { capacity } = req.body as CreateChannelRequest;

    let success = true;
    let error: string | null = null;
    let sender;
    let receiver;

    try {
      const cap = capacity !== undefined ? u32(capacity) : undefined;
      [sender, receiver] = await milostCreateChannel(cap);
    } catch (err) {
      success = false;
      error = extractErrorMessage(err);
    }

    const response: ChannelResponse = {
      data: {
        capacity,
        sender,
        receiver,
        success,
        error,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    logger.error({ error }, "Error in createChannel controller");
    return res.status(500).json({
      error: "Failed to create channel",
    });
  }
}

/**
 * Send a value through a channel
 */
export async function sendToChannel(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const { sender, value } = req.body as ChannelSenderOperationRequest;

    if (!sender) {
      return res.status(400).json({
        error: "Sender is required",
      });
    }

    if (value === undefined) {
      return res.status(400).json({
        error: "Value to send is required",
      });
    }

    let success = true;
    let error: string | null = null;
    let isClosed = false;

    try {
      await sender.send(value);
      isClosed = sender.closed;
    } catch (err) {
      success = false;
      error = extractErrorMessage(err);
      if (err instanceof ChannelError && error.includes("closed")) {
        isClosed = true;
      }
    }

    const response: ChannelSenderOperationResponse = {
      data: {
        operation: "send",
        result: success,
        isClosed,
        success,
        error,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    logger.error({ error }, "Error in sendToChannel controller");
    return res.status(500).json({
      error: "Failed to send to channel",
    });
  }
}

/**
 * Try to send a value through a channel without blocking
 */
export async function trySendToChannel(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const { sender, value } = req.body as ChannelSenderOperationRequest;

    if (!sender) {
      return res.status(400).json({
        error: "Sender is required",
      });
    }

    if (value === undefined) {
      return res.status(400).json({
        error: "Value to send is required",
      });
    }

    let result;
    let success = true;
    let error: string | null = null;
    let isClosed = false;

    try {
      result = await sender.trySend(value);
      isClosed = sender.closed;
    } catch (err) {
      success = false;
      error = extractErrorMessage(err);
      if (err instanceof ChannelError && error.includes("closed")) {
        isClosed = true;
      }
    }

    const response: ChannelSenderOperationResponse = {
      data: {
        operation: "trySend",
        result,
        isClosed,
        success,
        error,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    logger.error({ error }, "Error in trySendToChannel controller");
    return res.status(500).json({
      error: "Failed to try send to channel",
    });
  }
}

/**
 * Receive a value from a channel
 */
export async function receiveFromChannel(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const { receiver } = req.body as ChannelReceiverOperationRequest;

    if (!receiver) {
      return res.status(400).json({
        error: "Receiver is required",
      });
    }

    let result;
    let success = true;
    let error: string | null = null;
    let isClosed = false;

    try {
      result = await receiver.receive();
      isClosed = receiver.closed;

      if (result instanceof Option) {
        result = {
          isSome: result.isSome(),
          value: result.isSome() ? result.unwrap() : null,
        };
      }
    } catch (err) {
      success = false;
      error = extractErrorMessage(err);
    }

    const response: ChannelReceiverOperationResponse = {
      data: {
        operation: "receive",
        result,
        isClosed,
        success,
        error,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    logger.error({ error }, "Error in receiveFromChannel controller");
    return res.status(500).json({
      error: "Failed to receive from channel",
    });
  }
}

/**
 * Try to receive a value from a channel without blocking
 */
export function tryReceiveFromChannel(req: Request, res: Response): Response {
  try {
    const { receiver } = req.body as ChannelReceiverOperationRequest;

    if (!receiver) {
      return res.status(400).json({
        error: "Receiver is required",
      });
    }

    let result;
    let success = true;
    let error: string | null = null;
    let isClosed = false;

    try {
      result = receiver.tryReceive();
      isClosed = receiver.closed;

      if (result instanceof Option) {
        result = {
          isSome: result.isSome(),
          value: result.isSome() ? result.unwrap() : null,
        };
      }
    } catch (err) {
      success = false;
      error = extractErrorMessage(err);
    }

    const response: ChannelReceiverOperationResponse = {
      data: {
        operation: "tryReceive",
        result,
        isClosed,
        success,
        error,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    logger.error({ error }, "Error in tryReceiveFromChannel controller");
    return res.status(500).json({
      error: "Failed to try receive from channel",
    });
  }
}

/**
 * Close a channel
 */
export function closeChannel(req: Request, res: Response): Response {
  try {
    const { sender } = req.body as ChannelSenderOperationRequest;

    if (!sender) {
      return res.status(400).json({
        error: "Sender is required",
      });
    }

    let success = true;
    let error: string | null = null;
    let isClosed = false;

    try {
      sender.close();
      isClosed = sender.closed;
    } catch (err) {
      success = false;
      error = extractErrorMessage(err);
    }

    const response: ChannelSenderOperationResponse = {
      data: {
        operation: "close",
        result: success,
        isClosed,
        success,
        error,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    logger.error({ error }, "Error in closeChannel controller");
    return res.status(500).json({
      error: "Failed to close channel",
    });
  }
}

/**
 * Create a new task
 */
export function createTask(req: Request, res: Response): Response {
  try {
    const { executor, directValue, error, isResolve, isReject } =
      req.body as CreateTaskRequest;

    let task;
    let success = true;
    let errorStr: string | null = null;

    try {
      if (isResolve) {
        task = Task.resolve(directValue);
      } else if (isReject) {
        const appError = new AppError(Str.fromRaw(error || "Task error"));
        task = Task.reject(appError);
      } else if (executor) {
        task = Task.new(executor);
      } else {
        return res.status(400).json({
          error: "Either executor, isResolve, or isReject must be provided",
        });
      }
    } catch (err) {
      success = false;
      errorStr = extractErrorMessage(err);
    }

    const response: TaskResponse = {
      data: {
        task,
        success,
        error: errorStr,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    logger.error({ error }, "Error in createTask controller");
    return res.status(500).json({
      error: "Failed to create task",
    });
  }
}

/**
 * Map a task to a new one
 */
export function mapTask(req: Request, res: Response): Response {
  try {
    const { task, mapFn } = req.body as TaskMapRequest;

    if (!task) {
      return res.status(400).json({
        error: "Task is required",
      });
    }

    if (!mapFn || typeof mapFn !== "function") {
      return res.status(400).json({
        error: "Map function is required",
      });
    }

    let result;
    let success = true;
    let error: string | null = null;
    let isCancelled = false;

    try {
      result = task.map(mapFn);
      isCancelled = result.isCancelled;
    } catch (err) {
      success = false;
      error = extractErrorMessage(err);
    }

    const response: TaskOperationResponse = {
      data: {
        operation: "map",
        result,
        isCancelled,
        success,
        error,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    logger.error({ error }, "Error in mapTask controller");
    return res.status(500).json({
      error: "Failed to map task",
    });
  }
}

/**
 * Flat map a task to a new one
 */
export function flatMapTask(req: Request, res: Response): Response {
  try {
    const { task, flatMapFn } = req.body as TaskFlatMapRequest;

    if (!task) {
      return res.status(400).json({
        error: "Task is required",
      });
    }

    if (!flatMapFn || typeof flatMapFn !== "function") {
      return res.status(400).json({
        error: "Flat map function is required",
      });
    }

    let result;
    let success = true;
    let error: string | null = null;
    let isCancelled = false;

    try {
      result = task.flatMap(flatMapFn);
      isCancelled = result.isCancelled;
    } catch (err) {
      success = false;
      error = extractErrorMessage(err);
    }

    const response: TaskOperationResponse = {
      data: {
        operation: "flatMap",
        result,
        isCancelled,
        success,
        error,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    logger.error({ error }, "Error in flatMapTask controller");
    return res.status(500).json({
      error: "Failed to flat map task",
    });
  }
}

/**
 * Add error handling to a task
 */
export function catchTask(req: Request, res: Response): Response {
  try {
    const { task, catchFn } = req.body as TaskCatchRequest;

    if (!task) {
      return res.status(400).json({
        error: "Task is required",
      });
    }

    if (!catchFn || typeof catchFn !== "function") {
      return res.status(400).json({
        error: "Catch function is required",
      });
    }

    let result;
    let success = true;
    let error: string | null = null;
    let isCancelled = false;

    try {
      result = task.catch(catchFn);
      isCancelled = result.isCancelled;
    } catch (err) {
      success = false;
      error = extractErrorMessage(err);
    }

    const response: TaskOperationResponse = {
      data: {
        operation: "catch",
        result,
        isCancelled,
        success,
        error,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    logger.error({ error }, "Error in catchTask controller");
    return res.status(500).json({
      error: "Failed to add error handling to task",
    });
  }
}

/**
 * Run a task
 */
export async function runTask(req: Request, res: Response): Promise<Response> {
  try {
    const { task } = req.body as TaskRunRequest;

    if (!task) {
      return res.status(400).json({
        error: "Task is required",
      });
    }

    let result;
    let success = true;
    let error: string | null = null;
    let isCancelled = false;

    try {
      result = await task.run();
      isCancelled = task.isCancelled;

      if (result instanceof Result) {
        result = {
          isOk: result.isOk(),
          value: result.isOk() ? result.unwrap() : null,
          error: result.isErr() ? result.getError() : null,
        };
      }
    } catch (err) {
      success = false;
      error = extractErrorMessage(err);
    }

    const response: TaskOperationResponse = {
      data: {
        operation: "run",
        result,
        isCancelled,
        success,
        error,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    logger.error({ error }, "Error in runTask controller");
    return res.status(500).json({
      error: "Failed to run task",
    });
  }
}

/**
 * Cancel a task
 */
export function cancelTask(req: Request, res: Response): Response {
  try {
    const { task } = req.body;

    if (!task) {
      return res.status(400).json({
        error: "Task is required",
      });
    }

    let success = true;
    let error: string | null = null;
    let isCancelled = false;

    try {
      task.cancel();
      isCancelled = task.isCancelled;
    } catch (err) {
      success = false;
      error = extractErrorMessage(err);
    }

    const response: TaskOperationResponse = {
      data: {
        operation: "cancel",
        result: null,
        isCancelled,
        success,
        error,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    logger.error({ error }, "Error in cancelTask controller");
    return res.status(500).json({
      error: "Failed to cancel task",
    });
  }
}

/**
 * Generic async operations router
 */
export async function asyncOperations(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const { type, operation } = req.body as AsyncOperationRequest;

    if (!type) {
      return res.status(400).json({
        error: "Type is required ('Channel' or 'Task')",
      });
    }

    if (!operation) {
      return res.status(400).json({
        error: "Operation is required",
      });
    }

    switch (type) {
      case "Channel":
        switch (operation) {
          case "send":
            return sendToChannel(req, res);
          case "trySend":
            return trySendToChannel(req, res);
          case "receive":
            return receiveFromChannel(req, res);
          case "tryReceive":
            return tryReceiveFromChannel(req, res);
          case "close":
            return closeChannel(req, res);
          default:
            return res.status(400).json({
              error: `Unknown Channel operation: ${operation}`,
            });
        }
      case "Task":
        switch (operation) {
          case "map":
            return mapTask(req, res);
          case "flatMap":
            return flatMapTask(req, res);
          case "catch":
            return catchTask(req, res);
          case "run":
            return runTask(req, res);
          case "cancel":
            return cancelTask(req, res);
          case "isCancelled":
            const { task } = req.body;
            if (!task) {
              return res.status(400).json({
                error: "Task is required",
              });
            }
            return res.status(200).json({
              data: {
                type: "Task",
                operation: "isCancelled",
                result: task.isCancelled,
                isCancelled: task.isCancelled,
                success: true,
                error: null,
              },
            });
          default:
            return res.status(400).json({
              error: `Unknown Task operation: ${operation}`,
            });
        }
      default:
        return res.status(400).json({
          error: `Unknown type: ${type}`,
        });
    }
  } catch (error) {
    logger.error({ error }, "Error in asyncOperations controller");
    return res.status(500).json({
      error: "Failed to perform async operation",
    });
  }
}

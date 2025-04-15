import { Request, Response } from "express";
import {
  Resource,
  ResourceError,
  withResource,
  DisposableGroup,
  useDisposableResource,
  IDisposable,
} from "milost";
import { Option } from "milost";
import logger from "../utils/logger.js";
import {
  CreateResourceRequest,
  ResourceResponse,
  ResourceUseRequest,
  ResourceUseAsyncRequest,
  ResourceDisposeRequest,
  ResourceOperationResponse,
  WithResourceRequest,
  WithResourceResponse,
  CreateDisposableGroupRequest,
  DisposableGroupResponse,
  DisposableGroupAddRequest,
  DisposableGroupDisposeRequest,
  DisposableGroupOperationResponse,
  UseDisposableResourceRequest,
  ResourceOperationRequest,
  ResourceOperationResponseGeneric,
} from "../types/resource.js";

function extractErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

/**
 * Create a new resource
 */
export function createResource(req: Request, res: Response): Response {
  try {
    const { value, disposeFn } = req.body as CreateResourceRequest;

    if (value === undefined) {
      return res.status(400).json({
        error: "Value is required",
      });
    }

    if (!disposeFn || typeof disposeFn !== "function") {
      return res.status(400).json({
        error: "Dispose function is required",
      });
    }

    let resource;
    let success = true;
    let error: string | null = null;

    try {
      resource = Resource.new(value, disposeFn);
    } catch (err) {
      success = false;
      error = extractErrorMessage(err);
    }

    const response: ResourceResponse = {
      data: {
        value,
        resource,
        success,
        error,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    logger.error({ error }, "Error in createResource controller");
    return res.status(500).json({
      error: "Failed to create resource",
    });
  }
}

/**
 * Use a resource with a function
 */
export function useResource(req: Request, res: Response): Response {
  try {
    const { resource, fn } = req.body as ResourceUseRequest;

    if (!resource) {
      return res.status(400).json({
        error: "Resource is required",
      });
    }

    if (!fn || typeof fn !== "function") {
      return res.status(400).json({
        error: "Function is required",
      });
    }

    let result;
    let success = true;
    let error: string | null = null;
    let isDisposed = false;

    try {
      result = resource.use(fn);
      isDisposed = resource.isDisposed;
    } catch (err) {
      success = false;
      error = extractErrorMessage(err);
    }

    const response: ResourceOperationResponse = {
      data: {
        operation: "use",
        result,
        isDisposed,
        success,
        error,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    logger.error({ error }, "Error in useResource controller");
    return res.status(500).json({
      error: "Failed to use resource",
    });
  }
}

/**
 * Use a resource with an async function
 */
export async function useResourceAsync(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const { resource, fn } = req.body as ResourceUseAsyncRequest;

    if (!resource) {
      return res.status(400).json({
        error: "Resource is required",
      });
    }

    if (!fn || typeof fn !== "function") {
      return res.status(400).json({
        error: "Async function is required",
      });
    }

    let result;
    let success = true;
    let error: string | null = null;
    let isDisposed = false;

    try {
      result = await resource.useAsync(fn);
      isDisposed = resource.isDisposed;
    } catch (err) {
      success = false;
      error = extractErrorMessage(err);
    }

    const response: ResourceOperationResponse = {
      data: {
        operation: "useAsync",
        result,
        isDisposed,
        success,
        error,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    logger.error({ error }, "Error in useResourceAsync controller");
    return res.status(500).json({
      error: "Failed to use resource asynchronously",
    });
  }
}

/**
 * Dispose a resource
 */
export async function disposeResource(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const { resource } = req.body as ResourceDisposeRequest;

    if (!resource) {
      return res.status(400).json({
        error: "Resource is required",
      });
    }

    let success = true;
    let error: string | null = null;
    let isDisposed = false;

    try {
      await resource.dispose();
      isDisposed = resource.isDisposed;
    } catch (err) {
      success = false;
      error = extractErrorMessage(err);
    }

    const response: ResourceOperationResponse = {
      data: {
        operation: "dispose",
        result: null,
        isDisposed,
        success,
        error,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    logger.error({ error }, "Error in disposeResource controller");
    return res.status(500).json({
      error: "Failed to dispose resource",
    });
  }
}

/**
 * Check if a resource is disposed
 */
export function resourceStatus(req: Request, res: Response): Response {
  try {
    const { resource } = req.body;

    if (!resource) {
      return res.status(400).json({
        error: "Resource is required",
      });
    }

    let isDisposed = false;
    let valueOrNone;
    let success = true;
    let error: string | null = null;

    try {
      isDisposed = resource.isDisposed;
      valueOrNone = resource.valueOrNone;

      if (valueOrNone instanceof Option) {
        valueOrNone = {
          isSome: valueOrNone.isSome(),
          value: valueOrNone.isSome() ? valueOrNone.unwrap() : null,
        };
      }
    } catch (err) {
      success = false;
      error = extractErrorMessage(err);
    }

    const response: ResourceOperationResponse = {
      data: {
        operation: "isDisposed",
        result: {
          isDisposed,
          valueOrNone,
        },
        isDisposed,
        success,
        error,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    logger.error({ error }, "Error in resourceStatus controller");
    return res.status(500).json({
      error: "Failed to check resource status",
    });
  }
}

/**
 * Use a resource and automatically dispose it
 */
export async function withResourceFunc(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const { resource, fn } = req.body as WithResourceRequest;

    if (!resource) {
      return res.status(400).json({
        error: "Resource is required",
      });
    }

    if (!fn || typeof fn !== "function") {
      return res.status(400).json({
        error: "Function is required",
      });
    }

    let result;
    let success = true;
    let error: string | null = null;

    try {
      result = await withResource(resource, fn);
    } catch (err) {
      success = false;
      error = extractErrorMessage(err);
    }

    const response: WithResourceResponse = {
      data: {
        result,
        success,
        error,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    logger.error({ error }, "Error in withResourceFunc controller");
    return res.status(500).json({
      error: "Failed to use resource with automatic disposal",
    });
  }
}

/**
 * Create a new disposable group
 */
export function createDisposableGroup(req: Request, res: Response): Response {
  try {
    const { empty } = req.body as CreateDisposableGroupRequest;

    let group;
    let success = true;
    let error: string | null = null;
    let size = 0;
    let isDisposed = false;

    try {
      if (empty) {
        group = DisposableGroup.empty();
      } else {
        group = DisposableGroup.new();
      }
      size = group.size;
      isDisposed = group.isDisposed;
    } catch (err) {
      success = false;
      error = extractErrorMessage(err);
    }

    const response: DisposableGroupResponse = {
      data: {
        group,
        size,
        isDisposed,
        success,
        error,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    logger.error({ error }, "Error in createDisposableGroup controller");
    return res.status(500).json({
      error: "Failed to create disposable group",
    });
  }
}

/**
 * Add a disposable to a group
 */
export function addToDisposableGroup(req: Request, res: Response): Response {
  try {
    const { group, disposable } = req.body as DisposableGroupAddRequest;

    if (!group) {
      return res.status(400).json({
        error: "Disposable group is required",
      });
    }

    if (!disposable || typeof disposable.dispose !== "function") {
      return res.status(400).json({
        error: "Disposable with dispose method is required",
      });
    }

    let result;
    let success = true;
    let error: string | null = null;
    let size = 0;
    let isDisposed = false;

    try {
      result = group.add(disposable);
      size = result.size;
      isDisposed = result.isDisposed;
    } catch (err) {
      success = false;
      error = extractErrorMessage(err);
    }

    const response: DisposableGroupOperationResponse = {
      data: {
        operation: "add",
        result,
        size,
        isDisposed,
        success,
        error,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    logger.error({ error }, "Error in addToDisposableGroup controller");
    return res.status(500).json({
      error: "Failed to add to disposable group",
    });
  }
}

/**
 * Dispose a disposable group
 */
export async function disposeDisposableGroup(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const { group } = req.body as DisposableGroupDisposeRequest;

    if (!group) {
      return res.status(400).json({
        error: "Disposable group is required",
      });
    }

    let success = true;
    let error: string | null = null;
    let isDisposed = false;
    let size = 0;

    try {
      await group.dispose();
      isDisposed = group.isDisposed;
      size = group.size;
    } catch (err) {
      success = false;
      error = extractErrorMessage(err);
    }

    const response: DisposableGroupOperationResponse = {
      data: {
        operation: "dispose",
        result: null,
        size,
        isDisposed,
        success,
        error,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    logger.error({ error }, "Error in disposeDisposableGroup controller");
    return res.status(500).json({
      error: "Failed to dispose disposable group",
    });
  }
}

/**
 * Check status of a disposable group
 */
export function disposableGroupStatus(req: Request, res: Response): Response {
  try {
    const { group } = req.body;

    if (!group) {
      return res.status(400).json({
        error: "Disposable group is required",
      });
    }

    let isDisposed = false;
    let size = 0;
    let success = true;
    let error: string | null = null;

    try {
      isDisposed = group.isDisposed;
      size = group.size;
    } catch (err) {
      success = false;
      error = extractErrorMessage(err);
    }

    const response: DisposableGroupOperationResponse = {
      data: {
        operation: "isDisposed",
        result: {
          isDisposed,
          size,
        },
        size,
        isDisposed,
        success,
        error,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    logger.error({ error }, "Error in disposableGroupStatus controller");
    return res.status(500).json({
      error: "Failed to check disposable group status",
    });
  }
}

/**
 * Create a resource from a disposable
 */
export async function useDisposableResourceFunc(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const { disposable } = req.body as UseDisposableResourceRequest;

    if (!disposable || typeof disposable.dispose !== "function") {
      return res.status(400).json({
        error: "Disposable with dispose method is required",
      });
    }

    let result;
    let success = true;
    let error: string | null = null;

    try {
      const useDisposable = useDisposableResource();
      result = await useDisposable(disposable as IDisposable);
    } catch (err) {
      success = false;
      error = extractErrorMessage(err);
    }

    const response: ResourceResponse = {
      data: {
        value: disposable,
        resource: result,
        success,
        error,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    logger.error({ error }, "Error in useDisposableResourceFunc controller");
    return res.status(500).json({
      error: "Failed to create resource from disposable",
    });
  }
}

/**
 * Generic resource operations router
 */
export async function resourceOperations(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const { type, operation } = req.body as ResourceOperationRequest;

    if (!type) {
      return res.status(400).json({
        error: "Type is required ('Resource' or 'DisposableGroup')",
      });
    }

    if (!operation) {
      return res.status(400).json({
        error: "Operation is required",
      });
    }

    switch (type) {
      case "Resource":
        switch (operation) {
          case "use":
            return useResource(req, res);
          case "useAsync":
            return useResourceAsync(req, res);
          case "dispose":
            return disposeResource(req, res);
          case "isDisposed":
          case "valueOrNone":
            return resourceStatus(req, res);
          default:
            return res.status(400).json({
              error: `Unknown Resource operation: ${operation}`,
            });
        }
      case "DisposableGroup":
        switch (operation) {
          case "add":
            return addToDisposableGroup(req, res);
          case "dispose":
            return disposeDisposableGroup(req, res);
          case "isDisposed":
          case "size":
            return disposableGroupStatus(req, res);
          default:
            return res.status(400).json({
              error: `Unknown DisposableGroup operation: ${operation}`,
            });
        }
      default:
        return res.status(400).json({
          error: `Unknown type: ${type}`,
        });
    }
  } catch (error) {
    logger.error({ error }, "Error in resourceOperations controller");
    return res.status(500).json({
      error: "Failed to perform resource operation",
    });
  }
}

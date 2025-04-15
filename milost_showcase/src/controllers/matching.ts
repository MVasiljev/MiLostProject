import { Request, Response } from "express";
import {
  MatchBuilder,
  PatternMatcher,
  SomePattern,
  NonePattern,
  OkPattern,
  ErrPattern,
  _,
  matchValue,
} from "milost";
import logger from "../utils/logger.js";
import {
  CreateMatchBuilderRequest,
  MatchBuilderResponse,
  MatchBuilderWithRequest,
  MatchBuilderOtherwiseRequest,
  MatchBuilderOperationResponse,
  PatternMatcherMatchesPatternRequest,
  PatternMatcherExtractValueRequest,
  PatternMatcherMatchValueRequest,
  PatternMatcherOperationResponse,
  MatchingOperationRequest,
  MatchingOperationResponse,
} from "../types/matching.js";

function extractErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

/**
 * Create a new match builder
 */
export function createMatchBuilder(req: Request, res: Response): Response {
  try {
    const { value } = req.body as CreateMatchBuilderRequest;

    if (value === undefined) {
      return res.status(400).json({
        error: "Value to match against is required",
      });
    }

    let result;
    let success = true;
    let error: string | null = null;

    try {
      result = MatchBuilder.create(value);
    } catch (err) {
      success = false;
      error = extractErrorMessage(err);
    }

    const response: MatchBuilderResponse = {
      data: {
        value,
        result,
        success,
        error,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    logger.error({ error }, "Error in createMatchBuilder controller");
    return res.status(500).json({
      error: "Failed to create match builder",
    });
  }
}

/**
 * Add a pattern arm to a match builder
 */
export function matchBuilderWith(req: Request, res: Response): Response {
  try {
    const { matchBuilder, pattern, handler } =
      req.body as MatchBuilderWithRequest;

    if (!matchBuilder) {
      return res.status(400).json({
        error: "Match builder is required",
      });
    }

    if (pattern === undefined) {
      return res.status(400).json({
        error: "Pattern is required",
      });
    }

    if (!handler || typeof handler !== "function") {
      return res.status(400).json({
        error: "Handler function is required",
      });
    }

    let result;
    let success = true;
    let error: string | null = null;

    try {
      let resolvedPattern = pattern;
      if (pattern === "Some") resolvedPattern = SomePattern;
      else if (pattern === "None") resolvedPattern = NonePattern;
      else if (pattern === "Ok") resolvedPattern = OkPattern;
      else if (pattern === "Err") resolvedPattern = ErrPattern;
      else if (pattern === "_") resolvedPattern = _;

      result = matchBuilder.with(resolvedPattern, handler);
    } catch (err) {
      success = false;
      error = extractErrorMessage(err);
    }

    const response: MatchBuilderOperationResponse = {
      data: {
        operation: "with",
        result,
        success,
        error,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    logger.error({ error }, "Error in matchBuilderWith controller");
    return res.status(500).json({
      error: "Failed to add pattern to match builder",
    });
  }
}

/**
 * Execute match builder with a default handler
 */
export function matchBuilderOtherwise(req: Request, res: Response): Response {
  try {
    const { matchBuilder, defaultHandler } =
      req.body as MatchBuilderOtherwiseRequest;

    if (!matchBuilder) {
      return res.status(400).json({
        error: "Match builder is required",
      });
    }

    if (!defaultHandler || typeof defaultHandler !== "function") {
      return res.status(400).json({
        error: "Default handler function is required",
      });
    }

    let result;
    let success = true;
    let error: string | null = null;

    try {
      result = matchBuilder.otherwise(defaultHandler);
    } catch (err) {
      success = false;
      error = extractErrorMessage(err);
    }

    const response: MatchBuilderOperationResponse = {
      data: {
        operation: "otherwise",
        result,
        success,
        error,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    logger.error({ error }, "Error in matchBuilderOtherwise controller");
    return res.status(500).json({
      error: "Failed to execute match builder",
    });
  }
}

/**
 * Check if a value matches a pattern
 */
export function patternMatcherMatchesPattern(
  req: Request,
  res: Response
): Response {
  try {
    const { value, pattern } = req.body as PatternMatcherMatchesPatternRequest;

    if (value === undefined) {
      return res.status(400).json({
        error: "Value is required",
      });
    }

    if (pattern === undefined) {
      return res.status(400).json({
        error: "Pattern is required",
      });
    }

    let result;
    let success = true;
    let error: string | null = null;

    try {
      let resolvedPattern = pattern;
      if (pattern === "Some") resolvedPattern = SomePattern;
      else if (pattern === "None") resolvedPattern = NonePattern;
      else if (pattern === "Ok") resolvedPattern = OkPattern;
      else if (pattern === "Err") resolvedPattern = ErrPattern;
      else if (pattern === "_") resolvedPattern = _;

      result = PatternMatcher.matchesPattern(value, resolvedPattern);
    } catch (err) {
      success = false;
      error = extractErrorMessage(err);
    }

    const response: PatternMatcherOperationResponse = {
      data: {
        operation: "matchesPattern",
        result,
        success,
        error,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    logger.error({ error }, "Error in patternMatcherMatchesPattern controller");
    return res.status(500).json({
      error: "Failed to check pattern match",
    });
  }
}

/**
 * Extract a value from a pattern match
 */
export function patternMatcherExtractValue(
  req: Request,
  res: Response
): Response {
  try {
    const { value, pattern } = req.body as PatternMatcherExtractValueRequest;

    if (value === undefined) {
      return res.status(400).json({
        error: "Value is required",
      });
    }

    if (pattern === undefined) {
      return res.status(400).json({
        error: "Pattern is required",
      });
    }

    let result;
    let success = true;
    let error: string | null = null;

    try {
      let resolvedPattern = pattern;
      if (pattern === "Some") resolvedPattern = SomePattern;
      else if (pattern === "None") resolvedPattern = NonePattern;
      else if (pattern === "Ok") resolvedPattern = OkPattern;
      else if (pattern === "Err") resolvedPattern = ErrPattern;
      else if (pattern === "_") resolvedPattern = _;

      result = PatternMatcher.extractValue(value, resolvedPattern);
    } catch (err) {
      success = false;
      error = extractErrorMessage(err);
    }

    const response: PatternMatcherOperationResponse = {
      data: {
        operation: "extractValue",
        result,
        success,
        error,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    logger.error({ error }, "Error in patternMatcherExtractValue controller");
    return res.status(500).json({
      error: "Failed to extract value from pattern",
    });
  }
}

/**
 * Match a value against patterns
 */
export async function patternMatcherMatchValue(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const { value, patterns } = req.body as PatternMatcherMatchValueRequest;

    if (value === undefined) {
      return res.status(400).json({
        error: "Value is required",
      });
    }

    if (!patterns) {
      return res.status(400).json({
        error: "Patterns are required",
      });
    }

    let result;
    let success = true;
    let error: string | null = null;

    try {
      let resolvedPatterns = patterns;

      if (Array.isArray(patterns)) {
        resolvedPatterns = patterns.map(([pattern, handler]) => {
          let resolvedPattern = pattern;
          if (pattern === "Some") resolvedPattern = SomePattern;
          else if (pattern === "None") resolvedPattern = NonePattern;
          else if (pattern === "Ok") resolvedPattern = OkPattern;
          else if (pattern === "Err") resolvedPattern = ErrPattern;
          else if (pattern === "_") resolvedPattern = _;
          return [resolvedPattern, handler];
        });
      }

      result = await matchValue(value, resolvedPatterns);
    } catch (err) {
      success = false;
      error = extractErrorMessage(err);
    }

    const response: PatternMatcherOperationResponse = {
      data: {
        operation: "matchValue",
        result,
        success,
        error,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    logger.error({ error }, "Error in patternMatcherMatchValue controller");
    return res.status(500).json({
      error: "Failed to match value against patterns",
    });
  }
}

/**
 * Generic matching operations router
 */
export async function matchingOperations(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const { type, operation } = req.body as MatchingOperationRequest;

    if (!type) {
      return res.status(400).json({
        error: "Matching type is required ('MatchBuilder' or 'PatternMatcher')",
      });
    }

    if (!operation) {
      return res.status(400).json({
        error: "Operation is required",
      });
    }

    switch (type) {
      case "MatchBuilder":
        switch (operation) {
          case "with":
            return matchBuilderWith(req, res);
          case "otherwise":
            return matchBuilderOtherwise(req, res);
          default:
            return res.status(400).json({
              error: `Unknown MatchBuilder operation: ${operation}`,
            });
        }
      case "PatternMatcher":
        switch (operation) {
          case "matchesPattern":
            return patternMatcherMatchesPattern(req, res);
          case "extractValue":
            return patternMatcherExtractValue(req, res);
          case "matchValue":
            return patternMatcherMatchValue(req, res);
          default:
            return res.status(400).json({
              error: `Unknown PatternMatcher operation: ${operation}`,
            });
        }
      default:
        return res.status(400).json({
          error: `Unknown matching type: ${type}`,
        });
    }
  } catch (error) {
    logger.error({ error }, "Error in matchingOperations controller");
    return res.status(500).json({
      error: "Failed to perform matching operation",
    });
  }
}

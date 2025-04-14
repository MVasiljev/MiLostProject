import { Request, Response } from "express";
/**
 * Create a new vector
 */
export declare function createVector(req: Request, res: Response): Response;
/**
 * Perform operations on a vector
 */
export declare function vectorOperations(req: Request, res: Response): Response;
/**
 * Map over a vector
 */
export declare function mapVector(req: Request, res: Response): Response;
/**
 * Filter a vector
 */
export declare function filterVector(req: Request, res: Response): Response;
/**
 * Reduce a vector
 */
export declare function reduceVector(req: Request, res: Response): Response;
/**
 * Take or drop elements from a vector
 */
export declare function takeDropVector(req: Request, res: Response): Response;
/**
 * Check if all or any elements satisfy a predicate
 */
export declare function checkVector(req: Request, res: Response): Response;

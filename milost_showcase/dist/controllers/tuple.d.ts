import { Request, Response } from "express";
/**
 * Create a new tuple and analyze it
 */
export declare function createTuple(req: Request, res: Response): Response;
/**
 * Get item from tuple by index
 */
export declare function getTupleItem(req: Request, res: Response): Response;
/**
 * Get first item from tuple
 */
export declare function getFirstItem(req: Request, res: Response): Response;
/**
 * Get second item from tuple
 */
export declare function getSecondItem(req: Request, res: Response): Response;
/**
 * Replace an item in a tuple
 */
export declare function replaceTupleItem(req: Request, res: Response): Response;
/**
 * Map a tuple
 */
export declare function mapTuple(req: Request, res: Response): Response;
/**
 * Get tuple length
 */
export declare function getTupleLength(req: Request, res: Response): Response;
/**
 * Perform a tuple operation
 */
export declare function tupleOperations(req: Request, res: Response): Response;
/**
 * Parse and analyze a tuple from a string input
 */
export declare function analyzeTuple(req: Request, res: Response): Response;

import { Request, Response } from "express";
/**
 * Create a new struct and analyze it
 */
export declare function createStruct(req: Request, res: Response): Response;
/**
 * Get a value from a struct by key
 */
export declare function getStructValue(req: Request, res: Response): Response;
/**
 * Set a value in a struct
 */
export declare function setStructValue(req: Request, res: Response): Response;
/**
 * Get keys of a struct
 */
export declare function getStructKeys(req: Request, res: Response): Response;
/**
 * Get entries of a struct
 */
export declare function getStructEntries(req: Request, res: Response): Response;
/**
 * Map a struct
 */
export declare function mapStruct(req: Request, res: Response): Response;
/**
 * Filter a struct
 */
export declare function filterStruct(req: Request, res: Response): Response;
/**
 * Perform a struct operation
 */
export declare function structOperations(req: Request, res: Response): Response;
/**
 * Parse and analyze a struct from a string input
 */
export declare function analyzeStruct(req: Request, res: Response): Response;

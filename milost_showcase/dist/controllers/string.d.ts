import { Request, Response } from "express";
/**
 * Create a new string and analyze it
 */
export declare function createString(req: Request, res: Response): Response;
/**
 * Perform basic transformations on a string
 */
export declare function stringTransformations(req: Request, res: Response): Response;
/**
 * Perform substring operations on a string
 */
export declare function substringOperations(req: Request, res: Response): Response;
/**
 * Perform search operations on a string
 */
export declare function searchOperations(req: Request, res: Response): Response;
/**
 * Compare two strings
 */
export declare function compareStrings(req: Request, res: Response): Response;
/**
 * Concatenate strings
 */
export declare function concatenateStrings(req: Request, res: Response): Response;

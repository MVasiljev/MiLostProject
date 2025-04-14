import { Request, Response } from "express";
/**
 * Create a new hash map and analyze it
 */
export declare function createHashMap(req: Request, res: Response): Response;
/**
 * Get a value from a hash map by key
 */
export declare function getHashMapValue(req: Request, res: Response): Response;
/**
 * Check if a hash map contains a key
 */
export declare function containsHashMapKey(req: Request, res: Response): Response;
/**
 * Set a value in a hash map
 */
export declare function setHashMapValue(req: Request, res: Response): Response;
/**
 * Remove a key-value pair from a hash map
 */
export declare function removeHashMapEntry(req: Request, res: Response): Response;
/**
 * Get keys of a hash map
 */
export declare function getHashMapKeys(req: Request, res: Response): Response;
/**
 * Get values of a hash map
 */
export declare function getHashMapValues(req: Request, res: Response): Response;
/**
 * Get entries of a hash map
 */
export declare function getHashMapEntries(req: Request, res: Response): Response;
/**
 * Map a hash map
 */
export declare function mapHashMap(req: Request, res: Response): Response;
/**
 * Filter a hash map
 */
export declare function filterHashMap(req: Request, res: Response): Response;
/**
 * Perform a hash map operation
 */
export declare function hashMapOperations(req: Request, res: Response): Response;
/**
 * Parse and analyze a hash map from a string input
 */
export declare function analyzeHashMap(req: Request, res: Response): Response;

import { Str } from "milost";
import logger from "../utils/logger.js";
/**
 * Create a new string and analyze it
 */
export function createString(req, res) {
    try {
        const { value } = req.body;
        if (!value) {
            return res.status(400).json({
                error: "String value is required",
            });
        }
        const str = Str.fromRaw(value);
        const response = {
            data: {
                original: value,
                length: str.len(),
                isEmpty: str.isEmpty(),
            },
        };
        return res.status(200).json(response);
    }
    catch (error) {
        logger.error({ error }, "Error in createString controller");
        return res.status(500).json({
            error: "Failed to create string",
        });
    }
}
/**
 * Perform basic transformations on a string
 */
export function stringTransformations(req, res) {
    try {
        const { value, operation } = req.body;
        if (!value || !operation) {
            return res.status(400).json({
                error: "String value and operation are required",
            });
        }
        const str = Str.fromRaw(value);
        let result;
        switch (operation) {
            case "uppercase":
                result = str.toUpperCase().unwrap();
                break;
            case "lowercase":
                result = str.toLowerCase().unwrap();
                break;
            case "trim":
                result = str.trim().unwrap();
                break;
            case "reverse":
                result = str.unwrap().split("").reverse().join("");
                break;
            default:
                return res.status(400).json({
                    error: `Unknown operation: ${operation}`,
                });
        }
        const response = {
            data: {
                original: value,
                operation,
                result,
            },
        };
        return res.status(200).json(response);
    }
    catch (error) {
        logger.error({ error }, "Error in stringTransformations controller");
        return res.status(500).json({
            error: "Failed to perform string operation",
        });
    }
}
/**
 * Perform substring operations on a string
 */
export function substringOperations(req, res) {
    try {
        const { value, operation, start, end, searchStr } = req.body;
        if (!value || !operation) {
            return res.status(400).json({
                error: "String value and operation are required",
            });
        }
        const str = Str.fromRaw(value);
        let result;
        switch (operation) {
            case "substring":
                if (typeof start !== "number" || typeof end !== "number") {
                    return res.status(400).json({
                        error: "Start and end indices are required for substring operation",
                    });
                }
                result = str.substring(start, end).unwrap();
                break;
            case "charAt":
                if (typeof start !== "number") {
                    return res.status(400).json({
                        error: "Index is required for charAt operation",
                    });
                }
                result = str.charAt(start);
                break;
            case "startsWith":
                if (!searchStr) {
                    return res.status(400).json({
                        error: "Search string is required for startsWith operation",
                    });
                }
                result = str.startsWith(searchStr);
                break;
            case "endsWith":
                if (!searchStr) {
                    return res.status(400).json({
                        error: "Search string is required for endsWith operation",
                    });
                }
                result = str.endsWith(searchStr);
                break;
            default:
                return res.status(400).json({
                    error: `Unknown operation: ${operation}`,
                });
        }
        const response = {
            data: {
                original: value,
                operation,
                result,
                params: { start, end, searchStr },
            },
        };
        return res.status(200).json(response);
    }
    catch (error) {
        logger.error({ error }, "Error in substringOperations controller");
        return res.status(500).json({
            error: "Failed to perform substring operation",
        });
    }
}
/**
 * Perform search operations on a string
 */
export function searchOperations(req, res) {
    try {
        const { value, operation, searchStr, position, replaceStr } = req.body;
        if (!value || !operation || !searchStr) {
            return res.status(400).json({
                error: "String value, operation, and search string are required",
            });
        }
        const str = Str.fromRaw(value);
        let result;
        switch (operation) {
            case "contains":
                result = str.contains(searchStr);
                break;
            case "indexOf":
                result = str.indexOf(searchStr, position);
                break;
            case "lastIndexOf":
                result = str.lastIndexOf(searchStr);
                break;
            case "replace":
                if (!replaceStr && replaceStr !== "") {
                    return res.status(400).json({
                        error: "Replace string is required for replace operation",
                    });
                }
                result = str.replace(searchStr, replaceStr).unwrap();
                break;
            case "split":
                result = str.split(searchStr);
                break;
            default:
                return res.status(400).json({
                    error: `Unknown operation: ${operation}`,
                });
        }
        const response = {
            data: {
                original: value,
                operation,
                result,
                params: { searchStr, position, replaceStr },
            },
        };
        return res.status(200).json(response);
    }
    catch (error) {
        logger.error({ error }, "Error in searchOperations controller");
        return res.status(500).json({
            error: "Failed to perform search operation",
        });
    }
}
/**
 * Compare two strings
 */
export function compareStrings(req, res) {
    try {
        const { firstString, secondString } = req.body;
        if (!firstString || !secondString) {
            return res.status(400).json({
                error: "Both strings are required for comparison",
            });
        }
        const str1 = Str.fromRaw(firstString);
        const str2 = Str.fromRaw(secondString);
        const isEqual = str1.equals(str2);
        const response = {
            data: {
                firstString,
                secondString,
                equal: isEqual,
            },
        };
        return res.status(200).json(response);
    }
    catch (error) {
        logger.error({ error }, "Error in compareStrings controller");
        return res.status(500).json({
            error: "Failed to compare strings",
        });
    }
}
/**
 * Concatenate strings
 */
export function concatenateStrings(req, res) {
    try {
        const { firstString, secondString } = req.body;
        if (!firstString || !secondString) {
            return res.status(400).json({
                error: "Both strings are required for concatenation",
            });
        }
        const str1 = Str.fromRaw(firstString);
        const str2 = Str.fromRaw(secondString);
        const result = str1.concat(str2).unwrap();
        const response = {
            data: {
                firstString,
                secondString,
                result,
            },
        };
        return res.status(200).json(response);
    }
    catch (error) {
        logger.error({ error }, "Error in concatenateStrings controller");
        return res.status(500).json({
            error: "Failed to concatenate strings",
        });
    }
}
//# sourceMappingURL=string.js.map
import { Struct } from "milost";
import logger from "../utils/logger.js";
/**
 * Create a new struct and analyze it
 */
export function createStruct(req, res) {
    try {
        const { fields } = req.body;
        if (!fields || typeof fields !== "object") {
            return res.status(400).json({
                error: "Struct fields object is required",
            });
        }
        const struct = Struct.from(fields);
        const keys = struct.keys().toArray();
        return res.status(200).json({
            data: {
                original: fields,
                keys,
                isEmpty: keys.length === 0,
            },
        });
    }
    catch (error) {
        logger.error({ error }, "Error in createStruct controller");
        return res.status(500).json({
            error: "Failed to create struct",
        });
    }
}
/**
 * Get a value from a struct by key
 */
export function getStructValue(req, res) {
    try {
        const { fields, key } = req.body;
        if (!fields || typeof fields !== "object") {
            return res.status(400).json({
                error: "Struct fields object is required",
            });
        }
        if (!key) {
            return res.status(400).json({
                error: "Key is required",
            });
        }
        const struct = Struct.from(fields);
        const value = struct.get(key);
        return res.status(200).json({
            data: {
                original: fields,
                key,
                value,
            },
        });
    }
    catch (error) {
        logger.error({ error }, "Error in getStructValue controller");
        return res.status(500).json({
            error: "Failed to get struct value",
        });
    }
}
/**
 * Set a value in a struct
 */
export function setStructValue(req, res) {
    try {
        const { fields, key, value } = req.body;
        if (!fields || typeof fields !== "object") {
            return res.status(400).json({
                error: "Struct fields object is required",
            });
        }
        if (!key) {
            return res.status(400).json({
                error: "Key is required",
            });
        }
        if (value === undefined) {
            return res.status(400).json({
                error: "Value is required",
            });
        }
        const struct = Struct.from(fields);
        const newStruct = struct.set(key, value);
        const result = newStruct.toObject();
        return res.status(200).json({
            data: {
                original: fields,
                key,
                value,
                result,
            },
        });
    }
    catch (error) {
        logger.error({ error }, "Error in setStructValue controller");
        return res.status(500).json({
            error: "Failed to set struct value",
        });
    }
}
/**
 * Get keys of a struct
 */
export function getStructKeys(req, res) {
    try {
        const { fields } = req.body;
        if (!fields || typeof fields !== "object") {
            return res.status(400).json({
                error: "Struct fields object is required",
            });
        }
        const struct = Struct.from(fields);
        const keys = struct.keys().toArray();
        return res.status(200).json({
            data: {
                original: fields,
                keys,
            },
        });
    }
    catch (error) {
        logger.error({ error }, "Error in getStructKeys controller");
        return res.status(500).json({
            error: "Failed to get struct keys",
        });
    }
}
/**
 * Get entries of a struct
 */
export function getStructEntries(req, res) {
    try {
        const { fields } = req.body;
        if (!fields || typeof fields !== "object") {
            return res.status(400).json({
                error: "Struct fields object is required",
            });
        }
        const struct = Struct.from(fields);
        const entries = struct.entries().toArray();
        return res.status(200).json({
            data: {
                original: fields,
                entries,
            },
        });
    }
    catch (error) {
        logger.error({ error }, "Error in getStructEntries controller");
        return res.status(500).json({
            error: "Failed to get struct entries",
        });
    }
}
/**
 * Map a struct
 */
export function mapStruct(req, res) {
    try {
        const { fields, operation } = req.body;
        if (!fields || typeof fields !== "object") {
            return res.status(400).json({
                error: "Struct fields object is required",
            });
        }
        if (!operation) {
            return res.status(400).json({
                error: "Map operation is required",
            });
        }
        const struct = Struct.from(fields);
        let result;
        switch (operation) {
            case "double":
                result = struct
                    .map((value) => (typeof value === "number" ? value * 2 : value))
                    .toObject();
                break;
            case "square":
                result = struct
                    .map((value) => (typeof value === "number" ? value * value : value))
                    .toObject();
                break;
            case "toString":
                result = struct.map((value) => String(value)).toObject();
                break;
            case "increment":
                result = struct
                    .map((value) => (typeof value === "number" ? value + 1 : value))
                    .toObject();
                break;
            case "uppercase":
                result = struct
                    .map((value) => typeof value === "string" ? value.toUpperCase() : value)
                    .toObject();
                break;
            case "lowercase":
                result = struct
                    .map((value) => typeof value === "string" ? value.toLowerCase() : value)
                    .toObject();
                break;
            default:
                return res.status(400).json({
                    error: `Unknown map operation: ${operation}`,
                });
        }
        return res.status(200).json({
            data: {
                original: fields,
                operation,
                result,
            },
        });
    }
    catch (error) {
        logger.error({ error }, "Error in mapStruct controller");
        return res.status(500).json({
            error: "Failed to map struct",
        });
    }
}
/**
 * Filter a struct
 */
export function filterStruct(req, res) {
    try {
        const { fields, operation, parameter } = req.body;
        if (!fields || typeof fields !== "object") {
            return res.status(400).json({
                error: "Struct fields object is required",
            });
        }
        if (!operation) {
            return res.status(400).json({
                error: "Filter operation is required",
            });
        }
        const struct = Struct.from(fields);
        let result;
        switch (operation) {
            case "greaterThan":
                if (parameter === undefined) {
                    return res.status(400).json({
                        error: "Parameter is required for 'greaterThan' operation",
                    });
                }
                result = struct
                    .filter((value) => typeof value === "number" && value > parameter)
                    .toObject();
                break;
            case "lessThan":
                if (parameter === undefined) {
                    return res.status(400).json({
                        error: "Parameter is required for 'lessThan' operation",
                    });
                }
                result = struct
                    .filter((value) => typeof value === "number" && value < parameter)
                    .toObject();
                break;
            case "equals":
                if (parameter === undefined) {
                    return res.status(400).json({
                        error: "Parameter is required for 'equals' operation",
                    });
                }
                result = struct.filter((value) => value === parameter).toObject();
                break;
            case "contains":
                if (typeof parameter !== "string") {
                    return res.status(400).json({
                        error: "String parameter is required for 'contains' operation",
                    });
                }
                result = struct
                    .filter((value) => typeof value === "string" && value.includes(parameter))
                    .toObject();
                break;
            case "startsWith":
                if (typeof parameter !== "string") {
                    return res.status(400).json({
                        error: "String parameter is required for 'startsWith' operation",
                    });
                }
                result = struct
                    .filter((value) => typeof value === "string" && value.startsWith(parameter))
                    .toObject();
                break;
            case "endsWith":
                if (typeof parameter !== "string") {
                    return res.status(400).json({
                        error: "String parameter is required for 'endsWith' operation",
                    });
                }
                result = struct
                    .filter((value) => typeof value === "string" && value.endsWith(parameter))
                    .toObject();
                break;
            default:
                return res.status(400).json({
                    error: `Unknown filter operation: ${operation}`,
                });
        }
        return res.status(200).json({
            data: {
                original: fields,
                operation,
                parameter,
                result,
            },
        });
    }
    catch (error) {
        logger.error({ error }, "Error in filterStruct controller");
        return res.status(500).json({
            error: "Failed to filter struct",
        });
    }
}
/**
 * Perform a struct operation
 */
export function structOperations(req, res) {
    try {
        const { fields, operation, key, value, mapOperation, filterOperation, parameter, } = req.body;
        if (!fields || typeof fields !== "object" || !operation) {
            return res.status(400).json({
                error: "Struct fields and operation are required",
            });
        }
        switch (operation) {
            case "get":
                if (!key) {
                    return res.status(400).json({
                        error: "Key is required for 'get' operation",
                    });
                }
                return getStructValue({ ...req, body: { fields, key } }, res);
            case "set":
                if (!key || value === undefined) {
                    return res.status(400).json({
                        error: "Key and value are required for 'set' operation",
                    });
                }
                return setStructValue({ ...req, body: { fields, key, value } }, res);
            case "keys":
                return getStructKeys({ ...req, body: { fields } }, res);
            case "entries":
                return getStructEntries({ ...req, body: { fields } }, res);
            case "map":
                if (!mapOperation) {
                    return res.status(400).json({
                        error: "Map operation is required for 'map' operation",
                    });
                }
                return mapStruct({ ...req, body: { fields, operation: mapOperation } }, res);
            case "filter":
                if (!filterOperation) {
                    return res.status(400).json({
                        error: "Filter operation is required for 'filter' operation",
                    });
                }
                return filterStruct({
                    ...req,
                    body: { fields, operation: filterOperation, parameter },
                }, res);
            default:
                return res.status(400).json({
                    error: `Unknown operation: ${operation}`,
                });
        }
    }
    catch (error) {
        logger.error({ error }, "Error in structOperations controller");
        return res.status(500).json({
            error: "Failed to perform struct operation",
        });
    }
}
/**
 * Parse and analyze a struct from a string input
 */
export function analyzeStruct(req, res) {
    try {
        const { value } = req.body;
        if (!value) {
            return res.status(400).json({
                error: "Struct value string is required",
            });
        }
        let parsed = {};
        try {
            parsed = JSON.parse(value);
            if (typeof parsed !== "object" ||
                parsed === null ||
                Array.isArray(parsed)) {
                throw new Error("Value must be a valid object");
            }
        }
        catch (error) {
            return res.status(400).json({
                error: `Failed to parse struct: ${error instanceof Error ? error.message : String(error)}`,
            });
        }
        const struct = Struct.from(parsed);
        const keys = struct.keys().toArray();
        return res.status(200).json({
            data: {
                original: value,
                parsed,
                keys,
                isEmpty: keys.length === 0,
            },
        });
    }
    catch (error) {
        logger.error({ error }, "Error in analyzeStruct controller");
        return res.status(500).json({
            error: `Failed to analyze struct: ${error instanceof Error ? error.message : String(error)}`,
        });
    }
}
//# sourceMappingURL=struct.js.map
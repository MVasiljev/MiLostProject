import { HashMap } from "milost";
import logger from "../utils/logger.js";
/**
 * Create a new hash map and analyze it
 */
export function createHashMap(req, res) {
    try {
        const { entries } = req.body;
        if (!entries || !Array.isArray(entries)) {
            return res.status(400).json({
                error: "HashMap entries array is required",
            });
        }
        const hashMap = HashMap.from(entries);
        const keys = hashMap.keys().toArray();
        return res.status(200).json({
            data: {
                original: entries,
                keys,
                size: hashMap.size(),
                isEmpty: hashMap.isEmpty(),
            },
        });
    }
    catch (error) {
        logger.error({ error }, "Error in createHashMap controller");
        return res.status(500).json({
            error: "Failed to create hash map",
        });
    }
}
/**
 * Get a value from a hash map by key
 */
export function getHashMapValue(req, res) {
    try {
        const { entries, key } = req.body;
        if (!entries || !Array.isArray(entries)) {
            return res.status(400).json({
                error: "HashMap entries array is required",
            });
        }
        if (key === undefined || key === null) {
            return res.status(400).json({
                error: "Key is required",
            });
        }
        const hashMap = HashMap.from(entries);
        const value = hashMap.get(key);
        const exists = hashMap.contains(key);
        return res.status(200).json({
            data: {
                original: entries,
                key,
                value,
                exists,
            },
        });
    }
    catch (error) {
        logger.error({ error }, "Error in getHashMapValue controller");
        return res.status(500).json({
            error: "Failed to get hash map value",
        });
    }
}
/**
 * Check if a hash map contains a key
 */
export function containsHashMapKey(req, res) {
    try {
        const { entries, key } = req.body;
        if (!entries || !Array.isArray(entries)) {
            return res.status(400).json({
                error: "HashMap entries array is required",
            });
        }
        if (key === undefined || key === null) {
            return res.status(400).json({
                error: "Key is required",
            });
        }
        const hashMap = HashMap.from(entries);
        const exists = hashMap.contains(key);
        return res.status(200).json({
            data: {
                original: entries,
                key,
                exists,
            },
        });
    }
    catch (error) {
        logger.error({ error }, "Error in containsHashMapKey controller");
        return res.status(500).json({
            error: "Failed to check hash map key",
        });
    }
}
/**
 * Set a value in a hash map
 */
export function setHashMapValue(req, res) {
    try {
        const { entries, key, value } = req.body;
        if (!entries || !Array.isArray(entries)) {
            return res.status(400).json({
                error: "HashMap entries array is required",
            });
        }
        if (key === undefined || key === null) {
            return res.status(400).json({
                error: "Key is required",
            });
        }
        if (value === undefined) {
            return res.status(400).json({
                error: "Value is required",
            });
        }
        const hashMap = HashMap.from(entries);
        const newMap = hashMap.insert(key, value);
        const result = newMap.toArray();
        return res.status(200).json({
            data: {
                original: entries,
                key,
                value,
                result,
            },
        });
    }
    catch (error) {
        logger.error({ error }, "Error in setHashMapValue controller");
        return res.status(500).json({
            error: "Failed to set hash map value",
        });
    }
}
/**
 * Remove a key-value pair from a hash map
 */
export function removeHashMapEntry(req, res) {
    try {
        const { entries, key } = req.body;
        if (!entries || !Array.isArray(entries)) {
            return res.status(400).json({
                error: "HashMap entries array is required",
            });
        }
        if (key === undefined || key === null) {
            return res.status(400).json({
                error: "Key is required",
            });
        }
        const hashMap = HashMap.from(entries);
        const newMap = hashMap.remove(key);
        const result = newMap.toArray();
        return res.status(200).json({
            data: {
                original: entries,
                key,
                result,
            },
        });
    }
    catch (error) {
        logger.error({ error }, "Error in removeHashMapEntry controller");
        return res.status(500).json({
            error: "Failed to remove hash map entry",
        });
    }
}
/**
 * Get keys of a hash map
 */
export function getHashMapKeys(req, res) {
    try {
        const { entries } = req.body;
        if (!entries || !Array.isArray(entries)) {
            return res.status(400).json({
                error: "HashMap entries array is required",
            });
        }
        const hashMap = HashMap.from(entries);
        const keys = hashMap.keys().toArray();
        return res.status(200).json({
            data: {
                original: entries,
                keys,
            },
        });
    }
    catch (error) {
        logger.error({ error }, "Error in getHashMapKeys controller");
        return res.status(500).json({
            error: "Failed to get hash map keys",
        });
    }
}
/**
 * Get values of a hash map
 */
export function getHashMapValues(req, res) {
    try {
        const { entries } = req.body;
        if (!entries || !Array.isArray(entries)) {
            return res.status(400).json({
                error: "HashMap entries array is required",
            });
        }
        const hashMap = HashMap.from(entries);
        const values = hashMap.values().toArray();
        return res.status(200).json({
            data: {
                original: entries,
                values,
            },
        });
    }
    catch (error) {
        logger.error({ error }, "Error in getHashMapValues controller");
        return res.status(500).json({
            error: "Failed to get hash map values",
        });
    }
}
/**
 * Get entries of a hash map
 */
export function getHashMapEntries(req, res) {
    try {
        const { entries } = req.body;
        if (!entries || !Array.isArray(entries)) {
            return res.status(400).json({
                error: "HashMap entries array is required",
            });
        }
        const hashMap = HashMap.from(entries);
        const mapEntries = hashMap.entries().toArray();
        return res.status(200).json({
            data: {
                original: entries,
                entries: mapEntries,
            },
        });
    }
    catch (error) {
        logger.error({ error }, "Error in getHashMapEntries controller");
        return res.status(500).json({
            error: "Failed to get hash map entries",
        });
    }
}
/**
 * Map a hash map
 */
export function mapHashMap(req, res) {
    try {
        const { entries, operation } = req.body;
        if (!entries || !Array.isArray(entries)) {
            return res.status(400).json({
                error: "HashMap entries array is required",
            });
        }
        if (!operation) {
            return res.status(400).json({
                error: "Map operation is required",
            });
        }
        const hashMap = HashMap.from(entries);
        let result;
        switch (operation) {
            case "double":
                result = hashMap
                    .map((value, _) => (typeof value === "number" ? value * 2 : value))
                    .toArray();
                break;
            case "square":
                result = hashMap
                    .map((value, _) => typeof value === "number" ? value * value : value)
                    .toArray();
                break;
            case "toString":
                result = hashMap.map((value, _) => String(value)).toArray();
                break;
            case "increment":
                result = hashMap
                    .map((value, _) => (typeof value === "number" ? value + 1 : value))
                    .toArray();
                break;
            case "uppercase":
                result = hashMap
                    .map((value, _) => typeof value === "string" ? value.toUpperCase() : value)
                    .toArray();
                break;
            case "lowercase":
                result = hashMap
                    .map((value, _) => typeof value === "string" ? value.toLowerCase() : value)
                    .toArray();
                break;
            default:
                return res.status(400).json({
                    error: `Unknown map operation: ${operation}`,
                });
        }
        return res.status(200).json({
            data: {
                original: entries,
                operation,
                result,
            },
        });
    }
    catch (error) {
        logger.error({ error }, "Error in mapHashMap controller");
        return res.status(500).json({
            error: "Failed to map hash map",
        });
    }
}
/**
 * Filter a hash map
 */
export function filterHashMap(req, res) {
    try {
        const { entries, operation, parameter } = req.body;
        if (!entries || !Array.isArray(entries)) {
            return res.status(400).json({
                error: "HashMap entries array is required",
            });
        }
        if (!operation) {
            return res.status(400).json({
                error: "Filter operation is required",
            });
        }
        const hashMap = HashMap.from(entries);
        let result;
        switch (operation) {
            case "greaterThan":
                if (parameter === undefined) {
                    return res.status(400).json({
                        error: "Parameter is required for 'greaterThan' operation",
                    });
                }
                result = hashMap
                    .filter((value, _) => typeof value === "number" && value > parameter)
                    .toArray();
                break;
            case "lessThan":
                if (parameter === undefined) {
                    return res.status(400).json({
                        error: "Parameter is required for 'lessThan' operation",
                    });
                }
                result = hashMap
                    .filter((value, _) => typeof value === "number" && value < parameter)
                    .toArray();
                break;
            case "equals":
                if (parameter === undefined) {
                    return res.status(400).json({
                        error: "Parameter is required for 'equals' operation",
                    });
                }
                result = hashMap.filter((value, _) => value === parameter).toArray();
                break;
            case "contains":
                if (typeof parameter !== "string") {
                    return res.status(400).json({
                        error: "String parameter is required for 'contains' operation",
                    });
                }
                result = hashMap
                    .filter((value, _) => typeof value === "string" && value.includes(parameter))
                    .toArray();
                break;
            case "startsWith":
                if (typeof parameter !== "string") {
                    return res.status(400).json({
                        error: "String parameter is required for 'startsWith' operation",
                    });
                }
                result = hashMap
                    .filter((value, _) => typeof value === "string" && value.startsWith(parameter))
                    .toArray();
                break;
            case "endsWith":
                if (typeof parameter !== "string") {
                    return res.status(400).json({
                        error: "String parameter is required for 'endsWith' operation",
                    });
                }
                result = hashMap
                    .filter((value, _) => typeof value === "string" && value.endsWith(parameter))
                    .toArray();
                break;
            default:
                return res.status(400).json({
                    error: `Unknown filter operation: ${operation}`,
                });
        }
        return res.status(200).json({
            data: {
                original: entries,
                operation,
                parameter,
                result,
            },
        });
    }
    catch (error) {
        logger.error({ error }, "Error in filterHashMap controller");
        return res.status(500).json({
            error: "Failed to filter hash map",
        });
    }
}
/**
 * Perform a hash map operation
 */
export function hashMapOperations(req, res) {
    try {
        const { entries, operation, key, value, mapOperation, filterOperation, parameter, } = req.body;
        if (!entries || !Array.isArray(entries) || !operation) {
            return res.status(400).json({
                error: "HashMap entries and operation are required",
            });
        }
        switch (operation) {
            case "get":
                if (key === undefined || key === null) {
                    return res.status(400).json({
                        error: "Key is required for 'get' operation",
                    });
                }
                return getHashMapValue({ ...req, body: { entries, key } }, res);
            case "contains":
                if (key === undefined || key === null) {
                    return res.status(400).json({
                        error: "Key is required for 'contains' operation",
                    });
                }
                return containsHashMapKey({ ...req, body: { entries, key } }, res);
            case "set":
                if (key === undefined || key === null || value === undefined) {
                    return res.status(400).json({
                        error: "Key and value are required for 'set' operation",
                    });
                }
                return setHashMapValue({ ...req, body: { entries, key, value } }, res);
            case "remove":
                if (key === undefined || key === null) {
                    return res.status(400).json({
                        error: "Key is required for 'remove' operation",
                    });
                }
                return removeHashMapEntry({ ...req, body: { entries, key } }, res);
            case "keys":
                return getHashMapKeys({ ...req, body: { entries } }, res);
            case "values":
                return getHashMapValues({ ...req, body: { entries } }, res);
            case "entries":
                return getHashMapEntries({ ...req, body: { entries } }, res);
            case "map":
                if (!mapOperation) {
                    return res.status(400).json({
                        error: "Map operation is required for 'map' operation",
                    });
                }
                return mapHashMap({ ...req, body: { entries, operation: mapOperation } }, res);
            case "filter":
                if (!filterOperation) {
                    return res.status(400).json({
                        error: "Filter operation is required for 'filter' operation",
                    });
                }
                return filterHashMap({
                    ...req,
                    body: { entries, operation: filterOperation, parameter },
                }, res);
            default:
                return res.status(400).json({
                    error: `Unknown operation: ${operation}`,
                });
        }
    }
    catch (error) {
        logger.error({ error }, "Error in hashMapOperations controller");
        return res.status(500).json({
            error: "Failed to perform hash map operation",
        });
    }
}
/**
 * Parse and analyze a hash map from a string input
 */
export function analyzeHashMap(req, res) {
    try {
        const { value } = req.body;
        if (!value) {
            return res.status(400).json({
                error: "HashMap value string is required",
            });
        }
        let parsed = [];
        try {
            let rawData;
            try {
                rawData = JSON.parse(value);
                if (typeof rawData === "object" &&
                    rawData !== null &&
                    !Array.isArray(rawData)) {
                    parsed = Object.entries(rawData);
                }
                else if (Array.isArray(rawData) &&
                    rawData.every((item) => Array.isArray(item) && item.length === 2)) {
                    parsed = rawData;
                }
                else {
                    throw new Error("Value must be a valid object or array of key-value pairs");
                }
            }
            catch (parseError) {
                const entries = value.split(",").map((pair) => pair.trim());
                for (const entry of entries) {
                    const [key, val] = entry.split(":").map((part) => part.trim());
                    if (!key)
                        continue;
                    let parsedValue = val;
                    if (val.toLowerCase() === "true")
                        parsedValue = true;
                    else if (val.toLowerCase() === "false")
                        parsedValue = false;
                    else if (val.toLowerCase() === "null")
                        parsedValue = null;
                    else if (!isNaN(Number(val)))
                        parsedValue = Number(val);
                    parsed.push([key, parsedValue]);
                }
                if (parsed.length === 0) {
                    throw new Error("Could not parse input as HashMap entries");
                }
            }
        }
        catch (error) {
            return res.status(400).json({
                error: `Failed to parse hash map: ${error instanceof Error ? error.message : String(error)}`,
            });
        }
        const hashMap = HashMap.from(parsed);
        const keys = hashMap.keys().toArray();
        return res.status(200).json({
            data: {
                original: value,
                parsed,
                keys,
                size: hashMap.size(),
                isEmpty: hashMap.isEmpty(),
            },
        });
    }
    catch (error) {
        logger.error({ error }, "Error in analyzeHashMap controller");
        return res.status(500).json({
            error: `Failed to analyze hash map: ${error instanceof Error ? error.message : String(error)}`,
        });
    }
}
//# sourceMappingURL=hash_map.js.map
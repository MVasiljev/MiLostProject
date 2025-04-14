import { u32, Vec } from "milost";
import logger from "../utils/logger.js";
import { VectorOperation, } from "../types/vector.js";
/**
 * Create a new vector
 */
export function createVector(req, res) {
    try {
        const { values } = req.body;
        if (!values || !Array.isArray(values)) {
            return res.status(400).json({
                error: "Vector values array is required",
            });
        }
        const vec = Vec.from(values);
        return res.status(200).json({
            data: {
                original: values,
                length: vec.len(),
                isEmpty: vec.isEmpty(),
            },
        });
    }
    catch (error) {
        logger.error({ error }, "Error in createVector controller");
        return res.status(500).json({
            error: "Failed to create vector",
        });
    }
}
/**
 * Perform operations on a vector
 */
export function vectorOperations(req, res) {
    try {
        const { values, operation } = req.body;
        if (!values || !Array.isArray(values) || !operation) {
            return res.status(400).json({
                error: "Vector values and operation are required",
            });
        }
        const vec = Vec.from(values);
        let result;
        switch (operation) {
            case VectorOperation.REVERSE:
                result = vec.reverse().toArray();
                break;
            default:
                return res.status(400).json({
                    error: `Unknown operation: ${operation}`,
                });
        }
        return res.status(200).json({
            data: {
                original: values,
                operation,
                result,
            },
        });
    }
    catch (error) {
        logger.error({ error }, "Error in vectorOperations controller");
        return res.status(500).json({
            error: "Failed to perform vector operation",
        });
    }
}
/**
 * Map over a vector
 */
export function mapVector(req, res) {
    try {
        const { values, operation } = req.body;
        if (!values || !Array.isArray(values) || !operation) {
            return res.status(400).json({
                error: "Vector values and operation are required",
            });
        }
        const vec = Vec.from(values);
        let result;
        switch (operation) {
            case "double":
                result = vec.map((num, _) => Number(num) * 2).toArray();
                break;
            case "square":
                result = vec.map((num, _) => Number(num) * Number(num)).toArray();
                break;
            case "add1":
                result = vec.map((num, _) => Number(num) + 1).toArray();
                break;
            case "negate":
                result = vec.map((num, _) => -Number(num)).toArray();
                break;
            case "toString":
                result = vec.map((item, _) => String(item)).toArray();
                break;
            default:
                return res.status(400).json({
                    error: `Unknown map operation: ${operation}`,
                });
        }
        return res.status(200).json({
            data: {
                original: values,
                operation,
                result,
            },
        });
    }
    catch (error) {
        logger.error({ error }, "Error in mapVector controller");
        return res.status(500).json({
            error: "Failed to map vector",
        });
    }
}
/**
 * Filter a vector
 */
export function filterVector(req, res) {
    try {
        const { values, operation, parameter } = req.body;
        if (!values || !Array.isArray(values) || !operation) {
            return res.status(400).json({
                error: "Vector values and operation are required",
            });
        }
        const vec = Vec.from(values);
        let result;
        const numParam = parameter ? Number(parameter) : 0;
        switch (operation) {
            case "greaterThan":
                result = vec.filter((num, _) => Number(num) > numParam).toArray();
                break;
            case "lessThan":
                result = vec.filter((num, _) => Number(num) < numParam).toArray();
                break;
            case "equals":
                result = vec.filter((num, _) => Number(num) === numParam).toArray();
                break;
            case "even":
                result = vec.filter((num, _) => Number(num) % 2 === 0).toArray();
                break;
            case "odd":
                result = vec.filter((num, _) => Number(num) % 2 !== 0).toArray();
                break;
            default:
                return res.status(400).json({
                    error: `Unknown filter operation: ${operation}`,
                });
        }
        return res.status(200).json({
            data: {
                original: values,
                operation,
                parameter: numParam,
                result,
            },
        });
    }
    catch (error) {
        logger.error({ error }, "Error in filterVector controller");
        return res.status(500).json({
            error: "Failed to filter vector",
        });
    }
}
/**
 * Reduce a vector
 */
export function reduceVector(req, res) {
    try {
        const { values, operation, initialValue } = req.body;
        if (!values || !Array.isArray(values) || !operation) {
            return res.status(400).json({
                error: "Vector values and operation are required",
            });
        }
        const vec = Vec.from(values);
        let result;
        const initial = initialValue !== undefined ? Number(initialValue) : 0;
        switch (operation) {
            case "sum":
                result = vec.fold(initial, (acc, num) => acc + Number(num));
                break;
            case "product":
                result = vec.fold(initial !== 0 ? initial : 1, (acc, num) => acc * Number(num));
                break;
            case "min":
                result = vec.fold(values.length > 0 ? Number(values[0]) : 0, (acc, num) => Math.min(acc, Number(num)));
                break;
            case "max":
                result = vec.fold(values.length > 0 ? Number(values[0]) : 0, (acc, num) => Math.max(acc, Number(num)));
                break;
            case "average":
                const sum = vec.fold(0, (acc, num) => acc + Number(num));
                result = values.length > 0 ? sum / values.length : 0;
                break;
            default:
                return res.status(400).json({
                    error: `Unknown reduce operation: ${operation}`,
                });
        }
        return res.status(200).json({
            data: {
                original: values,
                operation,
                initialValue: initial,
                result,
            },
        });
    }
    catch (error) {
        logger.error({ error }, "Error in reduceVector controller");
        return res.status(500).json({
            error: "Failed to reduce vector",
        });
    }
}
/**
 * Take or drop elements from a vector
 */
export function takeDropVector(req, res) {
    try {
        const { values, operation, count } = req.body;
        if (!values ||
            !Array.isArray(values) ||
            !operation ||
            count === undefined) {
            return res.status(400).json({
                error: "Vector values, operation, and count are required",
            });
        }
        const vec = Vec.from(values);
        let result;
        const numCount = u32(count);
        switch (operation) {
            case "take":
                result = vec.take(numCount).toArray();
                break;
            case "drop":
                result = vec.drop(numCount).toArray();
                break;
            default:
                return res.status(400).json({
                    error: `Unknown take/drop operation: ${operation}`,
                });
        }
        return res.status(200).json({
            data: {
                original: values,
                operation,
                count: numCount,
                result,
            },
        });
    }
    catch (error) {
        logger.error({ error }, "Error in takeDropVector controller");
        return res.status(500).json({
            error: "Failed to take/drop elements from vector",
        });
    }
}
/**
 * Check if all or any elements satisfy a predicate
 */
export function checkVector(req, res) {
    try {
        const { values, operation, parameter } = req.body;
        if (!values || !Array.isArray(values) || !operation) {
            return res.status(400).json({
                error: "Vector values and operation are required",
            });
        }
        const vec = Vec.from(values);
        let result;
        const numParam = parameter ? Number(parameter) : 0;
        switch (operation) {
            case "all":
                result = vec.all((num) => Number(num) > numParam);
                break;
            case "any":
                result = vec.any((num) => Number(num) > numParam);
                break;
            default:
                return res.status(400).json({
                    error: `Unknown check operation: ${operation}`,
                });
        }
        const response = {
            data: {
                original: values,
                operation,
                parameter: numParam,
                result,
            },
        };
        return res.status(200).json(response);
    }
    catch (error) {
        logger.error({ error }, "Error in checkVector controller");
        return res.status(500).json({
            error: "Failed to check vector elements",
        });
    }
}
//# sourceMappingURL=vector.js.map
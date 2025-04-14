import logger from "../utils/logger.js";
/**
 * Error handling middleware
 */
export const errorHandler = (err, req, res, next) => {
    logger.error({
        err,
        method: req.method,
        url: req.url,
    }, "Error processing request");
    res.status(err.status || 500).json({
        error: {
            message: err.message || "Internal Server Error",
            status: err.status || 500,
        },
    });
};
//# sourceMappingURL=error.js.map
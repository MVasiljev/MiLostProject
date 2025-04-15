import pinoModule from "pino";

// Extend the Pino Logger type to include our custom method
interface ExtendedLogger extends pinoModule.Logger {
  errorWithDetails: (error: Error | any, context?: any) => void;
}

const pinoLogger = pinoModule as unknown as (
  options?: pinoModule.LoggerOptions
) => ExtendedLogger;

const logger = pinoLogger({
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      levelFirst: true,
      translateTime: "SYS:standard",
      singleLine: false,
      errorProps: "error,name,message,stack",
    },
  },
  level: process.env.LOG_LEVEL || "debug",
  formatters: {
    level: (label) => {
      return { level: label.toUpperCase() };
    },
  },
  timestamp: pinoModule.stdTimeFunctions.isoTime,
}) as ExtendedLogger;

// Add the custom method with type-safe implementation
logger.errorWithDetails = (error: Error | any, context?: any) => {
  logger.error({
    ...(context || {}),
    error: {
      name: error.name,
      message: error.message,
      stack: error.stack,
    },
  });
};

export default logger;

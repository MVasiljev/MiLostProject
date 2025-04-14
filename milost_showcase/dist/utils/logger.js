import pinoModule from "pino";
const pinoLogger = pinoModule;
const logger = pinoLogger({
    transport: {
        target: "pino-pretty",
        options: {
            colorize: true,
            levelFirst: true,
            translateTime: "SYS:standard",
        },
    },
    level: process.env.LOG_LEVEL || "info",
});
export default logger;
//# sourceMappingURL=logger.js.map
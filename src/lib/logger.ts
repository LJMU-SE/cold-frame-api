import winston from "winston";

/**
 * Define levels and colours
 */
const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
};

const colors = {
    error: "red",
    warn: "yellow",
    info: "green",
    http: "magenta",
    debug: "white",
};

/**
 * Get the log level based on the environment
 *
 * @returns {string} The log level
 */
const level = () => {
    const env = process.env.NODE_ENV || "development";
    const isDevelopment = env === "development";
    return isDevelopment ? "debug" : "warn";
};

// Add colours to the logger
winston.addColors(colors);

/**
 * Define the format of the logger
 */
const format = winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
    winston.format.colorize({ all: true }),
    winston.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
);

/**
 * Define the transports
 */
const transports = [
    new winston.transports.Console(),
    new winston.transports.File({
        filename: "logs/error.log",
        level: "error",
    }),
    new winston.transports.File({ filename: "logs/all.log" }),
];

/**
 * Create the logger
 */
const Logger = winston.createLogger({
    level: level(),
    levels,
    format,
    transports,
});

// Export the logger
export default Logger;

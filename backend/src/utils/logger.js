/**
 * Simple Logger Utility
 * Provides structured logging for the application
 */

/**
 * Log levels
 */
const LOG_LEVELS = {
    INFO: 'INFO',
    WARN: 'WARN',
    ERROR: 'ERROR'
};

/**
 * Format log message
 * @param {string} level - Log level
 * @param {string} message - Log message
 * @param {Object} data - Additional data
 * @returns {string} Formatted log string
 */
function formatLog(level, message, data) {
    const timestamp = new Date().toISOString();
    const baseLog = `[${level}] ${timestamp} - ${message}`;

    if (data && Object.keys(data).length > 0) {
        return `${baseLog} ${JSON.stringify(data)}`;
    }

    return baseLog;
}

export default {
    /**
     * Log info message
     * @param {string} message - Message to log
     * @param {Object} data - Additional data
     */
    info: (message, data = {}) => {
        console.log(formatLog(LOG_LEVELS.INFO, message, data));
    },

    /**
     * Log warning message
     * @param {string} message - Message to log
     * @param {Object} data - Additional data
     */
    warn: (message, data = {}) => {
        console.warn(formatLog(LOG_LEVELS.WARN, message, data));
    },

    /**
     * Log error message
     * @param {string} message - Message to log
     * @param {Object} data - Additional data or Error object
     */
    error: (message, data = {}) => {
        if (data instanceof Error) {
            console.error(formatLog(LOG_LEVELS.ERROR, message, {
                error: data.message,
                stack: data.stack
            }));
        } else {
            console.error(formatLog(LOG_LEVELS.ERROR, message, data));
        }
    }
};

/**
 * Global Error Handler Middleware
 * Catches and formats all errors
 */
import logger from '../utils/logger.js';

/**
 * Global error handler
 * @param {Error} err - Error object
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Next middleware
 */
export default function errorHandler(err, req, res, next) {
    // Log error
    logger.error('Global error handler caught error:', {
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method
    });

    // Determine status code
    const statusCode = err.statusCode || err.status || 500;

    // Send error response
    res.status(statusCode).json({
        success: false,
        message: err.message || 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
}

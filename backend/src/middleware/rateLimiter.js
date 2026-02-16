/**
 * Rate Limiter Middleware
 * Limits requests per phone number to prevent spam
 */
import rateLimit from 'express-rate-limit';

/**
 * Rate limiter: 5 requests per minute per phone number
 */
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute window
    max: 5, // Maximum 5 requests per window

    // Use fromNumber as key for rate limiting
    keyGenerator: (req) => {
        return req.body.fromNumber || req.ip;
    },

    // Custom message
    message: {
        success: false,
        message: 'Too many requests from this phone number. Please try again in a minute.',
        retryAfter: '60 seconds'
    },

    // Standard headers
    standardHeaders: true,
    legacyHeaders: false,

    // Handler for when limit is exceeded
    handler: (req, res) => {
        res.status(429).json({
            success: false,
            message: 'Too many requests from this phone number. Please try again in a minute.',
            retryAfter: 60
        });
    }
});

export default limiter;

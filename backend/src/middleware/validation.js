/**
 * Validation Middleware
 * Validates numer request data
 */
import {
    isValidPhoneNumber,
    areNumbersDifferent,
    isValidContext
} from '../utils/validators.js';

/**
 * Validate numer request
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Next middleware
 */
export function validateNumerRequest(req, res, next) {
    const { fromNumber, toNumber, context } = req.body;
    const errors = [];

    // Check required fields
    if (!fromNumber) errors.push('fromNumber is required');
    if (!toNumber) errors.push('toNumber is required');
    if (!context) errors.push('context is required');

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors
        });
    }

    // Validate phone number format (E.164)
    if (!isValidPhoneNumber(fromNumber)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid fromNumber format. Use E.164 format: +1234567890'
        });
    }

    if (!isValidPhoneNumber(toNumber)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid toNumber format. Use E.164 format: +1234567890'
        });
    }

    // Prevent self-numer (from and to cannot be same)
    if (!areNumbersDifferent(fromNumber, toNumber)) {
        return res.status(400).json({
            success: false,
            message: 'Cannot send Numer to yourself. From and To numbers must be different.'
        });
    }

    // Validate context is not empty
    if (!isValidContext(context)) {
        return res.status(400).json({
            success: false,
            message: 'Context cannot be empty'
        });
    }

    // All validations passed
    next();
}

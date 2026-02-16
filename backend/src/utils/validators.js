/**
 * Validation Utilities
 * Helper functions for validating input data
 */

/**
 * Validate E.164 phone number format
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if valid E.164 format
 * 
 * E.164 format: +[country code][number]
 * Example: +14155552671
 * Regex explanation:
 * - ^\+? : Optional leading +
 * - [1-9] : First digit 1-9 (no leading 0)
 * - \d{1,14}$ : 1-14 more digits
 */
export function isValidPhoneNumber(phone) {
    if (!phone || typeof phone !== 'string') {
        return false;
    }

    const e164Regex = /^\+?[1-9]\d{1,14}$/;
    return e164Regex.test(phone.trim());
}

/**
 * Check if two phone numbers are different
 * @param {string} from - From phone number
 * @param {string} to - To phone number
 * @returns {boolean} True if numbers are different
 */
export function areNumbersDifferent(from, to) {
    if (!from || !to) {
        return false;
    }

    // Normalize and compare
    const normalizedFrom = from.trim();
    const normalizedTo = to.trim();

    return normalizedFrom !== normalizedTo;
}

/**
 * Validate context is not empty
 * @param {string} context - Context text
 * @returns {boolean} True if context is valid (not empty)
 */
export function isValidContext(context) {
    if (!context || typeof context !== 'string') {
        return false;
    }

    return context.trim().length > 0;
}

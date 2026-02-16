/**
 * Validation Utilities
 * Helper functions for validating input data using libphonenumber-js
 */
import { parsePhoneNumber, isValidPhoneNumber as isValidNumber } from 'libphonenumber-js';

/**
 * Validate international phone number using libphonenumber-js
 * @param {string} phone - Phone number to validate (should be in E.164 format with +)
 * @returns {boolean} True if valid phone number
 * 
 * Uses libphonenumber-js for accurate international validation
 * Supports all countries and their specific rules
 */
export function isValidPhoneNumber(phone) {
    if (!phone || typeof phone !== 'string') {
        return false;
    }

    const trimmed = phone.trim();

    // Must start with +
    if (!trimmed.startsWith('+')) {
        return false;
    }

    try {
        // Use libphonenumber-js for strict validation
        // This validates against actual phone number rules per country
        return isValidNumber(trimmed);
    } catch (error) {
        return false;
    }
}

/**
 * Check if two phone numbers are different
 * Normalizes both numbers to E.164 format before comparison
 * @param {string} from - From phone number
 * @param {string} to - To phone number
 * @returns {boolean} True if numbers are different
 */
export function areNumbersDifferent(from, to) {
    if (!from || !to) {
        return false;
    }

    try {
        // Parse and normalize both numbers to E.164 format
        const parsedFrom = parsePhoneNumber(from.trim());
        const parsedTo = parsePhoneNumber(to.trim());

        if (!parsedFrom || !parsedTo) {
            return false;
        }

        // Compare normalized E.164 numbers
        return parsedFrom.number !== parsedTo.number;
    } catch (error) {
        // If parsing fails, fall back to simple string comparison
        return from.trim() !== to.trim();
    }
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

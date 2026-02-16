import { parsePhoneNumber, isValidPhoneNumber as isValidNumber } from 'libphonenumber-js';

/**
 * Validate phone number in E.164 format using libphonenumber-js
 * @param phone - Phone number to validate
 * @returns Validation result with isValid flag and optional error
 */
export function validatePhoneNumber(phone: string): { isValid: boolean; error?: string } {
  if (!phone || phone.trim() === '') {
    return { isValid: false, error: 'Phone number is required' };
  }

  const trimmed = phone.trim();

  if (!trimmed.startsWith('+')) {
    return { isValid: false, error: 'Must include country code (e.g., +1)' };
  }

  try {
    // Use libphonenumber-js for strict validation
    if (!isValidNumber(trimmed)) {
      return { isValid: false, error: 'Invalid phone number format' };
    }

    return { isValid: true };
  } catch (error) {
    return { isValid: false, error: 'Invalid phone number format' };
  }
}

/**
 * Check if two phone numbers are different
 * Normalizes both numbers before comparison
 */
export function validateNumbersDifferent(from: string, to: string): { isValid: boolean; error?: string } {
  try {
    // Parse and normalize both numbers
    const parsedFrom = parsePhoneNumber(from.trim());
    const parsedTo = parsePhoneNumber(to.trim());

    if (!parsedFrom || !parsedTo) {
      return { isValid: false, error: 'Invalid phone number format' };
    }

    // Compare normalized E.164 numbers
    if (parsedFrom.number === parsedTo.number) {
      return { isValid: false, error: 'Cannot send Numer to yourself' };
    }

    return { isValid: true };
  } catch (error) {
    // Fallback to simple string comparison
    if (from.trim() === to.trim()) {
      return { isValid: false, error: 'Cannot send Numer to yourself' };
    }
    return { isValid: true };
  }
}

/**
 * Validate context field
 */
export function validateContext(context: string): { isValid: boolean; error?: string } {
  if (!context || context.trim() === '') {
    return { isValid: false, error: 'Context is required' };
  }
  return { isValid: true };
}

export interface FormData {
  fromNumber: string;
  toNumber: string;
  context: string;
  sharedContext: boolean;
}

export interface FormErrors {
  fromNumber?: string;
  toNumber?: string;
  context?: string;
}

/**
 * Validate entire form
 */
export function validateForm(formData: FormData): { isValid: boolean; errors: FormErrors } {
  const errors: FormErrors = {};

  const fromResult = validatePhoneNumber(formData.fromNumber);
  if (!fromResult.isValid) errors.fromNumber = fromResult.error;

  const toResult = validatePhoneNumber(formData.toNumber);
  if (!toResult.isValid) errors.toNumber = toResult.error;

  if (!errors.fromNumber && !errors.toNumber) {
    const diffResult = validateNumbersDifferent(formData.fromNumber, formData.toNumber);
    if (!diffResult.isValid) errors.toNumber = diffResult.error;
  }

  const contextResult = validateContext(formData.context);
  if (!contextResult.isValid) errors.context = contextResult.error;

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

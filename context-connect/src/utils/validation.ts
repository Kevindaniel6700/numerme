/**
 * Validate phone number in E.164 format
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

  const e164Regex = /^\+[1-9]\d{1,14}$/;
  if (!e164Regex.test(trimmed)) {
    return { isValid: false, error: 'Invalid phone number format' };
  }

  return { isValid: true };
}

/**
 * Check if two phone numbers are different
 */
export function validateNumbersDifferent(from: string, to: string): { isValid: boolean; error?: string } {
  if (from.trim() === to.trim()) {
    return { isValid: false, error: 'Cannot send Numer to yourself' };
  }
  return { isValid: true };
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

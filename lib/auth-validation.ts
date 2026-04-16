/**
 * Validates an email address
 * Uses a simple regex pattern that covers most common cases
 */
export function validateEmail(email: string): {
  valid: boolean;
  error?: string;
} {
  if (!email.trim()) {
    return { valid: false, error: "Email is required" };
  }

  // Simple email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, error: "Please enter a valid email address" };
  }

  return { valid: true };
}

/**
 * Validates a password
 * Requirements:
 * - At least 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number or special character
 */
export function validatePassword(password: string): {
  valid: boolean;
  error?: string;
} {
  if (!password) {
    return { valid: false, error: "Password is required" };
  }

  if (password.length < 8) {
    return {
      valid: false,
      error: "Password must be at least 8 characters long",
    };
  }

  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumberOrSpecial = /[0-9!@#$%^&*]/.test(password);

  if (!hasUpperCase) {
    return {
      valid: false,
      error: "Password must contain at least one uppercase letter",
    };
  }

  if (!hasLowerCase) {
    return {
      valid: false,
      error: "Password must contain at least one lowercase letter",
    };
  }

  if (!hasNumberOrSpecial) {
    return {
      valid: false,
      error: "Password must contain at least one number or special character",
    };
  }

  return { valid: true };
}

/**
 * Validates a verification code (numeric only)
 */
export function validateVerificationCode(code: string): {
  valid: boolean;
  error?: string;
} {
  if (!code.trim()) {
    return { valid: false, error: "Verification code is required" };
  }

  if (!/^\d+$/.test(code)) {
    return {
      valid: false,
      error: "Verification code must contain only numbers",
    };
  }

  if (code.length < 6) {
    return {
      valid: false,
      error: "Verification code must be at least 6 digits",
    };
  }

  return { valid: true };
}

/**
 * Format Clerk API error messages into user-friendly text
 */
export function formatClerkError(error: any): string {
  if (!error) return "An error occurred. Please try again.";

  // Handle Clerk-specific error structure
  if (error.errors && Array.isArray(error.errors) && error.errors.length > 0) {
    const firstError = error.errors[0];

    // Map common Clerk errors to user-friendly messages
    const errorCode = firstError.code || "";
    const errorMessage = firstError.message || "";

    switch (errorCode) {
      case "form_identifier_not_found":
        return "Email address not found. Please sign up first.";
      case "form_password_incorrect":
        return "Email or password is incorrect. Please try again.";
      case "form_param_format_invalid":
        return "Please check your input format and try again.";
      case "form_code_incorrect":
        return "The verification code is incorrect. Please try again.";
      case "form_identifier_already_exists":
        return "This email address is already registered. Please sign in instead.";
      case "user_already_exists":
        return "This email is already in use. Please sign in instead.";
      case "verification_failed":
        return "Verification failed. Please try again.";
      case "too_many_attempts":
        return "Too many attempts. Please try again later.";
      default:
        return errorMessage || "An error occurred. Please try again.";
    }
  }

  // Handle standard error objects
  if (error.message) {
    return error.message;
  }

  return "An error occurred. Please try again.";
}

/**
 * Extract field-specific errors from Clerk API response
 */
export function extractFieldErrors(error: any): Record<string, string> {
  const fieldErrors: Record<string, string> = {};

  if (!error?.errors) return fieldErrors;

  error.errors.forEach((err: any) => {
    if (err.meta?.paramName) {
      const fieldName = err.meta.paramName;
      fieldErrors[fieldName] = err.message || `${fieldName} is invalid`;
    }
  });

  return fieldErrors;
}

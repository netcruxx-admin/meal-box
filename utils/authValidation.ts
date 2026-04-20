export type AuthErrors = {
  fullName?: string;
  phone?: string;
  password?: string;
};

const INVALID_PHONE_PATTERNS = /^(\d)\1{9}$/; // all same digit e.g. 9999999999

export function validateFullName(value: string): string | undefined {
  if (!value.trim()) return 'Full name is required';
  if (value.trim().length < 3) return 'Full name must be at least 3 characters';
  if (value.trim().length > 50) return 'Full name must not exceed 50 characters';
  if (/[^a-zA-Z\s]/.test(value)) return 'Full name must not contain special characters or numbers';
  return undefined;
}

export function validatePhone(value: string): string | undefined {
  if (!value.trim()) return 'Phone number is required';
  if (!/^\d{10}$/.test(value)) return 'Phone number must be exactly 10 digits';
  if (INVALID_PHONE_PATTERNS.test(value)) return 'Enter a valid phone number';
  return undefined;
}

export function validatePassword(value: string): string | undefined {
  if (!value) return 'Password is required';
  if (value.length < 5) return 'Password must be at least 5 characters';
  if (value.length > 32) return 'Password must not exceed 32 characters';
  if (!/[A-Z]/.test(value)) return 'Password must contain at least one capital letter';
  if (!/[0-9]/.test(value)) return 'Password must contain at least one number';
  return undefined;
}

export function validateLoginForm(phone: string, password: string): AuthErrors {
  return {
    phone: validatePhone(phone),
    password: !password.trim() ? 'Password is required' : undefined,
  };
}
export function validateRegisterForm(fullName: string, phone: string, password: string): AuthErrors {
  return {
    fullName: validateFullName(fullName),
    phone: validatePhone(phone),
    password: validatePassword(password),
  };
}

export function hasErrors(errors: AuthErrors): boolean {
  return Object.values(errors).some(Boolean);
}

export type AuthErrors = {
  fullName?: string;
  phone?: string;
  password?: string;
};

const INVALID_PHONE_PATTERNS = /^(\d)\1{9}$/; // all same digit e.g. 9999999999

export function validateFullName(value: string): string | undefined {
  if (!value.trim()) return 'Full name is required';
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
  if (!/[A-Z]/.test(value)) return 'Password must contain at least one capital letter';
  if (!/[0-9]/.test(value)) return 'Password must contain at least one number';
  return undefined;
}

export function validateLoginForm(phone: string, password: string): AuthErrors {
  return {
    phone: validatePhone(phone),
    password: validatePassword(password),
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

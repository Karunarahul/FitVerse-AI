export function isValidEmail(email: string): boolean {
  if (!email) return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.trim());
}

export function isValidPassword(password: string): boolean {
  return typeof password === 'string' && password.length >= 6;
}

export function isNonEmptyString(val: any): boolean {
  return typeof val === 'string' && val.trim().length > 0;
}

export function isPositiveNumber(val: any): boolean {
  const n = Number(val);
  return !isNaN(n) && n > 0;
}

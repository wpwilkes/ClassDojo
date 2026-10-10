export type SignupFormData = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type SignupFormErrors = {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
};

const EMAIL_PATTERN =
  /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/;

const COMMON_EMAIL_TYPOS: Record<string, string> = {
  'gmail.co': 'gmail.com',
  'gamil.com': 'gmail.com',
  'gmial.com': 'gmail.com',
  'gmai.com': 'gmail.com',
  'yahoo.co': 'yahoo.com',
  'outlook.co': 'outlook.com',
  'hotmail.co': 'hotmail.com',
};

export function getEmailSuggestion(
  email: string
): string | null {
  const trimmedEmail = email.trim().toLowerCase();

  const atIndex = trimmedEmail.lastIndexOf('@');

  if (atIndex === -1) {
    return null;
  }

  const usernamePart = trimmedEmail.slice(0, atIndex);
  const domainPart = trimmedEmail.slice(atIndex + 1);

  const correctedDomain = COMMON_EMAIL_TYPOS[domainPart];

  if (!correctedDomain) {
    return null;
  }

  return `${usernamePart}@${correctedDomain}`;
}

export function validateSignupForm(
  data: SignupFormData
): SignupFormErrors {
  const errors: SignupFormErrors = {};

  const username = data.username.trim();
  const email = data.email.trim();
  const password = data.password;
  const confirmPassword = data.confirmPassword;

  // Username
  if (!username) {
    errors.username = 'Username is required.';
  } else if (username.length < 3) {
    errors.username =
      'Username must be at least 3 characters.';
  } else if (username.length > 30) {
    errors.username =
      'Username cannot be longer than 30 characters.';
  }

  // Email
  if (!email) {
    errors.email = 'Email is required.';
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email =
      'Please enter a valid email address.';
  }

  // Password
  if (!password) {
    errors.password = 'Password is required.';
  } else if (password.length < 8) {
    errors.password =
      'Password must be at least 8 characters.';
  } else if (/\s/.test(password)) {
    errors.password =
      'Password cannot contain spaces.';
  } else if (!/[A-Z]/.test(password)) {
    errors.password =
      'Password must contain an uppercase letter.';
  } else if (!/[a-z]/.test(password)) {
    errors.password =
      'Password must contain a lowercase letter.';
  } else if (!/[0-9]/.test(password)) {
    errors.password =
      'Password must contain a number.';
  } else if (!/[!@#$%^&*]/.test(password)) {
    errors.password =
      'Password must contain a special character: ! @ # $ % ^ & *';
  }

  // Confirm password
  if (!confirmPassword) {
    errors.confirmPassword =
      'Please confirm your password.';
  } else if (password !== confirmPassword) {
    errors.confirmPassword =
      'Passwords do not match.';
  }

  return errors;
}

export function hasSignupErrors(
  errors: SignupFormErrors
): boolean {
  return Object.keys(errors).length > 0;
}

export type LoginFormData = {
  email: string;
  password: string;
};

export type LoginFormErrors = {
  email?: string;
  password?: string;
};

export function validateLoginForm(
  data: LoginFormData
): LoginFormErrors {
  const errors: LoginFormErrors = {};

  const email = data.email.trim();
  const password = data.password;

  if (!email) {
    errors.email = 'Email is required.';
  } else {
    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/;

    if (!emailPattern.test(email)) {
      errors.email =
        'Please enter a valid email address.';
    }
  }

  if (!password) {
    errors.password = 'Password is required.';
  }

  return errors;
}

export function hasLoginErrors(
  errors: LoginFormErrors
): boolean {
  return Object.keys(errors).length > 0;
}
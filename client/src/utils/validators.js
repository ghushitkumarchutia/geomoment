const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const nameRules = {
  required: 'Name is required',
  minLength: { value: 2, message: 'Name must be at least 2 characters' },
  maxLength: { value: 50, message: 'Name cannot exceed 50 characters' },
};

export const emailRules = {
  required: 'Email is required',
  pattern: { value: EMAIL_REGEX, message: 'Please enter a valid email address' },
};

export const passwordRules = {
  required: 'Password is required',
  minLength: { value: 8, message: 'Password must be at least 8 characters' },
};

export const noteRules = {
  maxLength: { value: 80, message: 'Note cannot exceed 80 characters' },
};

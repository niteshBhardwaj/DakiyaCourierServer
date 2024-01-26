export enum ERROR_CODE {
  UNAUTHENTICATED = 'UNAUTHENTICATED',
}

export const AUTH_ERROR_KEYS = {
  WRONG_TOKEN: 'Incorrect authentication token',
  MISSING_TOKEN: 'Authentication token is missing',
  INVALID_PERMISSION: 'You do not have permission to access',
};

export const CONFIG_ERRORS = {
  ENV_VALIDATION: 'Validation failed for .env file',
  ENV_NOT_FOUND: 'Environment file not found',
  DEPENDENCY_FAILED: '🔥 Error on dependency injector loader: %o',
};

export const USER_ERROR_KEYS = {
  NOT_CREATED: 'User creation failed',
  NOT_FOUND: 'Invalid Request. User not found',
  DATABASE_FAILED_USER: 'Something went wrong. Please refresh your app',
  NOT_ACTIVATED: 'User ID is not activated',
  INVALID_REQUEST: 'Invalid request. Please try again with correct inputs',
  INVALID_PASSWORD: 'Incorrect username or password combination',
  PHOTO_UPLOAD_ERROR: 'Error uploading photo',
  INVALID_OTP: 'Enter a valid OTP',
  INVALID_KYC_REQUEST: 'Invalid kyc request.',
  OFFLINE_KYC_ONLY: 'Maximum attempts exceed. Please choose offline kyc.',
  INVALID_CREDENTIAL: 'Invalid credentials. Please try again',
  ACCOUNT_EXISTS: "Account already exists",
  EMAIL_EXISTS_ERROR: "Email already in use. Please try a different email",
};

export const REQUIRED_FIELDS = {
  USER_PHONE: 'User phone number is required',
  INVALID_PHONE: '{VALUE} is not a valid phone number',
  INVALID_EMAIL: '{Value} is not a valid email',
};
export const AUTH_ERROR_KEYS = {
  WRONG_TOKEN: 'Wrong authentication token',
  MISSING_TOKEN: 'Authentication token missing',
  INVALID_PERMISSION: 'You don\'t have persmission to access.'
};

export const CONFIG_ERROR_KEYS = {
  ENV_VALIDATION: '.env file validation failed - ',
  ENV_NOT_FOUND: '',
  DEPENDENCY_FAILED: '🔥 Error on dependency injector loader: %o',
};

export const USER_ERROR_KEYS = {
    NOT_CREATED: 'User cannot be created.',
    NOT_FOUND: 'User not found.',
    DATABASE_FAILED_USER: 'Something not right. You need to refresh your app.',
    NOT_ACTIVATED: 'UserId is not activated',
    INVALID_REQUEST: 'Invalid request. Please try again with right inputs',
    INVALID_PASSWORD: 'username and password combination incorrect.',
    PHOTO_UPLOAD_ERROR: 'Photo upload error!',
    DOCS_UPLOAD_ERROR: 'Docs upload error!',
}

export const REQUIRE_FELID = {
  USER_PHONE: 'User phone number required!',
  INVALID_PHONE: '{VALUE} is not a valid phone no!',
  INVALID_EMAIL: '{Value} is not a valid email!'
}

export const UNKOWN_ERROR = 'Something went wrong, Please try again';

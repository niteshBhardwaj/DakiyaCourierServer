export const EVENTS = {
  USER: {
    SIGNUP: 'onUserSignUp',
    SIGNIN: 'onUserSignIn',
  },
  PINCODE_AVAILABILITY: {
    LOAD: 'loadPincodeAvailability',
  },
  ORDER: {
    CREATED: 'onOrderCreated',
    UPDATE: 'onOrderUpdated',
  },
  TRACKING: {
    UPDATE: 'updateTracking'
  },
  PICKUP_PROVIDER: {
    CREATED: 'onPickupProviderCreated',
    UPDATED: 'onPickupProviderUpdated',
  },
  OTP: {
    ON_PHONE: 'ON_PHONE_OTP',
    ON_EMAIL: 'ON_EMAIL_OTP'
  },
  TIMER: {
    CREATE: 'CREATE',
    CANCEL: 'CANCEL',
    WORK_CALL_TIMEOUT: 'WORK_CALL_TIMEOUT',
    TIMEOUT_CALL: 'TIMEOUT_CALL',
  },
};

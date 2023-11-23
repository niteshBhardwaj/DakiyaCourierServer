export const EVENTS = {
  USER: {
    SIGNUP: 'onUserSignUp',
    SIGNIN: 'onUserSignIn',
  },
  PARTNER: {
    CREATED: 'onPartnerCreated',
  },
  OTP: {
    SEND_OTP: "onOtpSend"
  },
  PACKAGE: {
    CREATED: 'onCreated',
    SEARCHING: 'onSearching',
    FOUND_PARTNER: 'onFoundPartner',
    SEND_REQUEST: 'onSendRequest',
    CONFIRM_CALL: 'onConfirmCall',
    CANCEL_REQUEST_PARTNER: 'onCancelRequest',
    CANCEL_REQUEST_USER: 'CANCEL_REQUEST_USER',
    ASSIGN_PARTNER: 'onAssignPartner',
    PICKUP: 'onPickup',
    DELIVERY: 'onDelivery',
    DELIVERED: 'onDelivered'
  },
  QUEUE: {
    PROCESS: 'PROCESS',
    COMPLETED: 'COMPLETED'
  },
  TIMER: {
    CREATE: 'CREATE',
    CANCEL: 'CANCEL',
    WORK_CALL_TIMEOUT: "WORK_CALL_TIMEOUT",
    TIMEOUT_CALL: 'TIMEOUT_CALL'
  }
};

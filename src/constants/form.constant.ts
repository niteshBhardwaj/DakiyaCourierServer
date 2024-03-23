export const FORM_VALIDATION_MSG = {
  DOCTYPE: 'Please enter valid document type.',
  DOC_STATE: 'Please enter valid doc state'
};

export const VALIDATION_MSG = {
  COUNTRY_CODE: 'Your country code maybe valid. Right now, we are only working in India',
  PHONE_NO: 'Please enter valid phone no.',
  OTP_LENGTH: 'Please enter valid otp.',
  OTP_EXPIRE: 'Otp is expired.',
  PHOTO_URL: 'Photo must be valid url.',
  VALID_EMAIL: 'Please enter valid email.',
  INVALID_MONGO_ID: 'Please provide valid id.',
};

export const FUN_NULL_INPUT_MSG = ({ name }: { name: string }) => {
  return `Please enter ${name}.`;
};

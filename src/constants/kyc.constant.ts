
export const KYC_URL_TEST = {
  AADHAAR_GENERATE_OTP: 'https://stoplight.io/mocks/gridlines/gridlines-api-docs/133154718/aadhaar-api/boson/generate-otp',
  AADHAAR_SUBMIT_OTP: 'https://stoplight.io/mocks/gridlines/gridlines-api-docs/133154718/aadhaar-api/boson/submit-otp',
  GSTIN_DETAILS: 'https://stoplight.io/mocks/gridlines/gridlines-api-docs/133154717/gstin-api/fetch-detailed'
};

export const KYC_COMMON_ERROR = "We cannot process request. Please try different methods for KYC";

export const AADHAAR_KYC_CODE = {
  [1001]: 'OTP sent to your Registered Mobile number. Check your mobile.',
  [1008]: 'Aadhaar number does not have a mobile number registered with it.',
  [1011]: KYC_COMMON_ERROR, //Exceeded Maximum OTP generation Limit. Please try again in some time.
  [1012]: 'Aadhaar number does not exist.',
  INVALID_AADHAAR: 'Invalid Aadhaar Number.',
  OTP_ALREADY_SENT: 'OTP already sent. Please try after 60 seconds.',
} as Record<string, string>;

export const AADHAAR_SUBMIT_OTP = {
  [1003]: KYC_COMMON_ERROR, //Session Expired. Please start the process again.
  [1005]: 'OTP attempts exceeded. Please start the process again.',
  INVALID_OTP: 'Invalid OTP.',
  NO_SHARE_CODE: KYC_COMMON_ERROR, // No share code provided
  WRONG_SHARE_CODE: KYC_COMMON_ERROR, //'Wrong share code.',
  INVALID_SHARE_CODE: KYC_COMMON_ERROR, //Invalid share code. Length should be 4 and should only contain numbers.
} as Record<string, string> ;

export const GSTIN_KYC_CODE = {
    [1005]: 'GSTIN does not exists.'
} as Record<string, string>
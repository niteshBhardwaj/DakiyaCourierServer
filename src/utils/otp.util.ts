import otpGenerator from 'otp-generator';
import { OTP_CONFIG, OTP_EXPIRE_TIME, OTP_LENGTH } from '@/constants';

// Generates an OTP.
export const generateOTP = (digit = OTP_LENGTH, options = OTP_CONFIG) => {
  const code = otpGenerator.generate(digit, options);
  return String(code);
};

export const getOtpMessage = ({ otp }) => {
  return `OTP ${otp} for your Dakiya service request, valid for next 10 minutes. Do not share the OTP with anyone including Dakiya Executives. %n %nTeam Dakiya.`
}

export const getOtpExpirationTime = (minutes = OTP_EXPIRE_TIME) => {
  return new Date(Date.now() + minutes * 60);
};

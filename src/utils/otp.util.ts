import otpGenerator from 'otp-generator';
import { OTP_CONFIG, OTP_EXPIRE_TIME, OTP_IDENTIFIER_TIME, OTP_LENGTH } from '@/constants';

// Generates an OTP.
export const generateOTP = (digit = OTP_LENGTH, options = OTP_CONFIG) => {
  const code = otpGenerator.generate(digit, options);
  return String(code);
};

export const getOtpMessage = ({ code }: { code: string }) => {
  return `OTP ${code} for your Dakiya service request, valid for next 10 minutes. Do not share the OTP with anyone including Dakiya Executives. %n %nTeam Dakiya.`
}

export const getOtpExpirationTime = (minutes = OTP_EXPIRE_TIME) => {
  return new Date(Date.now() + minutes * 60000);
};

export const getPreviousTimeInMinutes = (minutes = OTP_IDENTIFIER_TIME) => {
  return new Date(Date.now() - minutes * 60000);
};

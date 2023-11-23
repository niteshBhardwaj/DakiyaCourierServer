import otpGenerator from 'otp-generator';
import { OTP_CONFIG, OTP_LENGTH } from '@/constants';
import { OtpType } from '@/models/otp.model';

// Generates an OTP.
export const generateOTP = (digit = OTP_LENGTH, options = OTP_CONFIG) => {
  const OTP = otpGenerator.generate(digit, options);
  return OTP;
};

export const getOtpMessage = ({ otp }: Pick<OtpType, 'otp'>) => {
  return `OTP ${otp} for your Dakiya service request, valid for next 10 minutes. Do not share the OTP with anyone including Dakiya Executives. %n %nTeam Dakiya.`
}

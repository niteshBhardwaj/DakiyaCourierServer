import { getEmailOtpBody } from "~/email-template/otp-email";

export const createOtpOptionForMailer = ({ to, code }: { to: string; code: number; }) => {

    return {
      from: '"Dakiya 👻" <noreply@dakiya.net>', // sender address
      to, // list of receivers
      subject: 'OTP ✔', // Subject line
      html: getEmailOtpBody({ code }), // html body
    };
}
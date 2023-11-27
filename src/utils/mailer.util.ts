
export const createOtpOptionForMailer = ({ to, code }: { to: string; code: number; }) => {

    return {
      from: '"Dakiya 👻" <info@dakiya.com>', // sender address
      to, // list of receivers
      subject: 'OTP ✔', // Subject line
      html: `<b>Your OTP code: ${code}</b>`, // html body
    };
}
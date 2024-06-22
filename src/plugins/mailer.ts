import nodemailer, { Transporter } from 'nodemailer';
import { env } from './config';

export type MailerInstance = Transporter;
export default () => {
  return nodemailer.createTransport({
    host: 'smtp.zoho.in',
    port: 465,
    secure: true,
    auth: {
      user: env.MAILER_EMAIL,
      pass: env.MAILER_PASSWORD,
    },
  });
};

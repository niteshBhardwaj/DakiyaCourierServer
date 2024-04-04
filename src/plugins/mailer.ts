import nodemailer, { Transporter } from 'nodemailer';
import { env } from './config';

export type MailerInstance = Transporter;
export default () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: env.MAILER_EMAIL,
      pass: env.MAILER_PASSWORD,
    },
  });
};

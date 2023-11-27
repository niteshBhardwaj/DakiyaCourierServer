import nodemailer, { Transporter } from 'nodemailer';
import { config } from './config';

export type MailerInstance = Transporter;
export default () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: config.MAILER_EMAIL,
      pass: config.MAILER_PASSWORD,
    },
  });
};

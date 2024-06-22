import { Service, Inject } from 'typedi';
import { IUser } from '~/interfaces/user.interface';
import { type MailerInstance } from '~/plugins/mailer';
import { createOtpOptionForMailer } from '~/utils';

@Service()
export default class MailerService {
  constructor(@Inject('mailer') private emailClient: MailerInstance) {}

  public async SendWelcomeEmail(email: string) {
    /**
     * @TODO Call Mailchimp/Sendgrid or whatever
     */
    // Added example for sending mail from mailgun
    const data = {
      from: 'Excited User <me@samples.mailgun.org>',
      to: [email],
      subject: 'Hello',
      text: 'Testing some Mailgun awesomness!',
    };
    try {
      this.emailClient.sendMail(data);
      return { delivered: 1, status: 'ok' };
    } catch (e) {
      return { delivered: 0, status: 'error' };
    }
  }
  public StartEmailSequence(sequence: string, user: Partial<IUser>) {
    if (!user.email) {
      throw new Error('No email provided');
    }
    // @TODO Add example of an email sequence implementation
    // Something like
    // 1 - Send first email of the sequence
    // 2 - Save the step of the sequence in database
    // 3 - Schedule job for second email in 1-3 days or whatever
    // Every sequence can have its own behavior so maybe
    // the pattern Chain of Responsibility can help here.
    return { delivered: 1, status: 'ok' };
  }

  public async sendOtp(email: string, code: number) {
    const options = createOtpOptionForMailer({ to: email, code });
    try {
      const info = await this.emailClient.sendMail(options);
      return info;
    } catch(e) {
      console.log(e)
      throw new Error('Email sent failed.')
    }
  }
}
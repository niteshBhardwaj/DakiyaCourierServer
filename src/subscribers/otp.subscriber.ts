import { Container } from 'typedi';
import { EventSubscriber, On } from 'event-dispatch';
import { CountryCode, EVENTS } from '~/constants';
import LoggerInstance from '~/plugins/logger';
import SMSService from '~/services/sms.service';
import MailerService from '~/services/mailer.service';

@EventSubscriber()
export default class OtpSubscriber {
  smsService: SMSService;
  mailerService: MailerService;
  logger: typeof LoggerInstance;
  constructor() {
    this.logger = Container.get('logger');
    this.smsService = Container.get(SMSService);
    this.mailerService = Container.get(MailerService);
  }

  @On(EVENTS.OTP.ON_PHONE)
  public sendPhoneOtp({ phone, code }: { phone: number; code: string; }) {
    this.smsService.sendOtp({ phone: `${CountryCode.IN}${phone}`, code });
  }

  @On(EVENTS.OTP.ON_EMAIL)
  public sendEmailOtp({ email, code }: { email: string; code: number }) {
    this.mailerService.sendOtp(email, code);
  }
}

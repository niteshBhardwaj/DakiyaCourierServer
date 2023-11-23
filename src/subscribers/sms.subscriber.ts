import { Container } from 'typedi';
import { EventSubscriber, On } from 'event-dispatch';
import { EVENTS } from '@/constants';
import LoggerInstance from '@/plugins/logger';
import SMSService from '@/services/sms.service';

@EventSubscriber()
export default class PartnerSubscriber {
  smsService: SMSService;
  logger: typeof LoggerInstance;
  constructor() {
    this.logger = Container.get('logger');
    this.smsService = Container.get(SMSService);
  }

  @On(EVENTS.OTP.SEND_OTP)
  public sendOtp({ phone, countryCode, otp }: OtpType) {
    this.smsService.sendOtp({ phone: `${countryCode}${phone}`, otp });
  }
}

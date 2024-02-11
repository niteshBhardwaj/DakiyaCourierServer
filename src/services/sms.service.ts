import { httpPost } from '../utils/http.util';
import { UploadResponseType } from '@interfaces/upload.interface';
import LoggerInstance from '@/plugins/logger';
import { Service, Inject } from 'typedi';
import { EventDispatcher, EventDispatcherInterface } from '@/decorators/eventDispatcher';
import { SMS_SENDER, SMS_URL } from '@/constants';
import { getOtpMessage } from '@/utils';
import { config } from '@/plugins/config';
import { Otp } from '@prisma/client';

@Service()
export default class SMSService {
  constructor(
    @Inject('logger') private logger: typeof LoggerInstance,
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
  ) {}

  // Uploads a file.
  public async sendMessage({ numbers, message }: { numbers : string; message: string; }): Promise<UploadResponseType> {
    let url;
    try {
        url = `${SMS_URL}&apikey=${config.SMS_API_KEY}&numbers=${numbers}&message=${message}&sender=${SMS_SENDER}` 
        const data = await httpPost(url, {}) as { status: string, message: string; };
        if(data.status !== 'success') throw data;
        return data;
    } catch(e) {
        this.logger.error(`failed SMS - ${url}`);
        this.logger.error(JSON.stringify(e));
    }
    return { error: 'error', message: `Send SMS failed!`, }
  }

  public async sendOtp({ phone, otp }: { phone: string; otp: number;}): Promise<void> {
    const message = getOtpMessage({ otp: String(otp) });
    this.sendMessage({ numbers: phone, message });
  }

  
}

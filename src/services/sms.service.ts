import { httpPost } from '../utils/http.util';
import LoggerInstance from '@/plugins/logger';
import { Service, Inject } from 'typedi';
import { EventDispatcher, EventDispatcherInterface } from '@/decorators/eventDispatcher';
import { SMS_SENDER, SMS_URL } from '@/constants';
import { getOtpMessage } from '@/utils';
import { env } from '@/plugins/config';
import { Otp } from '@prisma/client';
import { UploadResponseType } from '@/interfaces/upload.interface';

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
        url = `${SMS_URL}&apikey=${env.SMS_API_KEY}&numbers=${numbers}&message=${message}&sender=${SMS_SENDER}` 
        console.log(url);
        const { data } = await httpPost(url);
        console.log('success data', data);
        if(data.status !== 'success') throw data;
        return data;
    } catch(e) {
        this.logger.error(`failed SMS - ${url}`);
        this.logger.error(JSON.stringify(e));
    }
    return { error: 'error', message: `Send SMS failed!`, }
  }

  public async sendOtp({ phone, code }: { phone: string; code: string;}): Promise<void> {
    const message = getOtpMessage({ code });
    // TODO:// skipping for now util the OTP service is ready
    //this.sendMessage({ numbers: phone, message });
  }

  
}

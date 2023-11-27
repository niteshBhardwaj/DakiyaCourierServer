import LoggerInstance from '@/plugins/logger';
import { Service, Inject } from 'typedi';
import { EventDispatcher, EventDispatcherInterface } from '@/decorators/eventDispatcher';
import { EVENTS, USER_ERROR_KEYS } from '@/constants';
import { Otp, PrismaClient, VerificationType } from '@prisma/client';
import { generateOTP, getOtpExpirationTime } from '@/utils';
import { badUserInputException } from '@/utils/exceptions.util';

@Service()
export default class OtpService {
  constructor(
    @Inject('prisma') private prisma: PrismaClient,
    @Inject('logger') private logger: typeof LoggerInstance,
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
  ) {}

  // Send an OTP to the givenphone info.
  public async sendPhoneOtp(data: { phone: string }): Promise<{ otpToken: string }> {
    const otp = await this.create({
      contactIdentifier: data.phone,
      verificationType: VerificationType.PHONE,
      lastRequestIP: '',
    });
    this.eventDispatcher.dispatch(EVENTS.OTP.ON_PHONE, otp);
    return {
      otpToken: otp.id,
    };
  }

  // Send an OTP to the givenphone info.
  public async sendEmailOtp(data: { email: string }): Promise<{ otpToken: string }> {
    const otp = await this.create({
      contactIdentifier: data.email,
      lastRequestIP: '',
      verificationType: VerificationType.EMAIL,
    });
    console.log(otp);
    this.eventDispatcher.dispatch(EVENTS.OTP.ON_EMAIL, { email: data.email, code: otp.code });
    return {
      otpToken: otp.id,
    };
  }

  public async verifyOtp({id, code }: Pick<Otp, "id"|"code">) {
    const otp = await this.prisma.otp.update({
      where: {
        id,
        code,
        isVerified: false,
        expirationTime: {
          lt: String(Date.now()),
        },
      },
      data: {
        isVerified: true,
      },
      select: {
        id: true,
      },
    });
    if(!otp) {
        throw badUserInputException(USER_ERROR_KEYS.INVALID_OTP)
    }
    return {
        id: otp.id
    }
  }


  private async create(data: Pick<Otp, 'contactIdentifier' | 'lastRequestIP' | 'verificationType'>): Promise<Otp> {
    return this.prisma.otp.create({
      data: {
        code: generateOTP(),
        expirationTime: getOtpExpirationTime(),
        lastRequestTime: new Date(),
        ...data
      },
    });
  }
}

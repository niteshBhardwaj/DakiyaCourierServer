import { Identifier } from './../graphql/args/auth.input';
import LoggerInstance from '@/plugins/logger';
import { Service, Inject } from 'typedi';
import { EventDispatcher, EventDispatcherInterface } from '@/decorators/eventDispatcher';
import { EVENTS, USER_ERROR_KEYS } from '@/constants';
import { Otp, PrismaClient, VerificationType } from '@prisma/client';
import { generateOTP, getOtpExpirationTime, getPreviousTimeInMinutes } from '@/utils';
import { badUserInputException } from '@/utils/exceptions.util';

@Service()
export default class OtpService {
  constructor(
    @Inject('prisma') private prisma: PrismaClient,
    @Inject('logger') private logger: typeof LoggerInstance,
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
  ) {}

  // Send an OTP to the givenphone info.
  public async sendPhoneOtp({contactIdentifier, userId, usedFor }: Pick<Otp, 'contactIdentifier' | 'userId' | 'usedFor'>): Promise<Identifier> {
    const otp = await this.create({
      userId,
      contactIdentifier,
      verificationType: VerificationType.PHONE,
      lastRequestIP: '',
      usedFor,
    });
    this.eventDispatcher.dispatch(EVENTS.OTP.ON_PHONE, otp);
    return {
      identifier: otp.id,
    };
  }

  // Send an OTP to the givenphone info.
  public async sendEmailOtp({ contactIdentifier, userId, usedFor }: Pick<Otp, 'contactIdentifier' | 'userId' | 'usedFor'>): Promise<Identifier> {
    const otp = await this.create({
      userId,
      contactIdentifier,
      lastRequestIP: '',
      verificationType: VerificationType.EMAIL,
      usedFor
    });
    console.log(otp);
    this.eventDispatcher.dispatch(EVENTS.OTP.ON_EMAIL, { email: contactIdentifier, code: otp.code });
    return {
      identifier: otp.id,
    };
  }

  public async verifyOtp({
    id,
    code,
    ...others
  }: Partial<Otp>): Promise<Identifier> {
    try {
      const otp = await this.prisma.otp.update({
        where: {
          id,
          code,
          isVerified: false,
          expirationTime: {
            gt: new Date(),
          },
          ...others
        },
        data: {
          isVerified: true,
          // lastRequestTime: new Date(),
          // userId: '65673a13d0b1badd5f06a5f4',
        },
        select: {
          id: true,
        },
      });
      return {
        identifier: otp.id,
      };
    } catch (e) {
      throw badUserInputException(USER_ERROR_KEYS.INVALID_OTP);
    }
  }

  public async verifyIdentifier({
    id,
    contactIdentifier,
    usedFor,
  }: Pick<Otp, 'id' | 'contactIdentifier' | 'usedFor'>): Promise<Identifier> {
    try {
      const otp = await this.prisma.otp.findFirst({
        where: {
          id,
          contactIdentifier,
          isVerified: true,
          expirationTime: {
            gte: getPreviousTimeInMinutes(),
          },
          usedFor,
        },
        select: {
          id: true,
        },
      });
      if(!otp) {
        throw new Error(USER_ERROR_KEYS.INVALID_REQUEST);
      }
      return {
        identifier: otp.id,
      };
    } catch (e) {
      console.log(e);
      throw badUserInputException(USER_ERROR_KEYS.INVALID_REQUEST);
    }
  }

  private async create(
    data: Pick<Otp, 'contactIdentifier' | 'lastRequestIP' | 'verificationType'>,
  ): Promise<Otp> {
    return this.prisma.otp.create({
      data: {
        code: generateOTP(),
        expirationTime: getOtpExpirationTime(),
        lastRequestTime: new Date(),
        ...data,
      },
    });
  }
}

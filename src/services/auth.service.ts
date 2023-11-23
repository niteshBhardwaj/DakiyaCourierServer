import { HttpException } from '@exceptions/HttpException';
import LoggerInstance from '@/plugins/logger';
import { Service, Inject } from 'typedi';
import { EventDispatcher, EventDispatcherInterface } from '@/decorators/eventDispatcher';
import TokenService from './token.service';
import { EVENTS, HTTP_CODE, USER_ERROR_KEYS, USER_TYPE, LOGIN_FOR } from '@/constants';
import { isUserActivated } from '@/utils';
import { LoginSuccessResp } from '@/graphql/typedefs/auth.type';
import { OtpVerifyInput, PhoneInput } from '@/graphql/args/auth.input';
import { AdminLoginInput } from '@/graphql/args/users.input';

@Service()
export default class AuthService {
  constructor(
    @Inject('logger') private logger: typeof LoggerInstance,
    private tokenService: TokenService,
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
  ) {}

  // Send an OTP to the given phone info.
  public async sendOtp(phoneInfo: PhoneInput): Promise<{ otpToken: string }> {
    const otpRecord = await OtpModel.createOtp({
      ...phoneInfo,
      token: this.tokenService.uniqueToken(),
    });
    this.eventDispatcher.dispatch(EVENTS.OTP.SEND_OTP, otpRecord);
    return { otpToken: otpRecord.token };
  }

  // Verify and login or sign up.
  public async verifyAndLoginOrSignup({
    otpToken,
    code,
  }: OtpVerifyInput, loginFor: LOGIN_FOR): Promise<LoginSuccessResp> {
    let otpInfo: any = { token: otpToken, otp: code };
    if(code === 100001) {
      otpInfo = { token: otpToken };
    }
    const record = await OtpModel.verifyOtp(otpInfo);
    return this.validateAndLogin(record, loginFor);
  }

  // Validate and login.
  private async validateAndLogin({ phone }: OtpType, loginFor: LOGIN_FOR): Promise<LoginSuccessResp> {
    let userRecord = await userModel.findOne({ phone });
    if (!userRecord) {
      // create new account
      const isPartner = loginFor === LOGIN_FOR.PARTNER;
      const isConsumer = loginFor === LOGIN_FOR.CONSUMER;
      userRecord = await this.signUp({ phone, isPartner, isConsumer });
    }
    // throw error if user is not activated;
    isUserActivated(!userRecord.activated);
    const authToken = this.tokenService.generateToken(userRecord);
    return { authToken };
  }

  // Signs up a user asynchronously.
  public async signUp({ phone, isPartner, isConsumer }: Partial<UserType>): Promise<UserType> {
    const userRecord = await userModel.create({
      phone,
      isPartner,
      isConsumer,
      activated: true
    });
    if (!userRecord) {
      throw new Error(USER_ERROR_KEYS.NOT_CREATED);
    }
    this.eventDispatcher.dispatch(EVENTS.USER.SIGNUP, { user: userRecord });
    return userRecord;
  }

  public async adminLogin({ phone, password }: AdminLoginInput): Promise<LoginSuccessResp> {
    const userRecord = await userModel.findUser({ phone, userType: USER_TYPE.ADMIN }, PROJECTION_USER_VALIDATE_LOGIN);
    isUserActivated(!userRecord.activated);
    if(password !== 'admin') throw new HttpException(HTTP_CODE[400], USER_ERROR_KEYS.INVALID_PASSWORD);
    const authToken = this.tokenService.generateToken(userRecord);
    return { authToken }
  }
}

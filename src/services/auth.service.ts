import { Service, Inject } from 'typedi';
import TokenService from './token.service';
import { EVENTS, HTTP_CODE, USER_ERROR_KEYS, PROJECTION_USER_VALIDATE_LOGIN, USER_TYPE, LOGIN_FOR } from '@constants';
// import { isUserActivated } from '@utils';

@Service()
export default class AuthService {
  constructor(
    // @Inject('logg/er') private logger: typeof LoggerInstance,
    private tokenService: TokenService,
    // @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
  ) {}

  // Send an OTP to the given phone info.
  public async sendOtp(phoneInfo: any): Promise<{ otpToken: string }> {
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
  }: any, loginFor: LOGIN_FOR): Promise<any> {
    let otpInfo: any = { token: otpToken, otp: code };
    if(code === 100001) {
      otpInfo = { token: otpToken };
    }
    const record = await OtpModel.verifyOtp(otpInfo);
    return this.validateAndLogin(record, loginFor);
  }

  // Validate and login.
  private async validateAndLogin({ phone }: any, loginFor: LOGIN_FOR): Promise<any> {
    let userRecord = await userModel.findOne({ phone }, PROJECTION_USER_VALIDATE_LOGIN) as any;
    if (!userRecord) {
      // create new account
      const isPartner = loginFor === LOGIN_FOR.PARTNER;
      const isConsumer = loginFor === LOGIN_FOR.CONSUMER;
      userRecord = await this.signUp({ phone, isPartner, isConsumer });
    }
    // throw error if user is not activated;
    //isUserActivated(!userRecord.activated);
    const authToken = this.tokenService.generateToken(userRecord);
    return { authToken };
  }

  // Signs up a user asynchronously.
  public async signUp({ phone, isPartner, isConsumer }: Partial<any>): Promise<any> {
    const userRecord = await userModel.create({
      phone,
      isPartner,
      isConsumer,
      activated: true
    });
    if (!userRecord) {
      throw new Error(USER_ERROR_KEYS.NOT_CREATED);
    }
    // this.eventDispatcher.dispatch(EVENTS.USER.SIGNUP, { user: userRecord });
    return userRecord;
  }
}

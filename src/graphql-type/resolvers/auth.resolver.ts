import { type UserContext } from '~/interfaces/auth.interface';
import UserService from '~/services/user.service';
import { Inject, Service } from 'typedi';
import { Arg, Authorized, Ctx, Mutation, Resolver } from 'type-graphql';
import AuthService from '~/services/auth.service';
import { QUERY_DESC, REQUEST } from '~/constants';
import { LoginSuccessResp, OtpResp } from '../typedefs/auth.type';
import { CreateAccountInput, InitEmailRequest, InitPhoneRequest, InitAccountType, LoginRequest } from '../args/auth.input';
import OtpService from '~/services/otp.service';
import { OtpVerifyInput } from '../args/otp.input';
import { UsedForType } from '@prisma/client';

@Service()
@Resolver()
export class authResolver {
  @Inject()
  authService: AuthService;
  @Inject()
  otpService: OtpService;
  @Inject()
  userService: UserService;

  /* login */
  @Mutation(() => LoginSuccessResp, {
    description: QUERY_DESC.INIT_AUTH,
  })
  async login(@Arg(REQUEST) args: LoginRequest): Promise<LoginSuccessResp> {
    return await this.authService.verifyAndLogin(args);
  }

  /* create account */
  @Mutation(() => LoginSuccessResp, {
    description: QUERY_DESC.INIT_AUTH,
  })
  async createAccount(
    @Arg(REQUEST) args: CreateAccountInput,
  ): Promise<LoginSuccessResp> {
    return this.authService.verifyAndCreateAccount(args);
  }

  // Send a phone verification call
  @Mutation(() => OtpResp, {
    description: QUERY_DESC.INIT_AUTH,
  })
  async initPhone(@Arg(REQUEST) { phone, type }: InitPhoneRequest): Promise<OtpResp> {
    if (type === String(InitAccountType.CREATE_ACCOUNT)) {
      await this.authService.isAccountExist({ phone });
    }
    return await this.otpService.sendPhoneOtp({
      contactIdentifier: phone.toString(),
      userId: null,
      usedFor: InitAccountType.CREATE_ACCOUNT,
    });
  }

  /* send email otp */
  @Authorized()
  @Mutation(() => OtpResp, {
    description: QUERY_DESC.INIT_AUTH,
  })
  async initEmail(
    @Arg(REQUEST) { email, type }: InitEmailRequest,
    @Ctx() { userId }: UserContext,
  ): Promise<OtpResp> {
    if (type === String(InitAccountType.CREATE_ACCOUNT)) {
      await this.authService.isAccountExist({ email });
    }
    return this.otpService.sendEmailOtp({ contactIdentifier: email, userId, usedFor: UsedForType.CREATE_ACCOUNT });
  }

  /* verify otp */
  @Mutation(() => OtpResp, {
    description: QUERY_DESC.VERIFY_OTP_LOGIN,
  })
  async verifyOtp(@Arg(REQUEST) otpInfo: OtpVerifyInput): Promise<OtpResp> {
    const otp = await this.otpService.verifyOtp({
      id: otpInfo.identifier,
      code: String(otpInfo.code),
    });
    return {
      identifier: otp.id
    };
  }
}

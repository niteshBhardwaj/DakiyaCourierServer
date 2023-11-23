import { Inject, Service } from 'typedi';
import { Arg, Mutation, Query, Resolver } from 'type-graphql';
import { AdminLoginDto, AdminLoginInput } from '@/graphql/args/users.input';
import AuthService from '@/services/auth.service';
import { LOGIN_FOR, QUERY_DESC, REQUEST } from '@/constants';
import { LoginSuccessResp, OtpResp } from '../typedefs/auth.type';
import { OtpVerifyInput, PhoneInput } from '../args/auth.input';

@Service()
@Resolver()
export class authResolver {
  @Inject()
  authService: AuthService;

  // Send a phone verification call
  @Mutation(() => OtpResp, {
    description: QUERY_DESC.INIT_AUTH,
  })
  async initAuth(@Arg(REQUEST) phoneInfo: PhoneInput): Promise<OtpResp> {
    return await this.authService.sendOtp(phoneInfo);
  }

  // Verify otp and login.
  @Mutation(() => LoginSuccessResp, {
    description: QUERY_DESC.VERIFY_OTP_LOGIN,
  })
  async partnerLoginRequest(@Arg(REQUEST) otpVerify: OtpVerifyInput): Promise<LoginSuccessResp> {
    return await this.authService.verifyAndLoginOrSignup(otpVerify, LOGIN_FOR.PARTNER);
  }

  // Verify otp and login.
  @Mutation(() => LoginSuccessResp, {
    description: QUERY_DESC.VERIFY_OTP_LOGIN,
  })
  async consumerLoginRequest(@Arg(REQUEST) otpVerify: OtpVerifyInput): Promise<LoginSuccessResp> {
    return await this.authService.verifyAndLoginOrSignup(otpVerify, LOGIN_FOR.CONSUMER);
  }

  @Query(() => LoginSuccessResp, {
    description: QUERY_DESC.ADMIN_LOGIN,
  })
  async adminLogin(@Arg(REQUEST) adminInfo: AdminLoginInput): Promise<LoginSuccessResp> {
    return await this.authService.adminLogin(adminInfo);
  }

  // Log out a user.
  // @Authorized()
  // @Mutation(() => User, {
  //   description: QUERY_DESC.LOGOUT,
  // })
  // async logout(@Ctx('user') userData: any): Promise<any> {
  //   //const user = await this.userLogOut(userData);
  //   //return user;
  //   return { success: true };
  // }
}

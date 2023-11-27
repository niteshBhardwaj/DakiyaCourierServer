import { Inject, Service } from 'typedi';
import { Arg, Mutation, Query, Resolver } from 'type-graphql';
import { AdminLoginInput } from '@/graphql/args/users.input';
import AuthService from '@/services/auth.service';
import { QUERY_DESC, REQUEST } from '@/constants';
import { CreateAccountType, LoginSuccessResp, OtpResp } from '../typedefs/auth.type';
import { CreateAccountInput, EmailInput, EmailPasswordInput, PhoneInput } from '../args/auth.input';
import OtpService from '@/services/otp.service';

@Service()
@Resolver()
export class authResolver {
  @Inject()
  authService: AuthService;
  @Inject()
  otpService: OtpService;

  @Mutation(() => LoginSuccessResp, {
    description: QUERY_DESC.INIT_AUTH,
  })
  async emailLogin(@Arg(REQUEST) args: EmailPasswordInput): Promise<LoginSuccessResp> {
    return await this.authService.verifyEmailPassword(args);
  }

  @Mutation(() => CreateAccountType, {
    description: QUERY_DESC.INIT_AUTH,
  })
  async createAccount(@Arg(REQUEST) args: CreateAccountInput): Promise<LoginSuccessResp> {
    return await this.authService.verifyAndCreateAccount(args);
  }

  // Send a phone verification call
  @Mutation(() => OtpResp, {
    description: QUERY_DESC.INIT_AUTH,
  })
  async initPhone(@Arg(REQUEST) phoneInfo: PhoneInput): Promise<OtpResp> {
    return await this.otpService.sendPhoneOtp(phoneInfo);
  }

  @Mutation(() => OtpResp, {
    description: QUERY_DESC.INIT_AUTH,
  })
  async initEmail(@Arg(REQUEST) emailInfo: EmailInput): Promise<OtpResp> {
    console.log(this.otpService.sendEmailOtp);
    return this.otpService.sendEmailOtp(emailInfo);
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

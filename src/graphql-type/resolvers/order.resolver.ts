import { type UserContext } from '@/interfaces/auth.interface';
import UserService from '@/services/user.service';
import { Inject, Service } from 'typedi';
import { Arg, Authorized, Ctx, Mutation, Resolver } from 'type-graphql';
import AuthService from '@/services/auth.service';
import { QUERY_DESC, REQUEST } from '@/constants';
import { LoginSuccessResp, OtpResp } from '../typedefs/auth.type';
import { CreateAccountInput, InitEmailRequest, InitPhoneRequest, InitPhoneType, LoginRequest } from '../args/auth.input';
import OtpService from '@/services/otp.service';

@Service()
@Resolver()
export class orderResolver {
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
}

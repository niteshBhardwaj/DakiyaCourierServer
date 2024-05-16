import { Inject, Service } from 'typedi';
import { Arg, Authorized, Ctx, Mutation, Resolver } from 'type-graphql';
import AuthService from '~/services/auth.service';
import { QUERY_DESC, REQUEST } from '~/constants';
import { LoginSuccessResp } from '../typedefs/auth.type';
import { LoginRequest } from '../args/auth.input';

@Service()
@Resolver()
export class ServiceResolver {
  @Inject()
  authService: AuthService;
 

  /* login */
  @Mutation(() => LoginSuccessResp, {
    description: QUERY_DESC.INIT_AUTH,
  })
  async login(@Arg(REQUEST) args: LoginRequest): Promise<LoginSuccessResp> {
    return await this.authService.verifyAndLogin(args);
  }

}

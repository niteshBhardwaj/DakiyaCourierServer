import { QUERY_DESC } from '@/constants';
import { Inject, Service } from 'typedi';
import { Arg, Authorized, Ctx, Mutation, Resolver } from 'type-graphql';
import UserService from '@/services/user.service';
import { UserContext } from '@/interfaces/auth.interface';
import DocsVerficationService from '@/services/partner.service';
import { User } from '../typedefs/users.type';

@Service()
@Resolver()
export class userResolver {
  @Inject()
  userService: UserService;
  docsVerfication: DocsVerficationService;
  // Save profile info for a user.
  // @Authorized()
  // @Mutation(() => User, {
  //   description: QUERY_DESC.SAVE_PROFILE_INFO,
  // })
  // async saveProfileInfo(
  //   @Arg('request') profileInfo: ProfileInfoDto,
  //   @Ctx() ctx: UserContext,
  // ): Promise<User> {
  //   return this.userService.saveProfileInfo(profileInfo, ctx.userId);
  // }
}

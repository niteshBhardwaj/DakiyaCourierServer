import { Inject, Service } from 'typedi';
import { Arg, Authorized, Ctx, Mutation, Resolver } from 'type-graphql';

@Service()
@Resolver()
export class userResolver {
  @Inject()
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

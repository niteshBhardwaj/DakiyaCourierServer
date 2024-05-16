import { Inject, Service } from 'typedi';
import { Resolver } from 'type-graphql';
import UserService from '~/services/user.service';

@Service()
@Resolver()
export class adminResolver {
  @Inject()
  userService: UserService;

  // @Authorized(USER_TYPE.ADMIN)
  // @Query(() => [User], {
  //   description: QUERY_DESC.USER_INFO,
  // })
  // async getAllUsers(): Promise<[User]> {
  //   return this.userService.getAllUser();
  // } 

  // @Authorized(USER_TYPE.ADMIN)
  // @Mutation(() => User, {
  //   description: QUERY_DESC.USER_INFO,
  // })
  // async updateUploadDocs( @Arg('request') userInfo: AdminUploadDocsDto,): Promise<VerificationDocsResp> {
  //   return this.userService.updateUploadDocs(userInfo);
  // } 
}

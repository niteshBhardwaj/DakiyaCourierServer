import { Inject, Service } from 'typedi';
import { Resolver, Query, Authorized, Mutation, Arg } from 'type-graphql';
import { User } from '@typedefs/users.type';
import { QUERY_DESC, USER_TYPE } from '@/constants';
import UserService from '@/services/user.service';
import { AdminUploadDocsDto } from '../args/users.input';

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

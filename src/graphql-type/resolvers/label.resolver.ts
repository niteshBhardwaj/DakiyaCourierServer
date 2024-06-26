import { Inject, Service } from 'typedi';
import { Authorized, Resolver, Query, Ctx, Arg, Info, Mutation } from 'type-graphql';
import { LabelType } from '../typedefs/label.type';
import LabelService from '~/services/label.service';
import { QUERY_DESC, REQUEST, USER_TYPE } from '~/constants';
import { UserContext } from '~/interfaces/auth.interface';
import { type GraphQLResolveInfo } from 'graphql';
import { LabelInput } from '../args/label.input';

@Service()
@Resolver()
export class LabelResolver {
    @Inject()
    private labelService: LabelService;

    @Authorized()
    @Query(() => LabelType, {
        description: QUERY_DESC.USER_INFO,
    })
    async getLabelConfig(
        @Ctx() { user: { userId } }: { user: UserContext },
        @Info() info: GraphQLResolveInfo,
    ) {
        let labelInfo = await this.labelService.findLabelInfoByUserId({ userId }, info);
        return labelInfo ?? {};
    }

    @Authorized()
    @Mutation(() => LabelType, {
        description: QUERY_DESC.USER_INFO,
    })
    async addOrUpdateLabel(
        @Arg(REQUEST) input: LabelInput,
        @Ctx() { user: { userId } }: { user: UserContext },
        @Info() info: GraphQLResolveInfo,
    ) {
        return this.labelService.addOrUpdateLabel({ input, userId }, info);
    }
}

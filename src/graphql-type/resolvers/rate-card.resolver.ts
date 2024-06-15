import { Inject, Service } from 'typedi';
import { Authorized, Ctx, Query, Resolver } from 'type-graphql';
import { QUERY_DESC } from '~/constants';
import { UserContext } from '~/interfaces/auth.interface';
import { RateCardType } from '../typedefs/rate-card.type';
import RateCardService from '~/services/rate-card-service';

@Service()
@Resolver()
export class rateCardResolver {
    @Inject()
    rateCardService: RateCardService;

    @Authorized()
    @Query(() => RateCardType, {
        description: QUERY_DESC.INIT_AUTH
    })
    async getRateCard(@Ctx() { user: { userId } }: { user: UserContext }): Promise<RateCardType> {
        return this.rateCardService.getUserRateCard({
            userId
        });
    }

    // get default rate card
    @Query(() => RateCardType, {
        description: QUERY_DESC.SAVE_DOCS
    })
    async getDefaultRateCard(): Promise<RateCardType> {
        return this.rateCardService.getDefaultRateCard();
    }

}
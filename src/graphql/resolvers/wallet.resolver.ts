import { Resolver, Ctx, Query, Authorized } from 'type-graphql';
import { QUERY_DESC } from '@/constants';
import WalletService from '@/services/wallet.service';
import { WalletResponse } from '../typedefs/wallet.type';
import { Inject, Service } from 'typedi';
// import { UserContext } from '@/interfaces/auth.interface';

@Service()
@Resolver()
export class walletResolver {
  @Inject()
  walletService: WalletService;

  // @Authorized()
  @Query(() => WalletResponse, {
    description: QUERY_DESC.GET_WALLET_INFO,
  })
  async getWalletInfo(
    @Ctx() ctx: UserContext): Promise<WalletResponse> {
    return this.walletService.getWalletInfo(ctx);
  }
}

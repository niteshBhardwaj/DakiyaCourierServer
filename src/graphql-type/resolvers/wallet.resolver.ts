import { Resolver, Ctx, Query, Authorized } from 'type-graphql';
import { QUERY_DESC } from '@/constants';
import { WalletResponse } from '../typedefs/wallet.type';
import { Inject, Service } from 'typedi';
import WalletService from '@/services/wallet.service';
import { UserContext } from '@/interfaces/auth.interface';

@Service()
@Resolver()
export class walletResolver {
  @Inject()
  walletService: WalletService;

  @Authorized()
  @Query(() => WalletResponse, {
    description: QUERY_DESC.GET_WALLET_INFO,
  })
  async getWalletInfo(
    @Ctx() { user: { userId } }: { user: UserContext },
    ): Promise<WalletResponse> {
    return this.walletService.getWalletInfo({ userId });
  }

  @Authorized()
  @Query(() => WalletResponse, {
    description: QUERY_DESC.GET_WALLET_INFO,
  })
  async getTransactions(
    @Ctx() { user: { userId } }: { user: UserContext },
    ): Promise<WalletResponse> {
      //@ts-ignore
      return this.walletService.getTransactions({ userId });
  }
}

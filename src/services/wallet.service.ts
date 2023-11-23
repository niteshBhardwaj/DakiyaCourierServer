import { Service, Inject } from 'typedi';
import { EventDispatcher, EventDispatcherInterface } from '@/decorators/eventDispatcher';
import { ObjectID } from '@/utils';
import LoggerInstance from '@/plugins/logger';
import { UserContext } from '@/interfaces/auth.interface';
import { WalletResponse } from '@/graphql/typedefs/wallet.type';

@Service()
export default class WalletService {
  constructor(
    @Inject('logger') private logger: typeof LoggerInstance,
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
  ) {}

  public async getWalletInfo({ userId }: UserContext ) {
    return await walletModel.find({ userId: ObjectID(userId) }) as unknown as WalletResponse;
  }   
  
  public async create({ userId, partnerId }: Pick<WalletType, "userId" | "partnerId">) {
    return walletModel.create({
      userId,
      partnerId,
      totalEarn: 0,
    });
  }

  public async saveTransaction(transaction: TransactionType, { userId }: Pick<WalletType, "userId">) {
    return walletModel.saveTransaction({
      userId
    },
      transaction
    );
  }
}

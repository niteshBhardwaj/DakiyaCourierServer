import { Service, Inject } from 'typedi';
import { EventDispatcher, EventDispatcherInterface } from '~/decorators/eventDispatcher';
import LoggerInstance from '~/plugins/logger';
import { PrismaClient, Transaction, TransactionType } from '@prisma/client';

@Service()
export default class WalletService {
  constructor(
    @Inject('logger') private logger: typeof LoggerInstance,
    @Inject('prisma') private prisma: PrismaClient,
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
  ) {}

  public async getWalletInfo({ userId }: { userId: string} ) {
    const wallet = await this.prisma.wallet.findUnique({
      where: {
        userId
      },
      select: {
        balance: true
      }
    })
    return wallet;
  }

  public async getTransactions({ userId }: { userId: string; }) {
    return this.prisma.transaction.findMany({
        where: {
            userId
        }
    });
  }
  
  public async create({ userId }: { userId: string; }) {
    return this.prisma.wallet.create({
        data: {
            userId,
        }
    });
  }

  public async saveTransaction({ transaction } : { transaction: Transaction }) {
    return this.prisma.$transaction(async (prisma) => {
      await prisma.wallet.update({
        where: {
          userId: transaction.userId
        },
        data: {
          balance: {
            increment: transaction.amount
          }
        }
      })
      await prisma.tracking.create({
        data: transaction
      });
    })
     
  }
}

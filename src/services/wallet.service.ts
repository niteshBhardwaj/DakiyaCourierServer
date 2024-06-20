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
      const { userId, transactionType, amount } = transaction;
      const isCredit = transactionType === TransactionType.Credit;
      const isDebit = transactionType === TransactionType.Debit;
      let updateWalletData;
      if(isCredit) {
        updateWalletData = {
          balance: {
            increment: transaction.amount
          }
        }
      } else if(isDebit) {
        updateWalletData = {
          balance: {
            decrement: transaction.amount
          }
        }
      }
         // 1. Increment/Decrement amount from the sender.
      const wallet = await prisma.wallet.update({
        data: updateWalletData,
        where: {
          userId,
        },
      })

      if(!wallet) {
        throw new Error(`Wallet for ${userId} not found`)
      }

      // 2. Verify that the sender's balance didn't go below zero.
      if(isDebit && wallet.balance < 0) {
        throw new Error(`User doesn't have enough amount ${amount}`)
      }

      await prisma.tracking.create({
        data: {
          walletId: wallet.id,
          ...transaction,
        }
      });
    })
     
  }
}

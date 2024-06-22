import { Service, Inject } from 'typedi';
import { EventDispatcher, EventDispatcherInterface } from '~/decorators/eventDispatcher';
import LoggerInstance from '~/plugins/logger';
import { PrismaClient, Transaction, TransactionType, Wallet } from '@prisma/client';

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
            balance: 0
        }
    });
  }

  public async checkWalletBalance ({ userId, amount }: { userId: string; amount: number }) {
    const wallet = await this.prisma.wallet.findUnique({
      where: {
        userId
      },
      select: {
        balance: true
      }
    })
    if(wallet.balance < amount) {
      return false
    }
    return true
  }

  public async updateTransaction({ data, id }: { data: Partial<Transaction>; id: string }) {
    return this.prisma.transaction.update({
      where: {
        id
      },
      data
    })
  }

  public async updateWalletAndSaveTransaction(transaction: Pick<Transaction, 'userId' | 'type' | 'amount' | 'orderId' | 'description'>) {
    return this.prisma.$transaction(async (prisma) => {
      const { type, amount, userId } = transaction;
      const isCredit = type === TransactionType.Credit;
      const isDebit = type === TransactionType.Debit;
      let updateWalletData;
      if(isCredit) {
        updateWalletData = {
          balance: {
            increment: amount
          }
        }
      } else if(isDebit) {
        updateWalletData = {
          balance: {
            decrement: amount
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
        throw new Error(`Wallet not found`)
      }

      // 2. Verify that the sender's balance didn't go below zero.
      if(isDebit && wallet.balance < 0) {
        throw new Error(`User doesn't have enough amount ${amount}`)
      }

      const newTransaction = await this.prisma.transaction.create({
        data: {
          walletId: wallet.id,
          closingBalance: wallet.balance,
          ...transaction
        }
      })

      return {
        transaction: newTransaction,
        wallet
      }

    })
     
  }
}

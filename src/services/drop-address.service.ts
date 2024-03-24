import LoggerInstance from '@/plugins/logger';
import { Service, Inject } from 'typedi';
import { EventDispatcher, EventDispatcherInterface } from '@/decorators/eventDispatcher';
import { PrismaClient } from '@prisma/client';
import { DropAddressInput } from '@/graphql-type/args/drop-address.input';

@Service()
export default class DropAddressService {
  constructor(
    @Inject('prisma') private prisma: PrismaClient,
    @Inject('logger') private logger: typeof LoggerInstance,
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
  ) {}

  public async getDropAddresses({ userId} : { userId: string }) {
    return this.prisma.dropAddress.findMany({
      where: {
        userId,
      }
    })
  }

  public async addDropAddress({ input, userId} : { input: DropAddressInput; userId: string }) {
    return this.prisma.dropAddress.create({
      data: {
        userId,
        ...input,
      }
    })
  }

  public async deleteDropAddress({ id, userId } : { id: string, userId: string }) {
    // TODO: delete drop address if not used in any order, otherwise mark it as inactive
    return this.prisma.dropAddress.delete({
      where: {
        id,
        userId
      }
    })
  }

  public async editDropAddress({ input, id, userId} : { input: DropAddressInput; id: string, userId: string }) {
    // TODO: update drop address if not used in any order, otherwise throw error 
    return this.prisma.dropAddress.update({
      where: {
        id,
        userId
      },
      data: {
        ...input,
      }
    })
  }
}

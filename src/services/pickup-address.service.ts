import LoggerInstance from '@/plugins/logger';
import { Service, Inject } from 'typedi';
import { EventDispatcher, EventDispatcherInterface } from '@/decorators/eventDispatcher';
import { PickupProvider, PrismaClient } from '@prisma/client';
import { PickupAddressInput } from '@/graphql-type/args/pickup-address.input';

@Service()
export default class PickupAddressService {
  constructor(
    @Inject('prisma') private prisma: PrismaClient,
    @Inject('logger') private logger: typeof LoggerInstance,
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
  ) {}

  public async getPickupAddresses({ userId} : { userId: string }) {
    return this.prisma.pickupAddress.findMany({
      where: {
        userId,
      }
    })
  }

  public async addPickupAddress({ input, userId} : { input: PickupAddressInput; userId: string }) {
    return this.prisma.pickupAddress.create({
      data: {
        userId,
        ...input,
      }
    })
  }

  public async deletePickupAddress({ id, userId } : { id: string, userId: string }) {
    // TODO: delete pickup address if not used in any order, otherwise mark it as inactive
    return this.prisma.pickupAddress.delete({
      where: {
        id,
        userId
      }
    })
  }

  public async editPickupAddress({ input, id, userId} : { input: PickupAddressInput; id: string, userId: string }) {
    // TODO: update pickup address if not used in any order, otherwise throw error 
    return this.prisma.pickupAddress.update({
      where: {
        id,
        userId
      },
      data: {
        ...input,
      }
    })
  }

  public async createPickupProvider({ data } : { data: PickupProvider }) {
    return this.prisma.pickupProvider.create({
      data: {
        ...data
      }
    })
  }

  public async updatePickupProvider({ updatedData, id } : { updatedData: PickupProvider; id: string }) {
    return this.prisma.pickupAddress.update({
      where: {
        id,
      },
      data: {
        ...updatedData,
      }
    })
  }
}

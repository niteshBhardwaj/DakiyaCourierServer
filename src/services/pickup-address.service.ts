import LoggerInstance from '@/plugins/logger';
import { Service, Inject } from 'typedi';
import { EventDispatcher, EventDispatcherInterface } from '@/decorators/eventDispatcher';
import { PickupProvider, PrismaClient } from '@prisma/client';
import { PickupAddressInput } from '@/graphql-type/args/pickup-address.input';
import { nanoid } from 'nanoid';
import { PickupAddressType } from '@/graphql-type/typedefs/pickup-address.type';
import OrderService from './order.service';
import { badUserInputException } from '@/utils/exceptions.util';
import { USER_ERROR_KEYS } from '@/constants';

@Service()
export default class PickupAddressService {
  constructor(
    @Inject('prisma') private prisma: PrismaClient,
    @Inject('logger') private logger: typeof LoggerInstance,
    private orderService: OrderService,
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
  ) { }

  public async getPickupAddresses({ userId }: { userId: string }) {
    return this.prisma.pickupAddress.findMany({
      where: {
        isDeleted: false,
        userId,
      }
    }) as Promise<PickupAddressType[]>
  }

  public async addPickupAddress({ input, userId }: { input: PickupAddressInput; userId: string }) {
    return this.prisma.pickupAddress.create({
      data: {
        pickupId: nanoid(),
        userId,
        ...input,
      }
    }) as Promise<PickupAddressType>
  }

  public async deletePickupAddress({ id, userId }: { id: string, userId: string }) {
    try {
      const orderCount = await this.orderService.getOrderCount({
        userId,
        where: {
          pickupId: id
        }
      })
      if (orderCount > 0) {
        await this.prisma.pickupAddress.update({
          where: {
            id,
            userId
          },
          data: {
            isDeleted: false
          }
        })
      } else {
        await this.prisma.pickupAddress.delete({
          where: {
            id,
            userId
          },
        })
      }
    } catch (error) {
      this.logger.error(error);
      throw badUserInputException(USER_ERROR_KEYS.INVALID_REQUEST);
    }
  }

  public async editPickupAddress({ input, userId }: { input: { id: string; updatedData: PickupAddressInput }, userId: string }) {
    const { id, updatedData } = input
    try {
      const orderCount = await this.orderService.getOrderCount({
        userId,
        where: {
          pickupId: id
        }
      })
      const isOrderExist = orderCount > 0;
      let data = await this.prisma.pickupAddress.update({
          where: {
            id,
            userId
          },
          data: isOrderExist ? {
            isDeleted: false
          } : updatedData
        }) as PickupAddressType
       if(isOrderExist) {
         data = await this.addPickupAddress({ input: updatedData, userId }) as PickupAddressType;
       }
       return {
        isNew: isOrderExist,
        data
       }
    } catch (error) {
      this.logger.error(error);
      throw badUserInputException(USER_ERROR_KEYS.INVALID_REQUEST);
    }
  }

  public async createPickupProvider({ data }: { data: PickupProvider }) {
    return this.prisma.pickupProvider.create({
      data: {
        ...data
      }
    })
  }

  public async updatePickupProvider({ data, id }: { data: PickupProvider, id: string }) {
    return this.prisma.pickupProvider.update({
      where: {
        id
      },
      data: {
        ...data
      }
    })
  }

}

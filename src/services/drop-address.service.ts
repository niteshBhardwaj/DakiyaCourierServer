import LoggerInstance from '~/plugins/logger';
import { Service, Inject } from 'typedi';
import { EventDispatcher, EventDispatcherInterface } from '~/decorators/eventDispatcher';
import { PrismaClient } from '@prisma/client';
import OrderService from './order.service';
import { badUserInputException } from '~/utils/exceptions.util';
import { USER_ERROR_KEYS } from '~/constants';
import { DropAddressInput } from '~/graphql-type/args/drop-address.input';
import { DropAddressType } from '~/graphql-type/typedefs/drop-address.type';

@Service()
export default class DropAddressService {
  constructor(
    @Inject('prisma') private prisma: PrismaClient,
    @Inject('logger') private logger: typeof LoggerInstance,
    private orderService: OrderService,
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
  ) { }

  public async getDropAddresses({ userId }: { userId: string }) {
    return this.prisma.dropAddress.findMany({
      where: {
        isDeleted: false,
        userId,
      }
    }) as Promise<DropAddressType[]>
  }

  public async addDropAddress({ input, userId }: { input: DropAddressInput; userId: string }) {
    return this.prisma.dropAddress.create({
      data: {
        userId,
        ...input,
      }
    }) as Promise<DropAddressType>
  }

  public async deleteDropAddress({ id, userId }: { id: string, userId: string }) {
    try {
      const orderCount = await this.orderService.getOrderCount({
        userId,
        where: {
          dropId: id
        }
      })
      if (orderCount > 0) {
        await this.prisma.dropAddress.update({
          where: {
            id,
            userId
          },
          data: {
            isDeleted: true
          }
        })
      } else {
        await this.prisma.dropAddress.delete({
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

  public async editDropAddress({ input, userId }: { input: { id: string; updatedData: DropAddressInput }, userId: string }) {
    const { id, updatedData } = input
    try {
      const orderCount = await this.orderService.getOrderCount({
        userId,
        where: {
          dropId: id
        }
      })
      const isOrderExist = orderCount > 0;
      let data = await this.prisma.dropAddress.update({
          where: {
            id,
            userId
          },
          data: isOrderExist ? {
            isDeleted: true
          } : updatedData
        }) as DropAddressType
       if(isOrderExist) {
         data = await this.addDropAddress({ input: updatedData, userId }) as DropAddressType;
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


}

import LoggerInstance from '@/plugins/logger';
import { Service, Inject } from 'typedi';
import { EventDispatcher, EventDispatcherInterface } from '@/decorators/eventDispatcher';
import { ApiType, Order, PrismaClient } from '@prisma/client';
import { CourierIdInput } from '@/graphql-type/args/courier-partner.input';
import { badRequestException } from '@/utils/exceptions.util';
import { getPincodeFromService } from '@/utils/load-pincode.util';

@Service()
export default class CourierPartnerService {
  constructor(
    @Inject('prisma') private prisma: PrismaClient,
    @Inject('logger') private logger: typeof LoggerInstance,
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
  ) { }

  public async loadPincode({ courierId }: CourierIdInput) {
    const courierApiConfig = await this.prisma.apiConfig.findFirst({
      where: {
        courierId,
        type: ApiType.PincodeServicebility
      },
      include: {
        courierPartner: true
      }
    })
    if (!courierApiConfig) {
      throw badRequestException('Courier not found');
    }
    try {
      const data = await getPincodeFromService(courierApiConfig);
      if (data?.length) {
        await this.prisma.pincodeAvailability.deleteMany({
          where: {
            courierId
          }
        })
        await this.prisma.pincodeAvailability.createMany({
          data
        })
      }
    } catch (e) {
      console.log(e)
      throw badRequestException('Something went wrong, while created pincode');
    }
    return;
  }

  public async createOrder({ order, courierId }: { order: Order, courierId: string }) {
    const dataCollection = { order, courierId } as Record<string, any>;
    const apiConfig = await this.prisma.apiConfig.findMany({
      where: {
        courierId
      },
      include: {
        courierPartner: true
      }
    })
    if (!apiConfig) {
      throw badRequestException('Courier not found');
    }
    dataCollection.apiConfig = apiConfig;
    const orderApi = apiConfig.find((config) => config.type === ApiType.Order);
    if (!orderApi) {
      throw badRequestException('Order api not found');
    }
    dataCollection.orderApi = orderApi;
    
  }

}

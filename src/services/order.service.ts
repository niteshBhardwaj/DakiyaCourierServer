import LoggerInstance from '@/plugins/logger';
import { Service, Inject } from 'typedi';
import { EventDispatcher, EventDispatcherInterface } from '@/decorators/eventDispatcher';
import { type Order, OrderStatus, PrismaClient } from '@prisma/client';
import { CreateOrderInput } from '@/graphql-type/args/order.input';
import { badRequestException } from '@/utils/exceptions.util';
import { createOrderSelector } from '@/db-selectors/order.selector';
import CourierPartnerService from './courier-partners.service';
import CounterService from './counter.service';

@Service()
export default class OrderService {
  constructor(
    @Inject('prisma') private prisma: PrismaClient,
    @Inject('logger') private logger: typeof LoggerInstance,
    @Inject() private courierPartnerService: CourierPartnerService,
    @Inject() private counterService: CounterService,
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
  ) {}

  public async getOrderCount({ userId, where } : { userId: string, where?: Record<string, any> }) {
    return this.prisma.order.count({
      where: {
        userId,
        ...where
      }
    })
  }
  public async getOrderList({ input, userId} : { input: CreateOrderInput; userId: string }) {
    return this.prisma.order.findMany({
      where: {
        userId,
      }
    })
  }

  public async createOrder({ input, userId} : { input: CreateOrderInput; userId: string }) {
    const courier = await this.prisma.courierPartner.findFirst();
    const courierId = courier?.id
    const { orderId, awb } = (await this.counterService.generateAwbAndOrderId({ count: 1 }))[0];
    const order = await this.prisma.order.create({
      data: {
        userId,
        orderId,
        awb,
        ...input,
        status: OrderStatus.Manifested,
      },
      select: createOrderSelector
    })
    if(!courierId) {
      throw badRequestException('Courier not found');
    }
    this.courierPartnerService.createOrder({ order, courierId })
  }

  public async editOrder({ input, userId} : { input: CreateOrderInput; userId: string }) {
    return this.prisma.order.update({
      where: {
        id: "",
        userId
      },
      data: {
        userId,
        ...input,
      }
    })
  }

  public async updateOrder({ data, id} : { data: Order; id: string }) {
    return this.prisma.order.update({
      where: {
        id
      },
      data
    })
  }

}

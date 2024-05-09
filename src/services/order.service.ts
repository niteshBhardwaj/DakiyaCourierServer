import LoggerInstance from '@/plugins/logger';
import { Service, Inject } from 'typedi';
import { EventDispatcher, EventDispatcherInterface } from '@/decorators/eventDispatcher';
import { type Order, OrderStatus, PrismaClient } from '@prisma/client';
import { CreateOrderInput } from '@/graphql-type/args/order.input';
import { badRequestException } from '@/utils/exceptions.util';
import { createOrderSelector } from '@/db-selectors/order.selector';
import CourierPartnerService from './courier-partners.service';
import CounterService from './counter.service';
import { OrderType } from '@/graphql-type/typedefs/order.type';
import { PrismaSelect } from '@paljs/plugins/dist/select';
import { ParameterDecorator } from 'type-graphql';

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
  public async getOrderList({ input, userId} : { input: any; userId: string }, info: ParameterDecorator) {
    const { take = 10, skip = 0 } = input
    const select = new PrismaSelect(info as any).value
    const orders = await this.prisma.order.findMany({
      where: {
        userId,
      },
      take,
      skip,
      ...select
    })
    return orders as unknown as OrderType[]
  }

  public async createOrder({ input, userId} : { input: CreateOrderInput; userId: string }, info: ParameterDecorator) {
    const select = new PrismaSelect(info as any).value
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
      ...select
    })
    if(!courierId) {
      throw badRequestException('Courier not found');
    }
    this.courierPartnerService.createOrder({ order, courierId })
    return order as unknown as OrderType;
  }

  public async editOrder({ input, userId} : { input: CreateOrderInput; userId: string }, info: ParameterDecorator) {
    const select = new PrismaSelect(info as any).value
    const order = await this.prisma.order.update({
      where: {
        id: "",
        userId
      },
      data: {
        userId,
        ...input,
      },
      ...select
    }) as unknown as OrderType
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

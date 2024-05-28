import LoggerInstance from '~/plugins/logger';
import { Service, Inject } from 'typedi';
import { EventDispatcher, EventDispatcherInterface } from '~/decorators/eventDispatcher';
import { type Order, OrderStatus, PrismaClient } from '@prisma/client';
import { CreateOrderInput, OrderDetailInput } from '~/graphql-type/args/order.input';
import { badRequestException, badUserInputException } from '~/utils/exceptions.util';
import CourierPartnerService from './courier-partners.service';
import CounterService from './counter.service';
import { OrderType } from '~/graphql-type/typedefs/order.type';
import { PrismaSelect } from '@paljs/plugins/dist/select';
import { GraphQLResolveInfo } from 'graphql';
import { createOrderSelector } from '~/db-selectors/order.selector';
import { OffsetInput } from '~/graphql-type/args/common.input';

@Service()
export default class OrderService {
  constructor(
    @Inject('prisma') private prisma: PrismaClient,
    @Inject('logger') private logger: typeof LoggerInstance,
    @Inject() private courierPartnerService: CourierPartnerService,
    @Inject() private counterService: CounterService,
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
  ) {}

  public async getOrderDetail({ input, userId }: { input: OrderDetailInput, userId: string}, info: GraphQLResolveInfo) {
    const select = new PrismaSelect(info as any).value
    const where = {} as Record<string, any>;
    if(!(input.awb || input.courierId)) {
      throw badRequestException('Please provide awb id.')
    }
    if(input.courierId) {
      where.id = input.courierId;
    } else if(input.awb) {
      where.awb = input.awb;
    }

    // TODO:// remove some of the field if user is not logged in;

    const data = await this.prisma.order.findFirst({
      where,
      ...select
    })

    if(!data) {
      throw badUserInputException('Courier not found.')
    }
    return data as unknown as OrderType;
  }

  public async getOrderCount({ userId, where } : { userId: string, where?: Record<string, any> }) {
    
    return this.prisma.order.count({
      where: {
        userId,
        ...where
      }
    })
  }
  public async getOrderList({ input, userId} : { input: OffsetInput; userId: string }, info: GraphQLResolveInfo) {
    const { take = 10, skip = 0 } = input
    const select = new PrismaSelect(info as any).value
    const orders = await this.prisma.order.findMany({
      where: {
        userId,
      },
      take,
      skip,
      orderBy: { createdAt: 'desc' },
      ...select
    })
    return orders as unknown as OrderType[]
  }

  public async createOrder({ input, userId} : { input: CreateOrderInput; userId: string }, info: GraphQLResolveInfo) {
    const select = new PrismaSelect(info as any).value
    const courier = await this.prisma.courierPartner.findFirst();
    const courierId = courier?.id
    const { orderId, awb } = (await this.counterService.generateAwbAndOrderId({ count: 1 }))[0];
    let order;
    try {
    order = await this.prisma.order.create({
      data: {
        userId,
        orderId,
        awb,
        ...input,
        status: OrderStatus.Manifested,
      },
      select: createOrderSelector
    })
    } catch(e) {
      console.log(e)
      throw badUserInputException('Order creation failed')
    }
    if(!courierId) {
      throw badRequestException('Courier not found');
    }
    this.courierPartnerService.createOrder({ order, courierId })
    return order as unknown as OrderType;
  }

  public async editOrder({ input, userId} : { input: CreateOrderInput; userId: string }, info: GraphQLResolveInfo) {
    const select = new PrismaSelect(info).value
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
    }) 
    return order as unknown as OrderType
  }

  public async getTracking({ input } : { input: OrderDetailInput, userId: string; }, info: GraphQLResolveInfo) {

    const order = await this.prisma.order.findFirst({
      where: {
        id: input.courierId
      },
      select: {
        id: true,
        createdAt: true,
        currentStatusExtra: true,
        courierId: true,
        waybill: true,
        tracking: {
          orderBy: {
            dateTime: 'asc'
          }
        }
      }
    })

    if(!order) {
      throw badUserInputException('Order not found')
    }
    const data = await this.courierPartnerService.getTracking({ orders: [{ id: order.id, waybill: order.waybill, lastStatusDateTime: order?.currentStatusExtra?.dateTime ?? order.createdAt  }], courierId: order.courierId });
    console.log(data);
    return order.tracking
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

import LoggerInstance from '@/plugins/logger';
import { Service, Inject } from 'typedi';
import { EventDispatcher, EventDispatcherInterface } from '@/decorators/eventDispatcher';
import { Order, OrderStatus, PrismaClient } from '@prisma/client';
import { CreateOrderInput } from '@/graphql-type/args/order.input';
import CourierPartnerService from './courier-partners.service';
import { badRequestException } from '@/utils/exceptions.util';

@Service()
export default class OrderService {
  constructor(
    @Inject('prisma') private prisma: PrismaClient,
    @Inject('logger') private logger: typeof LoggerInstance,
    @Inject() private courierPartnerService: CourierPartnerService,
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
  ) {}

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
    const order = await this.prisma.order.create({
      data: {
        userId,
        ...input,
        status: OrderStatus.Manifested,
      },
      select: {
        id: true,
        orderId: true,
        pickupId: true,
        dropId: true,
        paymentMode: true,
        shippingMode: true,
        weight: true,
        isFragile: true,
        boxHeight: true,
        boxWidth: true,
        boxLength: true,
        codAmount: true,
        totalAmount: true,
        products: true,
        courierId: true,
        pickupAddress: {
          include: {
            pickupProvider: true
          },
        },
        dropAddress: true,
      }
    })
    if(!courierId) {
      throw badRequestException('Courier not found');
    }
    this.courierPartnerService.createOrder({ order, courierId })
  }

  public async editOrder({ input, userId} : { input: CreateOrderInput; userId: string }) {
    return this.prisma.order.update({
      where: {
        id: input.orderId,
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

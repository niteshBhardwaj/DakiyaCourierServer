import LoggerInstance from '@/plugins/logger';
import { Service, Inject } from 'typedi';
import { EventDispatcher, EventDispatcherInterface } from '@/decorators/eventDispatcher';
import { OrderStatus, PrismaClient } from '@prisma/client';
import { CreateOrderInput } from '@/graphql-type/args/order.input';

@Service()
export default class OrderService {
  constructor(
    @Inject('prisma') private prisma: PrismaClient,
    @Inject('logger') private logger: typeof LoggerInstance,
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
  ) {}

  public async createOrder({ input, userId} : { input: CreateOrderInput; userId: string }) {
    return this.prisma.order.create({
      data: {
        userId,
        ...input,
        status: OrderStatus.Manifested,
      }
    })
  }

}

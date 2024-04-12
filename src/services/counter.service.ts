import LoggerInstance from '@/plugins/logger';
import { Service, Inject } from 'typedi';
import { EventDispatcher, EventDispatcherInterface } from '@/decorators/eventDispatcher';
import { CounterType, PrismaClient } from '@prisma/client';
import { getAwbAndOrderUtil } from '@/utils/order.util';

@Service()
export default class CounterService {
  constructor(
    @Inject('prisma') private prisma: PrismaClient,
    @Inject('logger') private logger: typeof LoggerInstance,
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
  ) {}

  public async generateAwbAndOrderId({ count = 1 } : { count?: number; }) {
    const result = await this.prisma.counter.upsert({
        where: { name: CounterType.AWB },
        update: { value: { increment: count } },
        create: { name: CounterType.AWB, value: 1 }, 
      });
    const awbCount = result.value;
    return getAwbAndOrderUtil(count, awbCount);
  }

 

}

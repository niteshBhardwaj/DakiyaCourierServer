import LoggerInstance from '@/plugins/logger';
import { Service, Inject } from 'typedi';
import { EventDispatcher, EventDispatcherInterface } from '@/decorators/eventDispatcher';
import { Order, PrismaClient } from '@prisma/client';
import { CourierIdInput } from '@/graphql-type/args/courier-partner.input';


@Service()
export default class CourierPartnerService {
  constructor(
    @Inject('prisma') private prisma: PrismaClient,
    @Inject('logger') private logger: typeof LoggerInstance,
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
  ) { }

  public async loadPincode({ courierId }: CourierIdInput) {

  }

  public async createOrder({ order, courierId }: { order: Order, courierId: string }) {

  }

}

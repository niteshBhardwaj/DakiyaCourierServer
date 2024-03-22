import LoggerInstance from '@/plugins/logger';
import { Service, Inject } from 'typedi';
import { EventDispatcher, EventDispatcherInterface } from '@/decorators/eventDispatcher';
import { ApiType, OrderStatus, PaymentMode, PrismaClient, ShippingMode } from '@prisma/client';
import { CourierIdInput } from '@/graphql-type/args/courier-partner.input';

@Service()
export default class CourierPartnerService {
  constructor(
    @Inject('prisma') private prisma: PrismaClient,
    @Inject('logger') private logger: typeof LoggerInstance,
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
  ) {}

  public async createOrder({  }: CourierIdInput) {
    this.prisma.order.create({
      data: {
        userId: '',
        courierId: '',
        pickupId: '',
        dropId: '',
        paymentMode: PaymentMode.Prepaid,
        shippingMode: ShippingMode.Surface,
        weight: 0,
        isFragile: false,
        boxHeight: 0,
        boxWidth: 0,
        boxLength: 0,
        codAmount: 0,
        totalAmount: 0,
        products: [],
        status: OrderStatus.Manifested,
      }
    })
  }

}

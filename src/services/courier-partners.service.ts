import LoggerInstance from '@/plugins/logger';
import { Service, Inject } from 'typedi';
import { EventDispatcher, EventDispatcherInterface } from '@/decorators/eventDispatcher';
import { CourierPartner, Order, PrismaClient } from '@prisma/client';
import { CourierIdInput } from '@/graphql-type/args/courier-partner.input';
import { badRequestException } from '@/utils/exceptions.util';

@Service()
export default class CourierPartnerService {
  constructor(
    @Inject('prisma') private prisma: PrismaClient,
    @Inject('logger') private logger: typeof LoggerInstance,
    @Inject('courierPartners') private courierPartners: CourierPartner[],
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
  ) { }

  public async getAllCourierInfo() {
    const courierPartners = await this.prisma.courierPartner.findMany({
      where: { isActive: true },
    });
    return courierPartners;
  }

  public async findCourierPartnerById({ courierId }: { courierId: string }) {
      if(!this.courierPartners) {
        this.courierPartners = await this.getAllCourierInfo();
      }
      const courier = this.courierPartners.find((courier) => courier.id === courierId);
      if(!courier) {
        throw badRequestException('Courier not found');
      }
      return courier;
  }

  public async loadPincode({ courierId }: CourierIdInput) {
    const courierPartnerInfo = await this.findCourierPartnerById({ courierId });
    this.eventDispatcher.dispatch(`${courierPartnerInfo.slug}.loadPincode`, { courierPartnerInfo });
  }

  public async createOrder({ order, courierId }: { order: Partial<Order>, courierId: string }) {
    const courierPartnerInfo = await this.findCourierPartnerById({ courierId });
    const dataCollection = { order, courierPartnerInfo } as Record<string, any>;
    this.eventDispatcher.dispatch(`${courierPartnerInfo.slug}.createOrder`, dataCollection);
  }

  public async updateOrder({ order, courierId }: { order: Order, courierId: string }) {
    const courierPartnerInfo = await this.findCourierPartnerById({ courierId });
    const dataCollection = { order, courierPartnerInfo } as Record<string, any>;
    this.eventDispatcher.dispatch(`${courierPartnerInfo.slug}.udpateOrder`, dataCollection);
  }

  public async getTracking({ order, courierId }: { order: Order, courierId: string }) {
    const courierPartnerInfo = await this.findCourierPartnerById({ courierId });
    const dataCollection = { order, courierPartnerInfo } as Record<string, any>;
    this.eventDispatcher.dispatch(`${courierPartnerInfo.slug}.udpateOrder`, dataCollection);
  }

  public async pickupRequest({ pickupRequest, courierId }: { pickupRequest: Order, courierId: string }) {
    const courierPartnerInfo = await this.findCourierPartnerById({ courierId });
    const dataCollection = { pickupRequest, courierPartnerInfo } as Record<string, any>;
    this.eventDispatcher.dispatch(`${courierPartnerInfo.slug}.pickupRequest`, dataCollection);
  }

  public async ndrAction({ ndrInfo, courierId }: { ndrInfo: Order, courierId: string }) {
    const courierPartnerInfo = await this.findCourierPartnerById({ courierId });
    const dataCollection = { ndrInfo, courierPartnerInfo } as Record<string, any>;
    this.eventDispatcher.dispatch(`${courierPartnerInfo.slug}.ndrAction`, dataCollection);
  }

}

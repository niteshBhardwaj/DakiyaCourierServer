import LoggerInstance from '@/plugins/logger';
import { Service, Inject } from 'typedi';
import { EventDispatcher, EventDispatcherInterface } from '@/decorators/eventDispatcher';
import { type CourierPartner, type Order, PrismaClient } from '@prisma/client';
import { CourierIdInput } from '@/graphql-type/args/courier-partner.input';
import { badRequestException } from '@/utils/exceptions.util';
import { CourierSlugType, EVENTS_ACTIONS, checkEventAvailability, getCourierEvent } from '@/external/events';

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
      // where: { isActive: true },
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
    const event = getCourierEvent(courierPartnerInfo.slug as CourierSlugType, EVENTS_ACTIONS.LOAD_PINCODE);
    if(!event) {
      return;
    }
    this.eventDispatcher.dispatch(event, { courierPartnerInfo });
  }

  public async createOrder({ order, courierId }: { order: Partial<Order>, courierId: string }) {
    const courierPartnerInfo = await this.findCourierPartnerById({ courierId });
    const event = getCourierEvent(courierPartnerInfo.slug as CourierSlugType, EVENTS_ACTIONS.CREATE_ORDER);
    if(!event) {
      return;
    }
    const dataCollection = { order, courierPartnerInfo };
    this.eventDispatcher.dispatch(event, dataCollection);
  }

  public async updateOrder({ order, courierId }: { order: Order, courierId: string }) {
    const courierPartnerInfo = await this.findCourierPartnerById({ courierId });
    const event = getCourierEvent(courierPartnerInfo.slug as CourierSlugType, EVENTS_ACTIONS.UPDATE_ORDER);
    if(!event) {
      return;
    }
    const dataCollection = { order, courierPartnerInfo } as Record<string, any>;
    this.eventDispatcher.dispatch(event, dataCollection);
  }

  public async getTracking({ order, courierId }: { order: Order, courierId: string }) {
    const courierPartnerInfo = await this.findCourierPartnerById({ courierId });
    const event = getCourierEvent(courierPartnerInfo.slug as CourierSlugType, EVENTS_ACTIONS.TRACKING);
    if(!event) {
      return;
    }
    const dataCollection = { order, courierPartnerInfo } as Record<string, any>;
    this.eventDispatcher.dispatch(event, dataCollection);
  }

  public async pickupRequest({ pickupRequest, courierId }: { pickupRequest: Order, courierId: string }) {
    const courierPartnerInfo = await this.findCourierPartnerById({ courierId });
    const event = getCourierEvent(courierPartnerInfo.slug as CourierSlugType, EVENTS_ACTIONS.PICKUP_REQUEST);
    if(!event) {
      return;
    }
    const dataCollection = { pickupRequest, courierPartnerInfo } as Record<string, any>;
    this.eventDispatcher.dispatch(event, dataCollection);
  }

  public async ndrAction({ ndrInfo, courierId }: { ndrInfo: Order, courierId: string }) {
    const courierPartnerInfo = await this.findCourierPartnerById({ courierId });
    const event = getCourierEvent(courierPartnerInfo.slug as CourierSlugType, EVENTS_ACTIONS.NDR_ACTION);
    if(!event) {
      return;
    }
    const dataCollection = { ndrInfo, courierPartnerInfo } as Record<string, any>;
    this.eventDispatcher.dispatch(event, dataCollection);
  }

}

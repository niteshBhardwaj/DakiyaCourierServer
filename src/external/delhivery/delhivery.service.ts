import LoggerInstance from '@/plugins/logger';
import { Service, Inject } from 'typedi';
import { EventDispatcher, EventDispatcherInterface } from '@/decorators/eventDispatcher';
import { CourierPartner, Order, PickupAddress, PickupProvider, PrismaClient } from '@prisma/client';
import { createOrder, createPickupRequest, createWarehouse, getPincodeSericeability, updateWarehouse } from './delhivery.utils';
import { EVENTS } from '@/constants';


@Service('delhivery')
export default class CourierPartnerService {
  constructor(
    @Inject('prisma') private prisma: PrismaClient,
    @Inject('logger') private logger: typeof LoggerInstance,
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
  ) { }

  public async createOrUpdateWarehouse({ pickupAddress }: { pickupAddress: PickupAddress & { pickupProvider: PickupProvider } }) {
    const { pickupProvider } = pickupAddress
    if(!pickupProvider) {
      await createWarehouse({ warehouseData: pickupAddress })
      // update pickup provider
      return { isCreated: true }
    } else {
      if(pickupProvider.updatedAt < pickupAddress.updatedAt) {
        await updateWarehouse({ warehouseData: pickupAddress });
        // update pickup providers
        return { isUpdated: true }
      }
      return;
    }
  }

  public async createPickup({ pickupProvider }: { pickupProvider: PickupProvider }) {
    const lastPickupDate = pickupProvider?.lastRequestTime;
    if(lastPickupDate && !isTodayDate(lastPickupDate)) {
      const new
      const data = await createPickupRequest({ pickupData: {
        pickupTime: '',
        pickupDate: '',
        pickupLocation: '',
        packageCount: ''
      } })
      return 
    }
    return;
  }

  public async loadPincode({ courierPartnerInfo }: { courierPartnerInfo: CourierPartner }) {
    try {
      const { id: courierId } = courierPartnerInfo
      const data = await getPincodeSericeability({ courierId });
      if (data?.length) {
        await this.prisma.pincodeAvailability.deleteMany({
          where: {
            courierId
          }
        })
        await this.prisma.pincodeAvailability.createMany({
          data
        })
      }
    } catch (e) {
      console.log(e)
    }
  }

  public async createOrder({ order, courierId }: { order: Order & { pickAddress: PickupAddress & { pickupProvider: PickupProvider } }, courierId: string }) {
    // create or update wharehouse
    const wharehouseData = await this.createOrUpdateWarehouse({ pickupAddress: order.pickAddress })

    // create order
    const orderData = await createOrder({ orderData: order })

    // create pickup request
    if(order.pickAddress?.pickupProvider) {
      this.createPickup({ pickupAddress: order.pickAddress })
    }
    // update order info;

  }

}

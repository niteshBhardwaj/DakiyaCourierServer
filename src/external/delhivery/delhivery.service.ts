import LoggerInstance from '@/plugins/logger';
import { Service, Inject } from 'typedi';
import { EventDispatcher, EventDispatcherInterface } from '@/decorators/eventDispatcher';
import { CourierPartner, Order, PickupAddress, PickupProvider, PrismaClient } from '@prisma/client';
import { createOrder, createPickupRequest, createWarehouse, getPincodeSericeability, updateWarehouse } from './utils/http.delhivery.utils';
import { EVENTS } from '@/constants';
import { PickupResponseType } from './delhivery.type';
import { checkPickupForGivenDate } from './utils/pickup.delhivery.utils';
import dayjs from 'dayjs';
import { isArray } from 'class-validator';
import { createFutureDate } from '@/utils/date.utils';
import { DateType } from '@/types/common.type';


@Service('delhivery')
export default class CourierPartnerService {
  constructor(
    @Inject('prisma') private prisma: PrismaClient,
    @Inject('logger') private logger: typeof LoggerInstance,
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
  ) { }
  
  public async loadPincode({ courierPartnerInfo }: { courierPartnerInfo: CourierPartner }) {
    try {
      const { id: courierId } = courierPartnerInfo
      const data = await getPincodeSericeability({ courierId });

      // send event to update pincode's availability
      this.eventDispatcher.dispatch(EVENTS.PINCODE_AVAILABILITY.LOAD, {
        data,
        courierId
      })
    } catch (e) {
      console.log(e)
    }
  }
  
  public async createOrUpdateWarehouse({ pickupAddress }: { pickupAddress: PickupAddress & { pickupProvider: PickupProvider } }) {
    const { pickupProvider } = pickupAddress;
    if (!pickupProvider) {
      await createWarehouse({ warehouseData: pickupAddress })
      // update pickup provider
      return { isCreated: true }
    } else {
      if (pickupProvider.updatedAt < pickupAddress.updatedAt) {
        await updateWarehouse({ warehouseData: pickupAddress });
        // update pickup providers
        return { isUpdated: true }
      }
      return null;
    }
  }

  public async createPickup({ pickupProvider, pickupDate, count = 1 }: { pickupProvider: PickupProvider, pickupDate: DateType, count?: number }) {
    const pickupResponse = pickupProvider?.pickupResponse as PickupResponseType[] | null;
    if (checkPickupForGivenDate(pickupResponse, pickupDate)) {
      console.log('pickup already created for given date');
      return;
    }
    const newDate = dayjs(pickupDate);

    const data = await createPickupRequest({
      pickupData: {
        pickupTime: newDate.format('HH:mm:ss').toString(),
        pickupDate: newDate.format('YYYY/MM/DD').toString(),
        pickupLocation: pickupProvider.pickupAddressId,
        packageCount: count
      }
    })
    return data;
  }

  public async createOrder({ order, courierId }: { order: Order & { pickAddress: PickupAddress & { pickupProvider: PickupProvider } }, courierId: string }) {
    // create or update wharehouse
    const wharehouseData = await this.createOrUpdateWarehouse({ pickupAddress: order.pickAddress })

    // create order
    const { data: responseData, orderData } = await createOrder({ orderData: order })
    if (orderData) {
      const orderUpdatedData = {
          ...orderData.map(({ waybill }: { waybill: string }) => ({ waybill }))[0],
          courierId,
          courierResponseJson: responseData
      }

      const { pickupProvider } = order.pickAddress;
      const pickupResponse = pickupProvider?.pickupResponse;
      // update order response
      const pickupSaveData = isArray(pickupResponse) ? [...pickupResponse] : [];
      // create pickup request
      const pickupCreatedData = await this.createPickup({ pickupProvider: order.pickAddress?.pickupProvider, pickupDate: createFutureDate(10, 'minute') })
      if(!!pickupCreatedData) {
        pickupSaveData.push(pickupCreatedData)
      }
      // update pickupProvider 
      if(wharehouseData?.isCreated) {
        this.eventDispatcher.dispatch(EVENTS.PICKUP_PROVIDER.CREATED, {
          pickupAddressId: order.pickAddress.id,
          courierId: orderData.courierId,
          pickupResponse: pickupSaveData
        } as PickupProvider)
      } else {
        const updateData = {
          pickupResponse: pickupSaveData
        } as PickupProvider;
        if(wharehouseData?.isUpdated) {
          updateData.updatedAt = new Date();
        }
        this.eventDispatcher.dispatch(EVENTS.PICKUP_PROVIDER.UPDATED, {
          id: pickupProvider.id,
          updateData
        })
      }
      // update order after created
      this.eventDispatcher.dispatch(EVENTS.ORDER.UPDATE, {
        data: orderUpdatedData,
        id: order.id
      });
    }
  }

}

import LoggerInstance from '~/plugins/logger';
import { Service, Inject } from 'typedi';
import { EventDispatcher, EventDispatcherInterface } from '~/decorators/eventDispatcher';
import { type CourierPartner, type Order, type PickupAddress, type PickupProvider, PrismaClient } from '@prisma/client';
import { createOrder, createPickupRequest, createWarehouse, getPincodeServiceability as getPincodeServiceability, getTracking, updateWarehouse } from './utils/http.delhivery.utils';
import { EVENTS } from '~/constants';
import { PickupResponseType } from './delhivery.type';
import { checkPickupForGivenDate } from './utils/pickup.delhivery.utils';
import { isArray } from 'class-validator';
import { checkDateIsBefore, createFutureDate, getDateAndTimeByDate } from '~/utils/date.utils';
import { DateType } from '~/types/common.type';
import { GetTrackingType } from '~/types/order.type';
import { convertToArray } from '~/utils';


@Service()
export default class DelhiveryService {
  constructor(
    @Inject('prisma') private prisma: PrismaClient,
    @Inject('logger') private logger: typeof LoggerInstance,
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
  ) { }

  public async loadPincode({ id: courierId }: CourierPartner) {
    try {
      const data = await getPincodeServiceability({ courierId });

      // send event to update pincode's availability
      this.eventDispatcher.dispatch(EVENTS.PINCODE_AVAILABILITY.LOAD, {
        data,
        courierId
      })
    } catch (e) {
      console.log(e)
    }
  }

  public async createOrUpdateWarehouse({ pickupAddress }: { pickupAddress: PickupAddress & { pickupProvider: PickupProvider[] } }) {
    const pickupProvider = pickupAddress?.pickupProvider?.[0];
    if (!pickupProvider) {
      const { error } = await createWarehouse({ warehouseData: pickupAddress })
      if (error) {
        throw error
      }
      // update pickup provider
      return { isCreated: true }
    } else {
      if (checkDateIsBefore(pickupProvider.updatedAt, pickupAddress.updatedAt)) {
        const { error } = await updateWarehouse({ warehouseData: pickupAddress });
        if (error) {
          throw error
        }
        // update pickup providers
        return { isUpdated: true }
      }
      return null;
    }
  }

  public async createPickup({ pickupProvider, pickupId, pickupDate: date, count = 1 }: { pickupProvider: PickupProvider, pickupDate: DateType, count?: number; pickupId: string }) {
    const pickupResponse = pickupProvider?.pickupResponse as PickupResponseType[] | null;
    if (checkPickupForGivenDate(pickupResponse, date)) {
      console.log('pickup already created for given date');
      return;
    }
    const { date: pickupDate, time: pickupTime } = getDateAndTimeByDate(date);

    const { data } = await createPickupRequest({
      pickupData: {
        pickupTime,
        pickupDate,
        pickupLocation: pickupId,
        packageCount: count
      }
    })
    return data;
  }

  public async getTrackingDetails({ orders, resolve, resolveAll, ...otherOptions }: { orders: GetTrackingType[], resolve?: Function, resolveAll?: Function }) {
    const trackingMapping = orders.reduce((acc, data) => {
      acc[data.waybill] = data
      return acc
    }, {});
    const trackings = await getTracking({ waybill: Object.keys(trackingMapping).join(',') })
    if (trackings) {
      const ordersTracking = convertToArray(trackings).map((tracking) => {
        const orderInfo = trackingMapping[tracking.waybill];
        return {
          ...tracking,
          ...orderInfo,
          scans: convertToArray(tracking.scans).map((scan) => ({
            ...scan,
            dateTime: new Date(scan.dateTime),
            orderId: orderInfo.id
          }))
        }
      });

      this.eventDispatcher.dispatch(EVENTS.TRACKING.UPDATE, {
        ordersTracking,
        resolveAll,
        ...otherOptions
      })
      if (resolve) {
        resolve(ordersTracking)
      }
      return ordersTracking;
    } else {
      if (resolve) {
        resolve(null);
      }
      if(resolveAll) {
        resolveAll(null)
      }
      return null;
    }
  }

  public async createOrder({ order, courierPartner }: { order: Order & { pickupAddress: PickupAddress & { pickupProvider: PickupProvider[] } }, courierPartner: CourierPartner }) {
    const { id: courierId } = courierPartner;
    try {
      // create or update wharehouse
      const warehouseData = await this.createOrUpdateWarehouse({ pickupAddress: order.pickupAddress })
      // create order
      const { data: responseData, orderData } = await createOrder({ orderData: order })
      if (!orderData) {
        throw new Error(responseData)
      }

      const pickupProvider = order.pickupAddress.pickupProvider[0];
      const pickupResponse = pickupProvider?.pickupResponse;
      // update order response
      const pickupSaveData = isArray(pickupResponse) ? [...pickupResponse] : [];
      // create pickup request
      const pickupCreatedData = await this.createPickup({ pickupId: order.pickupAddress.pickupId, pickupProvider, pickupDate: createFutureDate(10, 'minute') })
      if (!!pickupCreatedData) {
        pickupSaveData.push(pickupCreatedData)
      }
      // update pickupProvider 
      if (warehouseData?.isCreated) {
        this.eventDispatcher.dispatch(EVENTS.PICKUP_PROVIDER.CREATED, {
          pickupAddressId: order.pickupAddress.id,
          courierId,
          pickupResponse: pickupSaveData
        } as PickupProvider)
      } else {
        const updateData = {
          pickupResponse: pickupSaveData
        } as PickupProvider;
        if (warehouseData?.isUpdated) {
          updateData.updatedAt = new Date();
        }
        this.eventDispatcher.dispatch(EVENTS.PICKUP_PROVIDER.UPDATED, {
          id: pickupProvider.id,
          updateData
        })
      }
      const packageList = orderData.map(({ waybill }) => ({ waybill })) as { waybill: string }[];
      const orderUpdatedData = {
        ...packageList[0],
        courierId,
        courierResponseJson: responseData
      }
      // get and update tracking details
      this.getTrackingDetails({ orders: packageList.map(orderItem => ({
        id: order.id,
        waybill: order.waybill, 
        lastChecked: order.currentStatusExtra?.lastChecked ?? order.createdAt, 
        lastStatusDateTime: order?.currentStatusExtra?.dateTime ?? order.createdAt,
        ...orderItem
      }))})

      // update order after created
      this.eventDispatcher.dispatch(EVENTS.ORDER.UPDATE, {
        data: orderUpdatedData,
        id: order.id
      });
    } catch (e) {
      console.log(e);
      console.log('failed to create order of courier', order.id, courierId);
    }
  }
}

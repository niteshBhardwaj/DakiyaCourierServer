import { Container } from 'typedi';
import { EventSubscriber, On } from 'event-dispatch';
import { EVENTS } from '~/constants';
import LoggerInstance from '~/plugins/logger';
import { Order } from '@prisma/client';
import OrderService from '~/services/order.service';
import { GetTrackingType, TrackingReceiveType } from '~/types/order.type';
import { checkDateIsBefore, isSameDate } from '~/utils/date.utils';
import { pickKeyFromObject } from '~/utils';

@EventSubscriber()
export default class PincodeSubscriber {
  orderService: OrderService;
  logger: typeof LoggerInstance;
  constructor() {
    this.logger = Container.get('logger');
    this.orderService = Container.get(OrderService);
  }

  @On(EVENTS.ORDER.UPDATE)
  public updateOrder({ data, id }: { data: Order; id: string }) {
    this.orderService.updateOrder({ data, id });
  }

  @On(EVENTS.TRACKING.UPDATE)
  public async updateTracking({ ordersTracking, resolveAll }: { ordersTracking: (GetTrackingType & TrackingReceiveType)[]; resolveAll?: Function }) {
    
    // update all orders status
    await this.orderService.updateMultipleOrders({
      orders: ordersTracking.map((order) => {
        const data = {
          reverseInTransit: order.reverseInTransit,
        } as Record<string, string | number | boolean | any>
        if(order.expectedDeliveryDate) {
          data.expectedDeliveryDate = order.expectedDeliveryDate
        }
        const lastScan = order.scans[order.scans.length - 1];
        if(lastScan && !isSameDate(lastScan.dateTime, order.lastStatusDateTime)) {  
          data.currentStatusExtra = {
            ...lastScan,
            lastChecked: new Date()
          }
          // delete id
          delete data.currentStatusExtra.orderId
        }
        return {
          where: {
            id: order.id
          },
          data
        }
      })
    })

    // update tracking
    let trackingList = [];
    ordersTracking.forEach(order => {
      const filterScans = order.scans.filter(scan => checkDateIsBefore(order.lastStatusDateTime, scan.dateTime));
      trackingList = trackingList.concat(filterScans)
    })
    await this.orderService.updateTracking({ trackingList }) 
    if(resolveAll) resolveAll(ordersTracking)
    // nexttracking
  }
}

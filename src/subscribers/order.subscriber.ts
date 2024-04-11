import { Container } from 'typedi';
import { EventSubscriber, On } from 'event-dispatch';
import { EVENTS } from '@/constants';
import LoggerInstance from '@/plugins/logger';
import PincodeService from '@/services/pincode.service';
import { Order } from '@prisma/client';
import OrderService from '@/services/order.service';

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
}

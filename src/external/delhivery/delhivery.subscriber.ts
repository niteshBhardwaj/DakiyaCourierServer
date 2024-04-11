import { Container } from 'typedi';
import { EventSubscriber, On } from 'event-dispatch';
import LoggerInstance from '@/plugins/logger';
import DelhiveryService from './delhivery.service';
import { EVENTS_ACTIONS, getDelhiveryEvent } from '../events';

const event = getDelhiveryEvent();

@EventSubscriber()
export default class DelhiverySubscriber {
  delhiveryService: DelhiveryService;
  logger: typeof LoggerInstance;
  name: string;
  constructor() {
    this.logger = Container.get('logger');
    this.delhiveryService = Container.get(DelhiveryService);
  }

  @On(event[EVENTS_ACTIONS.CREATE_ORDER])
  public createOrder(data: any) {
    this.delhiveryService.createOrder(data);
  }

  @On(event[EVENTS_ACTIONS.LOAD_PINCODE])
  public loadPincode(data: any) {
    this.delhiveryService.loadPincode(data);
  }

}

import { Container } from 'typedi';
import { EventSubscriber, On } from 'event-dispatch';
import LoggerInstance from '@/plugins/logger';
import DelhiveryService from './delhivery.service';

const prefix = 'delhivery'

@EventSubscriber()
export default class DelhiverySubscriber {
  delhiveryService: DelhiveryService;
  logger: typeof LoggerInstance;
  name: string;
  constructor() {
    this.logger = Container.get('logger');
    this.delhiveryService = Container.get(DelhiveryService);
  }

  @On(`${prefix}.createOrder`)
  public createOrder(data: any) {
    this.delhiveryService.createOrder(data);
  }

  @On(`${prefix}.loadPincode`)
  public loadPincode(data: any) {
    this.delhiveryService.loadPincode(data);
  }

}

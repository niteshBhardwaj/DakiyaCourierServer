import { Container } from 'typedi';
import { EventSubscriber, On } from 'event-dispatch';
import { EVENTS } from '~/constants';
import LoggerInstance from '~/plugins/logger';
import PincodeService from '~/services/pincode.service';
import { PincodeAvailability } from '@prisma/client';

@EventSubscriber()
export default class PincodeSubscriber {
  pincodeService: PincodeService;
  logger: typeof LoggerInstance;
  constructor() {
    this.logger = Container.get('logger');
    this.pincodeService = Container.get(PincodeService);
  }

  @On(EVENTS.PINCODE_AVAILABILITY.LOAD)
  public async loadPincode({ data, courierId, resolveAll }: { data: PincodeAvailability[]; courierId: string; resolveAll?: Function }) {
    await this.pincodeService.loadPincode({ data, courierId });
    if(resolveAll) resolveAll(true);
  }
}

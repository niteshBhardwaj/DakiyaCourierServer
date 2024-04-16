import { Container } from 'typedi';
import { EventSubscriber, On } from 'event-dispatch';
import { EVENTS } from '@/constants';
import LoggerInstance from '@/plugins/logger';
import { PickupProvider } from '@prisma/client';
import PickupAddressService from '@/services/pickup-address.service';

@EventSubscriber()
export default class PickupProviderSubscriber {
  pickupAddressService: PickupAddressService;
  logger: typeof LoggerInstance;
  constructor() {
    this.logger = Container.get('logger');
    this.pickupAddressService = Container.get(PickupAddressService);
  }

  @On(EVENTS.PICKUP_PROVIDER.CREATED)
  public createPickupProvider(data: PickupProvider) {
    this.pickupAddressService.createPickupProvider({ data })
  }

  @On(EVENTS.PICKUP_PROVIDER.UPDATED)
  public updatePickupProvider({ pickupAddressId, updateData, courierId }: {
    courierId: string;
    pickupAddressId: string;
    updateData: PickupProvider
  }) {
    this.pickupAddressService.updatePickupProvider({ data: updateData, id: pickupAddressId })
  }
}

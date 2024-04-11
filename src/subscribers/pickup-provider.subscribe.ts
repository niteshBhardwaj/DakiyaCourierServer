import { Container } from 'typedi';
import { EventSubscriber, On } from 'event-dispatch';
import { CountryCode, EVENTS } from '@/constants';
import LoggerInstance from '@/plugins/logger';
import SMSService from '@/services/sms.service';
import MailerService from '@/services/mailer.service';
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
    this.pickupAddressService.updatePickupProvider({ updatedData: updateData, id: pickupAddressId })
  }
}

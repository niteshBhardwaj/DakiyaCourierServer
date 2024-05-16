import { PAYMENT_MODE } from '~/constants/payment.constant';
// import WalletService from '~/services/wallet.service';
import { Container } from 'typedi';
import { EventSubscriber, On } from 'event-dispatch';
import { EVENTS, PAYMENT_SOURCE, EARN_TYPE } from '~/constants';
import LoggerInstance from '~/plugins/logger';

@EventSubscriber()
export default class PartnerSubscriber {
  // walletService: WalletService;
  // logger: typeof LoggerInstance;
  // constructor() {
  //   this.logger = Container.get('logger');
  //   this.walletService = Container.get(WalletService);
  // }

  
  // @On(EVENTS.PARTNER.CREATED)
  // public createWallet(partnerRecord: Required<PartnerType>) {
  //   const { userId, _id: partnerId } = partnerRecord;
  //   this.walletService.create({
  //      userId,
  //      partnerId
  //   });
  // }

  // @On(EVENTS.PACKAGE.DELIVERED)
  // public saveWallet(packageRecord: Required<PackageType>) {
  //   const { totalFare, paymentMode, _id, partnerId } = packageRecord;
  //   let type = paymentMode;
  //   if(type === PAYMENT_MODE.NONE) {
  //       type = PAYMENT_MODE.CASH
  //   }
  //   this.walletService.saveTransaction({
  //       amount: totalFare || 0, 
  //       type, 
  //       earnType: EARN_TYPE.WORK_EARN,
  //       source: {
  //           sourceId: _id.toString(),
  //           sourceName: PAYMENT_SOURCE.PACKAGE
  //       } 
  //   }, { userId: partnerId });
  // }
}

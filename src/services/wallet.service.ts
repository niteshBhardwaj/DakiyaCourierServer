// import { Service, Inject } from 'typedi';
// import { EventDispatcher, EventDispatcherInterface } from '@/decorators/eventDispatcher';
// import LoggerInstance from '@/plugins/logger';
// import { UserContext } from '@/interfaces/auth.interface';
// import { WalletResponse } from '@/graphql/typedefs/wallet.type';
// import { getGstinDetail, sendAadhaarOtpRequest, submitAadhaarOtp } from '@/utils/kyc.util';

// @Service()
// export default class WalletService {
//   constructor(
//     @Inject('logger') private logger: typeof LoggerInstance,
//     @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
//   ) {}

//   public async getWalletInfo({ userId }: UserContext ) {
//     // return await walletModel.find({ userId: userId }) as unknown as WalletResponse;
//     // await sendAadhaarOtpRequest({ aadhaarNumber: "262060607149" });
//     // await submitAadhaarOtp({
//     //   otp: 123456,
//     //   shareCode: '1234',
//     //   transactionId: 'c929135f-655f-4134-9d52-b2bc89a59053',
//     // });
//     await getGstinDetail({
//       gstin: '21AAXXXXXXXXXXX',
//       consent: 'Y',
//     });
//     return { totalEarn: 0 }
//   }
  
//   public async create({ userId, partnerId }: Pick<WalletType, "userId" | "partnerId">) {
//     return walletModel.create({
//       userId,
//       partnerId,
//       totalEarn: 0,
//     });
//   }

//   public async saveTransaction(transaction: TransactionType, { userId }: Pick<WalletType, "userId">) {
//     return walletModel.saveTransaction({
//       userId
//     },
//       transaction
//     );
//   }
// }

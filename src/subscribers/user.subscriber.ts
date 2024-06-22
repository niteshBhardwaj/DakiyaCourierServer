import { Container } from 'typedi';
import { EventSubscriber, On } from 'event-dispatch';
import { IUser } from '~/interfaces/user.interface';
import { EVENTS } from '~/constants';
import Logger from '~/plugins/logger';
import WalletService from '~/services/wallet.service';
import MailerService from '~/services/mailer.service';
import LoggerInstance from '~/plugins/logger';
import { User } from '@prisma/client';

@EventSubscriber()
export default class UserSubscriber {

  walletService: WalletService;
  mailerService: MailerService;
  logger: typeof LoggerInstance;
  constructor() {
    this.logger = Container.get('logger');
    this.walletService = Container.get(WalletService);
    this.mailerService = Container.get(MailerService);
  }
  
  // @On(EVENTS.USER.SIGNIN)
  // public onUserSignIn({ _id }: Partial<IUser>) {
  //   // const Logger: Logger = Container.get('logger');

  //   try {
  //     const UserModel = Container.get('UserModel') as mongoose.Model<IUser & mongoose.Document>;

  //     UserModel.updateOne({ _id }, { $set: { lastLogin: new Date() } });
  //   } catch (e) {
  //     Logger.error(`🔥 Error on event ${EVENTS.USER.SIGNIN}: %o`, e);    }
  // }

  @On(EVENTS.USER.SIGNUP)
  public onUserSignUp({ user }: { user: User }) {
    // const Logger: Logger = Container.get('logger');

    try {
      // Start your email sequence or whatever
      // MailService.startSequence('user.welcome', { email, name })

    } catch (e) {
      Logger.error(`🔥 Error on event ${EVENTS.USER.SIGNUP}: %o`, e);
    }
  }
}

import { Container } from 'typedi';
import { EventSubscriber, On } from 'event-dispatch';
import { IUser } from '@/interfaces/user.interface';
import { EVENTS } from '@/constants';
import Logger from '@/plugins/logger';

@EventSubscriber()
export default class UserSubscriber {
  /**
   * A great example of an event that you want to handle
   * save the last time a user signin, your boss will be pleased.
   *
   * Altough it works in this tiny toy API, please don't do this for a production product
   * just spamming insert/update to mongo will kill it eventualy
   *
   * Use another approach like emit events to a queue (rabbitmq/aws sqs),
   * then save the latest in Redis/Memcache or something similar
   */
  @On(EVENTS.USER.SIGNIN)
  public onUserSignIn({ _id }: Partial<IUser>) {
    // const Logger: Logger = Container.get('logger');

    try {
      const UserModel = Container.get('UserModel') as mongoose.Model<IUser & mongoose.Document>;

      UserModel.updateOne({ _id }, { $set: { lastLogin: new Date() } });
    } catch (e) {
      Logger.error(`🔥 Error on event ${EVENTS.USER.SIGNIN}: %o`, e);    }
  }

  @On(EVENTS.USER.SIGNUP)
  public onUserSignUp() {
    // const Logger: Logger = Container.get('logger');

    try {
      /**
       * @TODO implement this
       */
      // Call the tracker tool so your investor knows that there is a new signup
      // and leave you alone for another hour.
      // TrackerService.track('user.signup', { email, _id })
      // Start your email sequence or whatever
      // MailService.startSequence('user.welcome', { email, name })
    } catch (e) {
      Logger.error(`🔥 Error on event ${EVENTS.USER.SIGNUP}: %o`, e);
    }
  }
}

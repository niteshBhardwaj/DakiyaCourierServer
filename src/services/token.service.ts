import { EventDispatcher, EventDispatcherInterface } from '@/decorators/eventDispatcher';
import { Inject, Service } from 'typedi';
import keygen from 'keygen';
import jwt, { verify } from 'jsonwebtoken';
import LoggerInstance from '@/plugins/logger';
import { DataStoredInToken } from '@/interfaces/auth.interface';

@Service()
export default class TokenService {
  constructor(
    @Inject('logger') private logger: typeof LoggerInstance,
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
  ) {
  }
  private secretKey = 'config.jwtSecret';
  // Generates a unique token.
  public uniqueToken() {
    return keygen.url()
  }

  // Generates a token for the given user record.
  public generateToken(userRecord: UserType) {
    const today = new Date();
    const exp = new Date(today);
    //const partnerVerifiedState = !!userRecord.partnerFields?.isDocumentVerified;
    exp.setDate(today.getDate() + 60);
    this.logger.silly(`Sign JWT for userId: ${userRecord._id}`);
    return jwt.sign(
      {
        _id: userRecord._id, // We are gonna use this in the middleware 'isAuth'
        //_v: +partnerVerifiedState,
        _c: +userRecord.isConsumer,
        _p: +userRecord.isPartner,
        _t: userRecord.userType,
        exp: exp.getTime() / 1000,
      },
      this.secretKey, //TODO: get from config file;
    );
  }

  public async verifyToken(authorization: string): Promise<DataStoredInToken> {
    return (await verify(authorization, this.secretKey)) as DataStoredInToken;
  }
}
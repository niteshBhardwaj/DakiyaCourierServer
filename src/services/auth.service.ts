import LoggerInstance from '@/plugins/logger';
import { Service, Inject } from 'typedi';
import { EventDispatcher, EventDispatcherInterface } from '@/decorators/eventDispatcher';
import TokenService from './token.service';
import { EVENTS, USER_ERROR_KEYS, USER_TYPE } from '@/constants';
import { LoginSuccessResp } from '@/graphql/typedefs/auth.type';
import { CreateAccountInput, EmailPasswordInput, OtpVerifyInput } from '@/graphql/args/auth.input';
import { AdminLoginInput } from '@/graphql/args/users.input';
import { PrismaClient } from '@prisma/client';
import { badUserInputException } from '@/utils/exceptions.util';
import UserService from './user.service';
import { validateAndComparePassword } from '@/utils/password.util';

@Service()
export default class AuthService {
  constructor(
    @Inject('prisma') private prisma: PrismaClient,
    @Inject('logger') private logger: typeof LoggerInstance,
    private userService: UserService,
    private tokenService: TokenService,
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
  ) {}

  public async verifyEmailPassword(input: EmailPasswordInput): Promise<LoginSuccessResp> {
    const userRecord = await this.prisma.user.findFirst({
      where: {
        email: input.email,
        // password: input.password
      },
      select: {
        id: true,
        email: true,
        passwordHash: true,
        passwordSalt: true,
        userType: true,
      },
    });

    if (!userRecord) {
      throw badUserInputException(USER_ERROR_KEYS.NOT_FOUND);
    }
    const isMatch = await validateAndComparePassword(
      userRecord.passwordHash,
      userRecord.passwordSalt,
    );
    if (!isMatch) {
      throw badUserInputException(USER_ERROR_KEYS.INVALID_PASSWORD);
    }
    const authToken = this.tokenService.generateToken(userRecord);
    return { authToken };
  }

  public async verifyAndCreateAccount(input: CreateAccountInput): Promise<LoginSuccessResp> {
    const userRecord = await this.userService.createAccount(input);
    const authToken = this.tokenService.generateToken(userRecord);
    return { authToken };
  }

  public async adminLogin({ phone, password }: AdminLoginInput): Promise<LoginSuccessResp> {
    const userRecord = await userModel.findUser({ phone, userType: USER_TYPE.ADMIN }, '');
    //isUserActivated(!userRecord.activated);
    if (password !== 'admin') throw badUserInputException(USER_ERROR_KEYS.INVALID_PASSWORD);
    const authToken = this.tokenService.generateToken(userRecord);
    return { authToken };
  }
}

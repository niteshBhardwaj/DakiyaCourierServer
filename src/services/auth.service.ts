import LoggerInstance from '@/plugins/logger';
import { Service, Inject } from 'typedi';
import { EventDispatcher, EventDispatcherInterface } from '@/decorators/eventDispatcher';
import TokenService from './token.service';
import { USER_ERROR_KEYS } from '@/constants';
import { LoginSuccessResp } from '@/graphql/typedefs/auth.type';
import { CreateAccountInput, LoginRequest } from '@/graphql/args/auth.input';
import { PrismaClient, UsedForType, User } from '@prisma/client';
import { badUserInputException } from '@/utils/exceptions.util';
import UserService from './user.service';
import { validateAndComparePassword } from '@/utils/password.util';
import OtpService from './otp.service';

@Service()
export default class AuthService {
  constructor(
    @Inject('prisma') private prisma: PrismaClient,
    @Inject('logger') private logger: typeof LoggerInstance,
    private userService: UserService,
    private otpService: OtpService,
    private tokenService: TokenService,
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
  ) {}

  public async verifyAndLogin({ identifier, password }: LoginRequest): Promise<LoginSuccessResp> {
    const search: Partial<Pick<User, 'active' | 'email' | 'phone'>> = {
      // active: true,
    };
    if (isNaN(Number(identifier))) {
      search.email = identifier;
    } else {
      search.phone = identifier;
    }
    console.log(search);
    const userRecord = await this.prisma.user.findFirst({
      where: search,
      select: {
        id: true,
        email: true,
        passwordHash: true,
        userType: true,
        currentState: true,
      },
    });
    if (!userRecord) {
      throw badUserInputException(USER_ERROR_KEYS.INVALID_CREDENTIAL);
    }
    const isMatch = await validateAndComparePassword(password, userRecord.passwordHash);
    if (!isMatch) {
      throw badUserInputException(USER_ERROR_KEYS.INVALID_CREDENTIAL);
    }
    const authToken = this.tokenService.generateToken(userRecord);
    return { authToken, currentState: userRecord.currentState };
  }

  public async isAccountExist({ email, phone }: { email?: string; phone?: string }) {
    const options = phone ? { phone } : { email };
    const user = await this.prisma.user.findFirst({
      where: options,
    });
    if (user) {
      throw badUserInputException(USER_ERROR_KEYS.ACCOUNT_EXISTS);
    }
  }

  public async verifyAndCreateAccount(input: CreateAccountInput): Promise<LoginSuccessResp> {
    await this.otpService.verifyIdentifier({
      id: input.token,
      contactIdentifier: input.phone,
      usedFor: UsedForType.CREATE_ACCOUNT,
    });
    console.log(input, 'input')
    const userRecord = await this.userService.createAccount(input);
    const authToken = this.tokenService.generateToken(userRecord);
    return { authToken, currentState: userRecord.currentState };
  }

  // public async adminLogin({ phone, password }: AdminLoginInput): Promise<LoginSuccessResp> {
  //   const userRecord = await userModel.findUser({ phone, userType: USER_TYPE.ADMIN }, '');
  //   //isUserActivated(!userRecord.activated);
  //   if (password !== 'admin') throw badUserInputException(USER_ERROR_KEYS.INVALID_PASSWORD);
  //   const authToken = this.tokenService.generateToken(userRecord);
  //   return { authToken };
  // }
}

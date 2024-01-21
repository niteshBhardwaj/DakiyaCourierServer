import { CurrentStateType, User, UserKYC, PrismaClient } from '@prisma/client';
import LoggerInstance from '@/plugins/logger';
import { Service, Inject } from 'typedi';
import { EventDispatcher, EventDispatcherInterface } from '@/decorators/eventDispatcher';
import { createHashPaswordAndSalt } from '@/utils/password.util';
import { CreateAccountInput } from '@/graphql/args/auth.input';
import { findNextState } from '@/utils/user.util';
import KycService from './kyc.service';
import { badRequestException, badUserInputException } from '@/utils/exceptions.util';
import { ERROR_CODE, USER_ERROR_KEYS } from '@/constants';
import { UserType } from '@/graphql/typedefs/users.type';

@Service()
export default class UserService {
  constructor(
    @Inject('prisma') private prisma: PrismaClient,
    @Inject('logger') private logger: typeof LoggerInstance,
    @Inject() private kycService: KycService,
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
  ) {}

  public async getUserInfo({ userId }: { userId: string; }): Promise<UserType> {
    const user = await this.prisma.user.findFirst({ 
      where: {
        id: userId
      }, 
      select: {
        id: true,
        fullName: true,
        phone: true,
        phoneCountry: true,
        email: true,
        currentState: true,
        UserKYC: {
          select: {
            status: true
          }
        }
      }
    })
    if(!user) {
      throw badRequestException(USER_ERROR_KEYS.NOT_FOUND, ERROR_CODE.UNAUTHENTICATED);
    }
    return user as UserType;
  }
  /**
   * Creates a new user account.
   * @param input - The account creation input data.
   * @returns The created user record.
   */
  public async createAccount(input: CreateAccountInput) {
    const { passwordHash } = await createHashPaswordAndSalt(input.password);
    console.log('ceate account', input);
    const userRecord = await this.prisma.user.create({
      data: {
        fullName: input.fullName,
        phone: input.phone,
        phoneCountry: '91',
        passwordHash,
        currentState: findNextState(CurrentStateType.PHONE)
      },
    });

    return userRecord;
  }

  /**
   * Updates the email of a user.
   * @param id - The ID of the user.
   * @param email - The new email address.
   * @returns The updated user record.
   */
  public async updateEmail({ id, email }: Pick<User, 'id' | 'email'>) {
    const userRecord = await this.prisma.user.update({
      where: { id },
      data: { email, currentState: findNextState(CurrentStateType.EMAIL) },
      select: { currentState: true },
    });

    return userRecord;
  }

  /**
   * Creates a new KYC (Know Your Customer) record.
   * @param props - The KYC data.
   * @returns The created KYC record.
   */
  public async createKyc(
    props: Pick<UserKYC, 'governmentIdNumber' | 'governmentIdType' | 'userId'>,
  ) {
    await this.kycService.preKycValidation(props, false);
    return this.kycService.createEkyc(props);
  }

  /**
   * Verifies a KYC record.
   * @param props - The KYC data and verification code.
   * @returns The updated user record.
   */
  public async verifyKyc(
    props: Pick<UserKYC, 'governmentIdType' | 'userId'> & { code: string }
  ) {
    const kycInfo = await this.kycService.preKycValidation(props, true);
    await this.kycService.verifykyc(props, kycInfo);
    const userRecord = await this.prisma.user.update({
      where: { id: props.userId },
      data: { currentState: findNextState(CurrentStateType.KYC) },
      select: { currentState: true },
    });
    return {
      currentState: userRecord.currentState,
    };
  }
}
import { CurrentState } from '@prisma/client';
import { CurrentStateType, User, UserKYC } from '@prisma/client';
import LoggerInstance from '@/plugins/logger';
import { Service, Inject } from 'typedi';
import { EventDispatcher, EventDispatcherInterface } from '@/decorators/eventDispatcher';
import { createHashPaswordAndSalt } from '@/utils/password.util';
import { CreateAccountInput } from '@/graphql/args/auth.input';
import { PrismaClient } from '@prisma/client';
import { findNextState } from '@/utils/user.util';
import KycService from './kyc.service';

@Service()
export default class UserService {
  constructor(
    @Inject('prisma') private prisma: PrismaClient,
    @Inject('logger') private logger: typeof LoggerInstance,
    @Inject() private kycService: KycService,
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
  ) {}

  /**
   * Creates a new user account.
   * @param input - The account creation input data.
   * @returns The created user record.
   */
  public async createAccount(input: CreateAccountInput) {
    const { passwordHash } = await createHashPaswordAndSalt(input.password);
    const userRecord = await this.prisma.user.create({
      data: {
        fullname: input.fullname,
        phone: input.phone,
        phoneCountry: '+91',
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
import { CurrentStateType, User, UserKYC, PrismaClient, GovernmentIdType } from '@prisma/client';
import LoggerInstance from '@/plugins/logger';
import { Service, Inject } from 'typedi';
import { EventDispatcher, EventDispatcherInterface } from '@/decorators/eventDispatcher';
import { createHashPaswordAndSalt } from '@/utils/password.util';
import { CreateAccountInput } from '@/graphql/args/auth.input';
import { findNextState } from '@/utils/user.util';
import KycService from './kyc.service';
import { badRequestException, badUserInputException } from '@/utils/exceptions.util';
import { ERROR_CODE, KYC_PRE_VALIDATION, USER_ERROR_KEYS } from '@/constants';
import { UserType } from '@/graphql/typedefs/users.type';
import { KycOfflineInput } from '@/graphql/args/users.input';
import UploadService from './upload.service';
import { getDocsUploadParams, getPhotoUploadParams } from '@/utils';

@Service()
export default class UserService {
  constructor(
    @Inject('prisma') private prisma: PrismaClient,
    @Inject('logger') private logger: typeof LoggerInstance,
    @Inject() private kycService: KycService,
    @Inject() private uploadService: UploadService,
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
    console.log(user);
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
        currentState: findNextState(CurrentStateType.PHONE),
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

  public async selfieKycUpload(
    { userId, selfiePhoto }: Pick<UserKYC,  | 'selfiePhoto' | 'userId'>,
  ) {
    await this.kycService.preKycValidation({ userId, kycType: null }, KYC_PRE_VALIDATION.SELFIE);
    const photoUpload = getPhotoUploadParams(selfiePhoto as string, userId);
    const {url: selfiePhotoUrl} = await this.uploadService.uploadFile(photoUpload, userId, true);
    return this.kycService.updateSelfiePhoto({
      userId,
      selfiePhoto: selfiePhotoUrl
    });
  }

  /**
   * Creates a new KYC (Know Your Customer) record.
   * @param props - The KYC data.
   * @returns The created KYC record.
   */
  public async createKyc(
    props: Pick<UserKYC, 'governmentIdNumber' | 'kycType' | 'userId'>,
  ) {
    await this.kycService.preKycValidation(props);
    return this.kycService.createEkyc(props);
  }

  /**
   * Verifies a KYC record.
   * @param props - The KYC data and verification code.
   * @returns The updated user record.
   */
  public async verifyKyc(
    props: Pick<UserKYC, 'kycType' | 'userId'> & { code: string }
  ) {
    const kycInfo = await this.kycService.preKycValidation(props, KYC_PRE_VALIDATION.VERIFICAITON);
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

  
  public async submitOfflineKyc(props: Pick<UserKYC, 'kycType' | 'userId'> & { documents: KycOfflineInput['documents'] }) {
    const { documents, userId } = props;
    await this.kycService.preKycValidation(props);
    const uploadDocs = documents.map(doc => getDocsUploadParams(doc.file, userId));
    const files = await this.uploadService.uploadFileMultiple(uploadDocs, userId, true);
    console.log(files, 'response')
    const kycDocuments = files.map((image, i) => ({
      type: documents[i].type as GovernmentIdType,
      file: image.url,
    }))
    return this.kycService.submitOfflineKyc({
      ...props,
      kycDocuments
    });
  }
}
import { CurrentStateType, User, UserKYC, PrismaClient, GovernmentIdType, Prisma, KycDocumentStatus, BankDetailsStatus } from '@prisma/client';
import LoggerInstance from '~/plugins/logger';
import { Service, Inject } from 'typedi';
import { EventDispatcher, EventDispatcherInterface } from '~/decorators/eventDispatcher';
import { createHashPaswordAndSalt } from '~/utils/password.util';
import { findNextState } from '~/utils/user.util';
import KycService from './kyc.service';
import { badRequestException, badUserInputException } from '~/utils/exceptions.util';
import { ERROR_CODE, KYC_PRE_VALIDATION, USER_ERROR_KEYS } from '~/constants';
import UploadService from './upload.service';
import { getDocsUploadParams, getPhotoUploadParams } from '~/utils';
import { CreateAccountInput } from '~/graphql-type/args/auth.input';
import { KycOfflineInput, BankDetailsInput } from '~/graphql-type/args/users.input';
import { UserType } from '~/graphql-type/typedefs/users.type';
import { GraphQLResolveInfo } from 'graphql';
import { PrismaSelect } from '@paljs/plugins';

@Service()
export default class UserService {
  constructor(
    @Inject('prisma') private prisma: PrismaClient,
    @Inject('logger') private logger: typeof LoggerInstance,
    @Inject() private kycService: KycService,
    @Inject() private uploadService: UploadService,
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
  ) { }


  /**
   * Retrieves the current state data for a user.
   *
   * @param {UserType['currentState']} currentState - The current state of the user.
   * @param {string} userId - The ID of the user.
   * @return {Promise<UserType['currentState'] | undefined>} The current state data, or undefined if not found.
   */
  public async getUserCurrentStateData(currentState: UserType['currentState'], userId: string) {
    const isKyc = currentState?.state === CurrentStateType.KYC;
    if (currentState && isKyc) {
      //@ts-ignore
      currentState.data = await this.kycService.getUserKyc({
        userId, select: {
          status: true,
        }
      }) || {};
    }
    return currentState;
  }

  /**
   * Retrieves the user information including the current state data.
   *
   * @param {Object} params - The parameters for retrieving the user information.
   * @param {string} params.userId - The ID of the user.
   * @param {Prisma.UserSelect} [params.select] - The fields to select from the user record.
   * @return {Promise<UserType>} The user information including the current state data.
   */
  public async getUserInfo({ userId }: { userId: string; }, info: GraphQLResolveInfo): Promise<UserType> {
    const select = new PrismaSelect(info as any).value
    const user = await this.prisma.user.findFirst({
      where: {
        id: userId
      },
      ...select
      // select: select ?? {
      //   id: true,
      //   fullName: true,
      //   phone: true,
      //   phoneCountry: true,
      //   email: true,
      //   currentState: true,
      // }
    }) as UserType
    if (!user) {
      throw badRequestException(USER_ERROR_KEYS.NOT_FOUND, ERROR_CODE.UNAUTHENTICATED);
    }
    // if (user.currentState) {
    //   user.currentState = await this.getUserCurrentStateData(user.currentState, userId)
    // }
    return user as UserType;
  }

  public async 

  /**
   * Updates the current state of the user and returns the updated state.
   *
   * @param {Object} params - The parameters for updating the user's state.
   * @param {string} params.userId - The ID of the user.
   * @param {CurrentStateType} params.type - The new state for the user.
   * @return {Promise<UserType>} The updated user object.
   */
  public async updateAndGetCurrentState({ userId, type }: { userId: string; type: CurrentStateType }) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { currentState: findNextState(type) },
      select: { currentState: true },
    }) as UserType;

    if (!user) {
      throw badRequestException(USER_ERROR_KEYS.NOT_FOUND, ERROR_CODE.UNAUTHENTICATED);
    }

    if (user.currentState) {
      user.currentState = await this.getUserCurrentStateData(user.currentState, userId)
    }

    return user;
  }
  /**
   * Creates a new user account.
   * @param input - The account creation input data.
   * @returns The created user record.
   */
  public async createAccount(input: CreateAccountInput) {
    const { passwordHash } = await createHashPaswordAndSalt(input.password);
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

  /**
   * Uploads the selfie photo for KYC verification.
   * @param input - The input data for uploading the selfie photo.
   * @returns The updated user KYC record with the selfie photo URL.
   */
  public async selfieKycUpload(
    { userId, selfiePhoto }: Pick<UserKYC, 'selfiePhoto' | 'userId'>,
  ) {
    // Perform pre-KYC validation for selfie photo upload
    await this.kycService.preKycValidation({ userId, kycType: null }, KYC_PRE_VALIDATION.SELFIE);

    // Generate the upload parameters for the selfie photo
    const photoUpload = getPhotoUploadParams(selfiePhoto as string, userId);
    console.log(photoUpload, 'photoUpload');

    // Upload the selfie photo and get the URL
    const { url: selfiePhotoUrl } = await this.uploadService.uploadFile(photoUpload, userId, true);
    console.log(selfiePhotoUrl, 'selfiePhotoUrl');

    // Update the selfie photo in the user's KYC record
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
    const kycInfo = await this.kycService.preKycValidation(props, KYC_PRE_VALIDATION.VERIFICAITON) as UserKYC;
    await this.kycService.verifykyc(props, kycInfo);
    return this.updateAndGetCurrentState({ userId: props.userId, type: CurrentStateType.KYC })
  }

  /**
   * Submits offline KYC documents.
   * @param props - The KYC data and documents.
   * @returns The updated user record.
   */
  public async submitOfflineKyc(props: Pick<UserKYC, 'kycType' | 'userId'> & { documents: KycOfflineInput['documents'] }) {
    const { documents, userId } = props;
    await this.kycService.preKycValidation(props);
    const uploadDocs = documents.map(doc => getDocsUploadParams(doc.file, userId));
    const files = await this.uploadService.uploadFileMultiple(uploadDocs, userId, true);
    console.log(files, 'response')
    const kycDocuments = files.map((image, i) => ({
      type: documents[i].type as GovernmentIdType,
      file: image.url,
      status: KycDocumentStatus.Pending,
    }))
    return this.kycService.submitOfflineKyc({
      ...props,
      kycDocuments
    });
  }


  /**
   * Adds or updates account details for a user.
   * @param userId - The ID of the user.
   * @param input - The account details to add or update.
   * @returns The updated account details record.
   */
  public async addUpdateAccountDetails({ userId, input }: { userId: string; input: BankDetailsInput }) {

    await this.prisma.bankDetails.upsert({
      where: {
        id: userId
      },
      create: {
        userId,
        status: BankDetailsStatus.APPROVED,
        ...input
      },
      update: {
        ...input
      }
    })

    return {
      message: 'Account details updated successfully'
    }
  }
}
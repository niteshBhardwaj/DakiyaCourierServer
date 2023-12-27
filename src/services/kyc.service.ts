import LoggerInstance from '@/plugins/logger';
import { Service, Inject } from 'typedi';
import { GovernmentIdType, KYCStatus, PrismaClient, UsedForType, UserKYC } from '@prisma/client';
import { badUserInputException } from '@/utils/exceptions.util';
import { USER_ERROR_KEYS } from '@/constants';
import { getGstinDetail, sendAadhaarOtpRequest, submitAadhaarOtp } from '@/utils/kyc.util';
import OtpService from './otp.service';
import { KYC_COMMON_ERROR } from '@/constants/kyc.constant';
import { isMobilePhone } from 'class-validator';

@Service()
export default class KycService {
  constructor(
    @Inject('prisma') private prisma: PrismaClient,
    @Inject('logger') private logger: typeof LoggerInstance,
    private otpService: OtpService,
  ) {}

  /**
   * Performs pre-KYC validation for a user.
   * @param userId - The ID of the user.
   * @param governmentIdType - The type of government ID.
   * @param isVerification - Indicates if the validation is for verification purposes.
   * @throws badUserInputException - Throws an exception if the KYC request is invalid.
   * @returns void
   */
  public async preKycValidation(
    { userId, governmentIdType }: Pick<UserKYC, 'governmentIdType' | 'userId'>,
    isVerification: boolean,
  ) {
    // Check if the government ID type is offline
    const isOffline = governmentIdType === GovernmentIdType.Offline;
  
    // Set the options for the query
    const options = { userId };
  
    // Find the user's KYC record
    const kyc = await this.prisma.userKYC.findFirst({
      where: {
        ...options,
      },
    });
    
    if(!kyc && !isVerification) {
      return;
    }
    // Check if the KYC record is not found, already approved, or if it's a verification and there is no request
    if (!kyc || kyc.status === KYCStatus.Approved || (isVerification && !kyc.request)) {
      throw badUserInputException(USER_ERROR_KEYS.INVALID_KYC_REQUEST);
    }
  
    // Check if the KYC status is pending, maximum attempts reached, and not offline
    if (kyc.status === KYCStatus.Pending && kyc.attempts === kyc.maxAttempts && !isOffline) {
      throw badUserInputException(USER_ERROR_KEYS.OFFLINE_KYC_ONLY);
    }

    if (isVerification && kyc.governmentIdType !== governmentIdType) {
      throw badUserInputException(USER_ERROR_KEYS.INVALID_KYC_REQUEST);
    } 
    return kyc;
  }

  /**
   * Initiates KYC process for a user.
   * @param governmentIdNumber - The government ID number of the user.
   * @param governmentIdType - The type of government ID.
   * @returns A Promise that resolves to the result of the KYC initiation.
   */
  public async inititiateKyc({
    governmentIdNumber,
    governmentIdType,
  }: Pick<UserKYC, 'governmentIdType' | 'userId' | 'governmentIdNumber'>) {
    if (governmentIdType === GovernmentIdType.AadhaarCard) {
      // Send Aadhaar OTP request
      return sendAadhaarOtpRequest({
        aadhaarNumber: governmentIdNumber as string,
        consent: 'Y',
      });
    } else if (governmentIdType === GovernmentIdType.GSTIN) {
      // Get GSTIN details
      return getGstinDetail({
        gstin: governmentIdNumber as string,
        consent: 'Y',
      });
    }
    return null;
  }

  /**
   * Creates an eKYC record for a user
   * @param input - The input data for creating the eKYC record
   * @returns The identifier for the eKYC record
   */
  public async createEkyc(
    input: Pick<UserKYC, 'governmentIdType' | 'userId' | 'governmentIdNumber'>,
  ) {
    // Initialize the KYC request
    const request = await this.inititiateKyc(input);
  
    let identifier = request.transaction_id;
    let createData = {
      request,
      response: null,
    };
  
    const { governmentIdNumber, governmentIdType, userId } = input;
  
    if (input.governmentIdType === GovernmentIdType.GSTIN) {
      // Send GST OTP
      const otpResponse = await this.otpService.sendPhoneOtp({
        userId,
        contactIdentifier: request.principal_address.mobile,
        usedFor: UsedForType.KYC,
      });
      identifier = otpResponse.identifier;
      createData = {
        response: request,
        request: {
          identifier
        },
      };
    }
  
    // Update the userKYC record in the database
    await this.prisma.userKYC.upsert({
      where: {
        userId,
      },
      update: {
        governmentIdNumber,
        governmentIdType,
        updatedAt: new Date(),
        ...createData,
      },
      create: {
        governmentIdNumber,
        governmentIdType,
        updatedAt: new Date(),
        userId,
        ...createData,
      }
    });
  
    return {
      identifier,
    };
  }

  /**
   * Verifies the eKYC information.
   * @param input - The input object containing the code, identifier, governmentIdType, and userId.
   * @returns An object with the identifier.
   */
  public async verifykyc(
    input: { code: string; } & Pick<UserKYC, 'governmentIdType' | 'userId'>,
    kycInfo: UserKYC | undefined
  ) {
    let data = null;
    const { userId, governmentIdType, code } = input;
    const requestData = kycInfo?.request;
    // Verify eKYC for Aadhaar Card
    if (governmentIdType === GovernmentIdType.AadhaarCard) {
      const aadharData = await submitAadhaarOtp({
        otp: Number(input.code),
        shareCode: requestData?.code,
        transactionId: requestData?.transaction_id,
      });
      data = {
        response: aadharData,
        fullName: aadharData.name,
        dateOfBirth: aadharData.date_of_birth,
        phoneNumber: aadharData.mobile,
      };
    } else {
      // Verify eKYC for other government IDs
      await this.otpService.verifyOtp({
        id: requestData?.identifier,
        userId,
        code,
      });
    }
  
    // Throw an exception if no data is available
    if (!data) throw badUserInputException(KYC_COMMON_ERROR);
  
    // Update the user KYC information
    await this.prisma.userKYC.update({
      where: {
        userId,
      },
      data: {
        status: KYCStatus.Approved,
        ...data,
      },
    });
  
    // Return the identifier
    return;
  }
}

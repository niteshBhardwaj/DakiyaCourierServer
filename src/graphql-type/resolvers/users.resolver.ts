import { Inject, Service } from 'typedi';
import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import OtpService from '~/services/otp.service';
import UserService from '~/services/user.service';
import { QUERY_DESC, REQUEST } from '~/constants';
import { BankDetailsInput, KycAadhaarInput, KycGstinInput, KycOfflineInput, SelfieKycInput, VerifyAadhaarInput, VerifyGstinInput } from '../args/users.input';
import { UserContext } from '~/interfaces/auth.interface';
import { KYCDocumentType, VerificationType } from '@prisma/client';
import { OtpVerifyInput } from '../args/otp.input';
import { MessageType } from '../typedefs/common.type';
import { CurrentStateType, NextStateType, UserType } from '../typedefs/users.type';
import { KYC_MESSAGE } from '~/constants/messages.contant';
import KycService from '~/services/kyc.service';
import { UserKycType } from '../typedefs/kyc.type';

@Service()
@Resolver()
export class userResolver {
  @Inject()
  otpService: OtpService;
  @Inject()
  userService: UserService;
  @Inject()
  kycService: KycService;

  /* get user info */
  @Authorized()
  @Query(() => UserType, {
    description: QUERY_DESC.VERIFY_OTP_LOGIN,
  })
  async getUserInfo(@Ctx() { user: { userId } }: { user: UserContext }): Promise<UserType> {
    // @ts-ignore
    return this.userService.getUserInfo({ userId });
  }

  /* verify email */
  @Authorized()
  @Mutation(() => NextStateType, {
    description: QUERY_DESC.VERIFY_OTP_LOGIN,
  })
  async verifyEmail(
    @Arg(REQUEST) otpInfo: OtpVerifyInput,
    @Ctx() { user: { userId } }: { user: UserContext },
  ): Promise<NextStateType> {
    const {contactIdentifier} = await this.otpService.verifyOtp({
      id: otpInfo.identifier,
      code: String(otpInfo.code),
      verificationType: VerificationType.EMAIL
    });

    return await this.userService.updateEmail({
      id: userId,
      email: contactIdentifier,
    }) as NextStateType;
  }


  

  /* aadhar kyc */
  @Authorized()
  @Query(() => MessageType, {
    description: QUERY_DESC.INIT_AUTH,
  })
  async skipKyc(
    @Ctx() { user: { userId } }: { user: UserContext },
  ): Promise<MessageType> {
    await this.kycService.skipKyc({
      userId,
    });
    return {
      message: 'KYC skipped successfully',
    };
  }

  

  /* aadhar kyc */
  @Authorized()
  @Mutation(() => MessageType, {
    description: QUERY_DESC.INIT_AUTH,
  })
  async selfieKyc(
    @Arg(REQUEST) { selfiePhoto }: SelfieKycInput,
    @Ctx() { user: { userId } }: { user: UserContext },
  ): Promise<MessageType> {
    console.log(selfiePhoto);
    await this.userService.selfieKycUpload({
      selfiePhoto,
      userId,
    });
    return {
      message: 'Selfie Uploaded successfully.',
    };
  }

  /* aadhar kyc */
  @Authorized()
  @Mutation(() => MessageType, {
    description: QUERY_DESC.INIT_AUTH,
  })
  async aadhaarKyc(
    @Arg(REQUEST) args: KycAadhaarInput,
    @Ctx() { user: { userId } }: { user: UserContext },
  ): Promise<MessageType> {
    await this.userService.createKyc({
      kycType: KYCDocumentType.AadhaarCard,
      governmentIdNumber: args.aadharNo,
      userId,
    });
    return {
      message: 'KYC submitted successfully',
    };
  }

  /* init verify gstin */
  @Authorized()
  @Mutation(() => NextStateType, {
    description: QUERY_DESC.INIT_AUTH,
  })
  async verifyAadhaar(
    @Arg(REQUEST) args: VerifyAadhaarInput,
    @Ctx() { user: { userId } }: { user: UserContext },
  ): Promise<NextStateType> {
    //@ts-ignore
    return this.userService.verifyKyc({
      kycType: KYCDocumentType.AadhaarCard,
      code: String(args.code),
      userId,
    });
  }

  /* init verify gstin */
  @Authorized()
  @Mutation(() => MessageType, {
    description: QUERY_DESC.INIT_AUTH,
  })
  async gstinKyc(
    @Arg(REQUEST) args: KycGstinInput,
    @Ctx() { user: { userId } }: { user: UserContext },
  ): Promise<MessageType> {
    await this.userService.createKyc({
      kycType: KYCDocumentType.GSTIN,
      governmentIdNumber: args.gstinNo,
      userId,
    });
    return {
      message: 'GSTIN request submitted successfully',
    };
  }

  /* verify gstin */
  @Authorized()
  @Mutation(() => NextStateType, {
    description: QUERY_DESC.INIT_AUTH,
  })
  async verifyGstin(
    @Arg(REQUEST) args: VerifyGstinInput,
    @Ctx() { user: { userId } }: { user: UserContext },
  ): Promise<NextStateType> {
    //@ts-ignore
    return this.userService.verifyKyc({
      kycType: KYCDocumentType.GSTIN,
      code: String(args.code),
      userId,
    });
  }

  /* submit offline kyc */
    @Authorized()
    @Mutation(() => MessageType, {
      description: QUERY_DESC.INIT_AUTH,
    })
    async submitOfflineKyc(@Arg(REQUEST) args: KycOfflineInput,     
    @Ctx() { user: { userId } }: { user: UserContext },
    ): Promise<MessageType> {
      await this.userService.submitOfflineKyc({
        documents: args.documents,
        kycType: KYCDocumentType.Offline,
        userId
      });
      return {
        message: KYC_MESSAGE.SUBMITTED_OFFLINE_KYC,
      }
    }

    @Authorized()
    @Query(() => UserKycType, {
      description: QUERY_DESC.INIT_AUTH
    })
    async getUserKyc(@Ctx() { user: { userId } }: { user: UserContext }): Promise<UserKycType> {
      return this.kycService.getUserKyc({
        userId
      });
    }

    @Authorized()
    @Mutation(() => MessageType, {
      description: QUERY_DESC.INIT_AUTH,
    })
    async addUpdateAccountDetails(
      @Arg(REQUEST) args: BankDetailsInput,     
      @Ctx() { user: { userId } }: { user: UserContext },
    ): Promise<MessageType> {
      return this.userService.addUpdateAccountDetails({
        input: args,
        userId
      });
    }


}
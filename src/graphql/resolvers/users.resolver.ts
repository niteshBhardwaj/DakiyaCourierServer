import { Inject, Service } from 'typedi';
import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import OtpService from '@/services/otp.service';
import UserService from '@/services/user.service';
import { QUERY_DESC, REQUEST } from '@/constants';
import { KycAadhaarInput, KycGstinInput, VerifyAadhaarInput, VerifyGstinInput } from '../args/users.input';
import { UserContext } from '@/interfaces/auth.interface';
import { KYCDocumentType, VerificationType } from '@prisma/client';
import { OtpVerifyInput } from '../args/otp.input';
import { MessageResp } from '../typedefs/common.type';
import { NextStateType, UserType } from '../typedefs/users.type';

@Service()
@Resolver()
export class userResolver {
  @Inject()
  otpService: OtpService;
  @Inject()
  userService: UserService;

  /* get user info */
  @Authorized()
  @Query(() => UserType, {
    description: QUERY_DESC.VERIFY_OTP_LOGIN,
  })
  async getUserInfo(@Ctx() { user: { userId } }: { user: UserContext }): Promise<UserType> {
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
    });
  }

  /* aadhar kyc */
  @Authorized()
  @Mutation(() => MessageResp, {
    description: QUERY_DESC.INIT_AUTH,
  })
  async aadhaarKyc(
    @Arg(REQUEST) args: KycAadhaarInput,
    @Ctx() { user: { userId } }: { user: UserContext },
  ): Promise<MessageResp> {
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
    return this.userService.verifyKyc({
      kycType: KYCDocumentType.AadhaarCard,
      code: String(args.code),
      userId,
    });
  }

  /* init verify gstin */
  @Authorized()
  @Mutation(() => MessageResp, {
    description: QUERY_DESC.INIT_AUTH,
  })
  async gstinKyc(
    @Arg(REQUEST) args: KycGstinInput,
    @Ctx() { user: { userId } }: { user: UserContext },
  ): Promise<MessageResp> {
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
    return this.userService.verifyKyc({
      kycType: KYCDocumentType.GSTIN,
      code: String(args.code),
      userId,
    });
  }

    // @Authorized()
    // @Mutation(() => NextStateType, {
    //   description: QUERY_DESC.INIT_AUTH,
    // })
    // async offlineKyc(@Arg(REQUEST) args: any): Promise<any> {

    // }
}
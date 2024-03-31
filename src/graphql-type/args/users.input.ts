import {
  ACCOUNT_HOLDER_NAME_VALIDATION,
  ACCOUNT_NUMBER_VALIDATION,
  BANK_NAME_VALIDATION,
  IFSC_CODE_VALIDATION,
  VALIDATION_MSG,
} from '@/constants';
import { KycDocuments, OtpLength } from '@/utils';
import { GovernmentIdType } from '@prisma/client';
import { IsEmpty, IsEnum, IsMobilePhone, IsNotEmpty, IsString, MaxLength, Validate, isEnum, maxLength } from 'class-validator';
import { InputType, Field } from 'type-graphql';


@InputType()
export class KycAadhaarInput {
  @Field()
  aadharNo: string;
}

@InputType()
export class KycGstinInput {
  @Field()
  gstinNo: string;
}

@InputType()
export class VerifyAadhaarInput {
  @Field()
  @Validate(OtpLength, {
    message: VALIDATION_MSG.OTP_LENGTH,
  })
  code: number;
}

@InputType()
export class VerifyGstinInput {
  @Field()
  @Validate(OtpLength, {
    message: VALIDATION_MSG.OTP_LENGTH,
  })
  code: number;
}


@InputType()
class OfflineTypeInput {
  @Field({ description: `Choose: ${Object.values(GovernmentIdType).join(" | ")}` })
  @IsEnum(GovernmentIdType)
  type: string;

  @Field() //TODO: need to validate file url
  @IsEmpty({
    message: VALIDATION_MSG.PHOTO_URL,
  })
  @MaxLength(100)
  file: string;
}

@InputType()
export class KycOfflineInput {
  @Field(type => [OfflineTypeInput])
  @Validate(KycDocuments)
  documents: OfflineTypeInput[];
}

@InputType() 
export class SelfieKycInput {
  @Field() //TODO: need to validate file url
  @MaxLength(100)
  // @IsEmpty({
  //   message: VALIDATION_MSG.PHOTO_URL,
  // })
  selfiePhoto: string;
}

@InputType()
export class BankDetailsInput {
  @Field({
    nullable: true,
    description: ACCOUNT_HOLDER_NAME_VALIDATION.description,
  })
  @IsString(ACCOUNT_HOLDER_NAME_VALIDATION)
  @IsNotEmpty(ACCOUNT_HOLDER_NAME_VALIDATION)
  accountHolderName: string;

  @Field(ACCOUNT_NUMBER_VALIDATION)
  @IsString(ACCOUNT_NUMBER_VALIDATION)
  @IsNotEmpty(ACCOUNT_NUMBER_VALIDATION)
  accountNumber: string;

  @Field(BANK_NAME_VALIDATION)
  @IsString(BANK_NAME_VALIDATION)
  @IsNotEmpty(BANK_NAME_VALIDATION)
  bankName: string;

  @Field(IFSC_CODE_VALIDATION)
  @IsString(IFSC_CODE_VALIDATION)
  @IsNotEmpty(IFSC_CODE_VALIDATION)
  IFSCCode: string;

  @Field({ nullable: true, description: 'The UPI Id (if any)' })
  UPIId: string;

}
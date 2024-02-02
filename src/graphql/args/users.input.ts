import {
  VALIDATION_MSG,
  PhoneLocalAlias,
} from '@/constants';
import { OtpLength } from '@/utils';
import { GovernmentIdType } from '@prisma/client';
import { IsEnum, IsMobilePhone, MaxLength, Validate, isEnum } from 'class-validator';
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
  @Field()
  @IsEnum(GovernmentIdType)
  type: string;

  @Field()
  value: number;
}

@InputType()
export class kycOfflineInput {
  @Field(type => [OfflineTypeInput])
  documents: OfflineTypeInput[];
}

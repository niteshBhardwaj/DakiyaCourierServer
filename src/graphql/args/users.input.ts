import {
  VALIDATION_MSG,
  PhoneLocalAlias,
} from '@/constants';
import { OtpLength } from '@/utils';
import { IsMobilePhone, MaxLength, Validate } from 'class-validator';
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
export class kycOfflineInput {
  @Field()
  docType1: string;

  @Field()
  docUrl1: string;

  @Field()
  docType2: string;

  @Field()
  docUrl2: string;
}

@InputType()
export class AdminUploadDocsInput {

  @Field()
  userId: string;

  @Field()
  docType: string;

  @Field()
  state: string;

  @Field()
  @MaxLength(100)
  message: string;
}
@InputType()
export class AdminLoginInput {
  @Field()
  @IsMobilePhone(PhoneLocalAlias.IN, undefined, {
    message: VALIDATION_MSG.PHONE_NO,
  })
  phone: string;

  @Field()
  password: string;
}

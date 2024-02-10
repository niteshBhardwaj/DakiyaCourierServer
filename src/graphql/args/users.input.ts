import {
  VALIDATION_MSG,
  PhoneLocalAlias,
} from '@/constants';
import { KycDocuments, OtpLength } from '@/utils';
import { GovernmentIdType } from '@prisma/client';
import { IsEmpty, IsEnum, IsMobilePhone, IsNotEmpty, MaxLength, Validate, isEnum, maxLength } from 'class-validator';
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

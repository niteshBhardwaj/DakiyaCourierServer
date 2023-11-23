import { CountryCode, PhoneLocalAlias, VALIDATION_MSG } from "@/constants";
import { OtpLength } from "@/utils";
import { IsEnum, IsMobilePhone, IsNotEmpty, MaxLength, Validate } from "class-validator";
import { Field, InputType } from "type-graphql";

@InputType()
export class PhoneInput {
  @Field()
  @IsEnum(CountryCode, {
    message: VALIDATION_MSG.COUNTRY_CODE,
  })
  countryCode: string;

  @Field()
  @IsMobilePhone(PhoneLocalAlias.IN, undefined, {
    message: VALIDATION_MSG.PHONE_NO,
  })
  phone: string;
}

@InputType()
export class OtpVerifyInput {
  @Field()
  @IsNotEmpty()
  @MaxLength(50)
  otpToken: string;

  @Field()
  @Validate(OtpLength, {
    message: VALIDATION_MSG.OTP_LENGTH,
  })
  code: number;
}

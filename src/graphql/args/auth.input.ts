import { CountryCode, PhoneLocalAlias, VALIDATION_MSG } from "@/constants";
import { OtpLength } from "@/utils";
import { IsEmail, IsEnum, IsMobilePhone, IsNotEmpty, MaxLength, Validate } from "class-validator";
import { Field, InputType } from "type-graphql";

@InputType()
export class EmailInput {
  @Field()
  @IsEmail(undefined, {
    message: VALIDATION_MSG.VALID_EMAIL,
  })
  email: string;
}

@InputType()
export class PhoneInput {
  @Field({ defaultValue: CountryCode.IN })
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
export class EmailPasswordInput extends EmailInput {
  @Field()
  @IsNotEmpty()
  @MaxLength(50)
  password: string;
}

@InputType()
export class CreateAccountInput {
  @Field()
  @IsNotEmpty()
  @MaxLength(50)
  fullname: string;

  @Field()
  @IsMobilePhone(PhoneLocalAlias.IN, undefined, {
    message: VALIDATION_MSG.PHONE_NO,
  })
  phone: string;

  @Field()
  @IsEmail(undefined, {
    message: VALIDATION_MSG.VALID_EMAIL,
  })
  email: string;

  @Field()
  @IsNotEmpty()
  @MaxLength(50)
  password: string;
}

@InputType()
export class InitAuthInput {
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

  @Field()
  @IsEmail(undefined, {
    message: VALIDATION_MSG.VALID_EMAIL,
  })
  email: string;
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

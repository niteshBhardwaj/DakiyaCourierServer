import { CountryCode, PhoneLocalAlias, VALIDATION_MSG } from "~/constants";
import { EmailOrPhone, OtpLength } from "~/utils";
import { IsEmail, IsEnum, IsMobilePhone, IsMongoId, IsNotEmpty, MaxLength, Validate } from "class-validator";
import { Field, InputType, registerEnumType } from "type-graphql";

export enum InitAccountType {
  LOGIN = 'LOGIN',
  CREATE_ACCOUNT = 'CREATE_ACCOUNT',
}

registerEnumType(InitAccountType, {
  name: 'InitAccountType',
});

registerEnumType(CountryCode, {
  name: 'CountryCode',
})

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
  @Field(() => CountryCode, { defaultValue: CountryCode.IN })
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
export class InitPhoneRequest extends PhoneInput {
  @Field(() => InitAccountType)
  @IsEnum(InitAccountType)
  type: string;
}

@InputType()
export class InitEmailRequest extends EmailInput {
  @Field(() => InitAccountType)
  @IsEnum(InitAccountType)
  type: string;
}

@InputType()
export class Identifier {
  @Field()
  @IsNotEmpty()
  @IsMongoId()
  identifier: string;
}

@InputType()
export class Identifiers extends Identifier {
  
}

@InputType()
export class LoginRequest {
  @Field()
  @Validate(EmailOrPhone)
  identifier: string;

  @Field()
  @IsNotEmpty()
  @MaxLength(50)
  password: string;
}

@InputType()
export class CreateAccountInput extends PhoneInput {
  @Field()
  @IsNotEmpty()
  @MaxLength(50)
  fullName: string;

  @Field()
  @IsNotEmpty()
  @MaxLength(50)
  password: string;

  @Field()
  @IsNotEmpty()
  @MaxLength(50)
  token: string;
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


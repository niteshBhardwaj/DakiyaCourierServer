import { VALIDATION_MSG } from "~/constants";
import { OtpLength } from "~/utils";
import { Validate } from "class-validator";
import { InputType, Field } from "type-graphql";
import { Identifier } from "./auth.input";

@InputType()
export class OtpVerifyInput extends Identifier {
  @Field()
  @Validate(OtpLength, {
    message: VALIDATION_MSG.OTP_LENGTH,
  })
  code: number;
}
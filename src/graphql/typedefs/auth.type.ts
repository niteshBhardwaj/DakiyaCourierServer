import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class LoginSuccessResp {
  @Field()
  authToken: string;
  @Field()
  refreshToken?: string;
}

@ObjectType()
export class OtpResp {
  @Field()
  otpToken: string;
}
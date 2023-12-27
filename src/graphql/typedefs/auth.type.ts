import { Field, ObjectType } from "type-graphql";

@ObjectType() 
export class CurrentStateType {
  @Field()
  isRequired: boolean;
  @Field()
  state: string;
}

@ObjectType()
export class LoginSuccessResp {
  @Field()
  authToken: string;
  @Field()
  refreshToken?: string;
  @Field(() => CurrentStateType) // Explicitly specify the type of the array
  currentState: CurrentStateType | null;
}

@ObjectType()
export class OtpResp {
  @Field()
  identifier: string;
}

@ObjectType() 
export class CreateAccountType {
  @Field()
  success: boolean;
}

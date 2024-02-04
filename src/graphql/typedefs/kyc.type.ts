import { ObjectType, Field } from "type-graphql";

@ObjectType()
export class UserKycType {
  @Field({ nullable: true})
  status?: string;
}
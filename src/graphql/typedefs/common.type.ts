import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class MessageResp {
  @Field()
  message?: string;
}
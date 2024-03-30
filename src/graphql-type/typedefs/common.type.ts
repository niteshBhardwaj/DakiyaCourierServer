import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class MessageType {
  @Field()
  message?: string;
}
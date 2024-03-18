import { Field, InputType } from "type-graphql";

@InputType()
export class CourierIdInput {
  @Field()
  courierId: string;
}
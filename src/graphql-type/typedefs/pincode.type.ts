import { ObjectType, Field } from "type-graphql";
import { MessageType } from "./common.type";

@ObjectType()
export class PincodeServiceabilityType extends MessageType {
  @Field()
  isServiceable: boolean;
}

@ObjectType()
export class RateCalulatorType extends MessageType {
  @Field()
  amount: number;
}
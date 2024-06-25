import { ObjectType, Field } from "type-graphql";
import { MessageType } from "./common.type";

@ObjectType()
export class Admin {
  @Field()
  name: string;
}

@ObjectType()
export class PincodeInfoType {
  @Field()
  pincode: string;

  @Field({ nullable: true })
  admin3Name: string | null;

  @Field()
  Admin1: Admin

  @Field()
  Admin2: Admin;
}

@ObjectType()
export class PincodeServiceabilityType extends MessageType {
  @Field()
  isServiceable: boolean;
}

@ObjectType()
class TaxType {
  @Field()
  name: string;

  @Field()
  amount: number;

  @Field()
  type: string;
}

@ObjectType()
class ExtraChargeType {
  @Field()
  name: string;

  @Field()
  amount: number;

  @Field()
  type: string;
}

@ObjectType()
export class RateCalculatorType extends MessageType {
  @Field()
  chargedWeight: number;

  @Field()
  zone: string;

  @Field()
  baseAmount: number;

  @Field()
  totalAmount: number;

  @Field()
  totalAmountWithTax: number;

  @Field()
  cod: number;

  @Field(() => [TaxType])
  taxes: TaxType[];

  @Field(() => [ExtraChargeType])
  extraCharges: ExtraChargeType[];


}
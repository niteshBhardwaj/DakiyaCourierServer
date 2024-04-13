import { Field, Int, ObjectType } from "type-graphql";

@ObjectType()
export class ReturnAddressType {
  @Field(type => String, { nullable: true })
  name: string | null;

  @Field()
  address: string;

  @Field()
  pincode: number;

  @Field()
  city: string;

  @Field()
  state: string;

  @Field()
  country: string;
}


@ObjectType()
export class PickupAddressType {
  @Field()
  id: string;

  @Field()
  phone: string;

  @Field()
  city: string;

  @Field()
  pickupId: string;

  @Field()
  name: string;

  @Field()
  pincode: number;

  @Field()
  state: string;

  @Field()
  address: string;

  @Field()
  country: string;

  @Field()
  email: string;

  @Field(type => ReturnAddressType, { nullable: true })
  returnAddress: ReturnAddressType;
}



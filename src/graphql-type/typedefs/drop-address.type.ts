import { Field, Int, ObjectType } from "type-graphql";


@ObjectType()
export class DropAddressType {
  @Field()
  id: string;

  @Field()
  phone: string;

  @Field()
  city: string;

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

}


@ObjectType()
export class DropAddressUpdateType {
  @Field()
  isNew: boolean;

  @Field(type => DropAddressType)
  data: DropAddressType
}
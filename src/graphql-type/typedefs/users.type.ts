import { Field, ObjectType } from 'type-graphql';
import { UserKycType } from './kyc.type';
import GraphQLJSON from 'graphql-type-json';

@ObjectType()
export class CurrentStateType {
  @Field()
  isRequired: boolean;
  @Field()
  state: string;
  @Field(type => GraphQLJSON, { nullable: true })
  data?: Object;
}

@ObjectType()
export class NextStateType {
  @Field(() => CurrentStateType, { nullable: true }) // Explicitly specify the type of the array
  currentState: CurrentStateType;
}

@ObjectType()
export class UserType extends NextStateType {
  @Field()
  id?: string;
  @Field({ nullable: true })
  fullName?: string;
  @Field({ nullable: true })
  email?: string;
  @Field()
  phone?: string;
  @Field()
  phoneCountry?: string;
}


import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class NextStateType {
  @Field(() => CurrentState) // Explicitly specify the type of the array
  currentState: CurrentState | null;
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

@ObjectType()
export class CurrentState {
  @Field()
  isRequired: boolean;
  @Field()
  state: string;
}

import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class User {
  @Field()
  _id?: string;
  @Field({ nullable: true })
  firstname?: string;
  @Field({ nullable: true })
  lastname?: string;
  @Field({ nullable: true })
  phone: string;
  @Field({ nullable: true })
  photo?: string;
  @Field({ nullable: true })
  thumbnail: string;
  @Field({ nullable: true })
  email?: string;
  @Field({ nullable: true })
  city?: string;
  @Field({ nullable: true })
  activated: boolean;
}

@ObjectType()
export class CurrentState {
  @Field()
  isRequired: boolean;
  @Field()
  state: string;
}

@ObjectType()
export class NextStateType {
  @Field(() => CurrentState) // Explicitly specify the type of the array
  currentState: CurrentState | null;
}
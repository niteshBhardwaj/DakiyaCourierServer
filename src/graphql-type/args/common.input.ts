import { Field, InputType } from "type-graphql";

@InputType()
export class OffsetInput {
  @Field({ nullable: true, defaultValue: 10 })
  take: number;

  @Field({ nullable: true, defaultValue: 0 })
  skip: number;
}


import { ObjectType, Field } from "type-graphql";


@ObjectType()
export class TrackingInput {

    @Field({ nullable: true })
    location: String;
    @Field({ nullable: true })
    type: String;
    @Field({ nullable: true })
    status: String;
    @Field({ nullable: true })
    dateTime: Date;
    @Field({ nullable: true })
    instructions: String;

}
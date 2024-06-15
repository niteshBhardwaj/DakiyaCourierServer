import { Field, ObjectType } from "type-graphql";


@ObjectType()
export class RateCardType {
    @Field({ nullable: true, description: "Rate card id" })    
    id: string;
    
    @Field({ nullable: true, description: "Rate card name" })    
    name: String;
    
    @Field(type => [String], { nullable: true, description: "Rate card tags" })
    tags: String[];
    
    @Field(type => [UserRateCardType], { nullable: true, description: "Rate card user rate card" })
    userRateCard: UserRateCardType[];
}

@ObjectType()
export class UserRateCardType {
    @Field({ nullable: true, description: "Rate card title" })    
    title: string;
    
    @Field({ nullable: true, description: "Rate card mode" })    
    mode: string;
    
    @Field({ nullable: true, description: "Rate card type" })    
    type: string;
    
    @Field({ nullable: true, description: "Rate card base" })    
    base: string;
    
    @Field({ nullable: true, description: "Rate card increment" })    
    increment: string;
    
    @Field({ nullable: true, description: "Rate card unit" })    
    unit: string;
    
    @Field({ nullable: true, description: "Rate card upto" })    
    upto: string;
    
    @Field(type => [RateType], { nullable: true, description: "Rate card rates" })
    rates: RateType[];
}

@ObjectType()
export class RateType {
    @Field({ nullable: true, description: "Rate zone" })    
    zone: string;
    
    @Field({ nullable: true, description: "Rate base rate" })    
    baseRate: string;
    
    @Field({ nullable: true, description: "Rate increment rate" })    
    incrementRate: string;
}
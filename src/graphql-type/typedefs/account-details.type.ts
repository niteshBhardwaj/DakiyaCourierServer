import { Field, ObjectType } from "type-graphql";

 // Create a Wallet model.
 @ObjectType()
 export class AccountDetailsType {
     @Field({ nullable: true, description: "Account status" })    
     status: string;
 }
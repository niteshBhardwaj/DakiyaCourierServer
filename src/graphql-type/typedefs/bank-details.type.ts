import { Field, ObjectType } from "type-graphql";

 // Create a Wallet model.
 @ObjectType()
 export class BankDetailsType {
     @Field({ nullable: true, description: "Account status" })    
     status: string;

    @Field({ nullable: true, description: "Account type" })
    accountType: string;

    @Field({ nullable: true, description: "Account holder name" })
    accountHolderName: string;

    @Field({ nullable: true, description: "Account number" })
    accountNumber: string;

    @Field({ nullable: true, description: "Bank name" })
    bankName: string;

    @Field({ nullable: true, description: "IFSC code" })
    IFSCCode: string;
 }
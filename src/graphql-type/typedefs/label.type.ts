import { Field, ObjectType } from "type-graphql"

@ObjectType()
export class LabelType {
    @Field({ nullable: true, description: "Label id" })    
    id: string;

    @Field({ nullable: true, description: "Business name is included in label" })
    businessName?: string;
    
    @Field({ nullable: true, description: "Logo is included in label" })
    logo?: string;
    
    @Field({ nullable: true, description: "Size is included in label" })
    size?: string;
    
    @Field({ nullable: true, description: "Font is included in label" })
    font?: string;
    
    @Field({ nullable: true, description: "Hide invoice No. in label" })
    hideInvoiceNo?: boolean;
    
    @Field({ nullable: true, description: "Hide return address in label" })
    hideReturnAddress?: boolean;
    
    @Field({ nullable: true, description: "Hide product info in label" })
    hideProductInfo?: boolean;
    
    @Field({ nullable: true, description: "Hide total amount in label" })
    hideTotalAmount?: boolean;
    
    @Field({ nullable: true, description: "Hide tax in label" })
    hideTax?: boolean;
    
    @Field({ nullable: true, description: "Hide weight in label" })
    hideWeight?: boolean;
    
    @Field({ nullable: true, description: "Hide COD in label" })
    hideCOD?: boolean;
    
    @Field({ nullable: true, description: "Template is used for label" })
    template?: string;
    
    @Field({ nullable: true, description: "Creation timestamp" })
    createdAt?: string;
    
    @Field({ nullable: true, description: "Update timestamp" })
    updatedAt?: string;
    
    @Field({ nullable: true, description: "User who creates label" })
    userId?: string;

}
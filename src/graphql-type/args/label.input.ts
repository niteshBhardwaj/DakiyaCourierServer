import { Validate } from "class-validator";
import { InputType, Field } from "type-graphql";



@InputType()
export class LabelInput {
    @Field({ nullable: true })
    businessName?: string | null;
    
    @Field({ nullable: true })
    logo?: string | null;
    
    @Field({ nullable: true })
    size?: string | null;
    
    @Field({ nullable: true })
    font?: string | null;
    
    @Field({ nullable: true })
    hideInvoiceNo?: boolean;
    
    @Field({ nullable: true })
    hideReturnAddress?: boolean;
    
    @Field({ nullable: true })
    hideProductInfo?: boolean;
    
    @Field({ nullable: true })
    hideTotalAmount?: boolean;
    
    @Field({ nullable: true })
    hideTax?: boolean;
    
    @Field({ nullable: true })
    hideWeight?: boolean;
    
    @Field({ nullable: true })
    hideCOD?: boolean;
    
    @Field({ nullable: true })
    template?: string;
}
import { ADDRESS_VALIDATION } from "@/constants/address.constant";
import {
    IsEmail,
    IsInt,
    IsNotEmpty,
    IsString,
    ValidateNested,
    IsMobilePhone,
} from "class-validator";
import { Field, InputType, Int } from "type-graphql";

@InputType()
export class PickupAddressInput {
    @Field(ADDRESS_VALIDATION.phone)
    @IsMobilePhone(undefined, undefined, ADDRESS_VALIDATION.phone)
    phone: string;

    @Field(ADDRESS_VALIDATION.city)
    @IsString(ADDRESS_VALIDATION.city)
    @IsNotEmpty(ADDRESS_VALIDATION.city)
    city: string;

    @Field(ADDRESS_VALIDATION.name)
    @IsString(ADDRESS_VALIDATION.name)
    @IsNotEmpty(ADDRESS_VALIDATION.name)
    name: string;

    @Field(() => Int, ADDRESS_VALIDATION.pincode)
    @IsInt(ADDRESS_VALIDATION.pincode)
    @IsNotEmpty(ADDRESS_VALIDATION.pincode)
    pincode: number;

    @Field(ADDRESS_VALIDATION.address)
    @IsString(ADDRESS_VALIDATION.address)
    @IsNotEmpty(ADDRESS_VALIDATION.address)
    address: string;

    @Field(ADDRESS_VALIDATION.state)
    @IsString(ADDRESS_VALIDATION.state)
    @IsNotEmpty(ADDRESS_VALIDATION.state)
    state: string;

    @Field(ADDRESS_VALIDATION.country)
    @IsString(ADDRESS_VALIDATION.country)
    @IsNotEmpty(ADDRESS_VALIDATION.country)
    country: string;

    @Field(ADDRESS_VALIDATION.email)
    @IsEmail(undefined, ADDRESS_VALIDATION.email)
    @IsNotEmpty(ADDRESS_VALIDATION.email)
    email: string;

    @Field(type => ReturnAddressInput, { nullable: true, description: ADDRESS_VALIDATION.returnAddress.description })
    @ValidateNested(ADDRESS_VALIDATION.pincode)
    returnAddress?: ReturnAddressInput | null;
}

@InputType()
class ReturnAddressInput {
    @Field(() => Int, ADDRESS_VALIDATION.pincode)
    @IsInt(ADDRESS_VALIDATION.pincode)
    @IsNotEmpty(ADDRESS_VALIDATION.pincode)
    pincode: number;
    
    @Field(ADDRESS_VALIDATION.address)
    @IsString(ADDRESS_VALIDATION.address)
    @IsNotEmpty(ADDRESS_VALIDATION.address)
    address: string;

    @Field(ADDRESS_VALIDATION.city)
    @IsString(ADDRESS_VALIDATION.city)
    @IsNotEmpty(ADDRESS_VALIDATION.city)
    city: string;
    
    @Field(ADDRESS_VALIDATION.state)
    @IsString(ADDRESS_VALIDATION.state)
    @IsNotEmpty(ADDRESS_VALIDATION.state)
    state: string;

    @Field(ADDRESS_VALIDATION.country)
    @IsString(ADDRESS_VALIDATION.country)
    @IsNotEmpty(ADDRESS_VALIDATION.country)
    country: string;
}

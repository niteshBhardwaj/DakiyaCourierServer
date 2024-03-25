import { OrderInputConstant } from "@/constants";
import { ADDRESS_VALIDATION } from "@/constants/address.constant";
import { PaymentMode, ShippingMode } from "@prisma/client";
import { IsArray, IsBoolean, IsEnum, IsInt, IsMongoId, IsNotEmpty, IsNumber, IsString, ValidateNested } from "class-validator";
import { Field, InputType, Int, registerEnumType } from "type-graphql";

@InputType()
class ProductInput {
    @Field(OrderInputConstant.productName)
    @IsString({ message: OrderInputConstant.productName.message })
    name!: string;

    @Field(OrderInputConstant.quantity)
    @IsNumber(undefined, { message: OrderInputConstant.quantity.message})
    quantity!: number;

    @Field(OrderInputConstant.category)
    @IsString({ message: OrderInputConstant.quantity.message})
    category!: string;

    @Field(OrderInputConstant.amount)
    @IsNumber({ maxDecimalPlaces: 2 }, OrderInputConstant.amount)
    amount!: number;
}

registerEnumType(PaymentMode, {
    name: 'PaymentMode',
});

registerEnumType(ShippingMode, {
    name: 'ShippingMode',
});

@InputType()
export class CreateOrderInput {

    @Field(OrderInputConstant.pickupId)
    @IsMongoId({message: OrderInputConstant.pickupId.message})
    @IsNotEmpty({message: OrderInputConstant.pickupId.message})
    pickupId: string;

    @Field(OrderInputConstant.dropId)
    @IsMongoId(OrderInputConstant.dropId)
    dropId!: string;

    @Field(() => PaymentMode)
    @IsEnum(PaymentMode)
    paymentMode!: PaymentMode;

    @Field(() => ShippingMode, OrderInputConstant.shippingMode)
    @IsEnum(ShippingMode, OrderInputConstant.shippingMode)
    shippingMode!: ShippingMode;

    @Field(OrderInputConstant.weight)
    @IsNumber({ maxDecimalPlaces: 2 }, OrderInputConstant.weight)
    weight!: number;

    @Field(OrderInputConstant.isFragile)
    @IsBoolean(OrderInputConstant.isFragile)
    isFragile!: boolean;

    @Field(OrderInputConstant.boxHeight)
    @IsNumber({ maxDecimalPlaces: 2 }, OrderInputConstant.boxHeight)
    boxHeight!: number;

    @Field(OrderInputConstant.boxWidth)
    @IsNumber({ maxDecimalPlaces: 2 }, OrderInputConstant.boxWidth)
    boxWidth!: number;

    @Field(OrderInputConstant.boxLength)
    @IsNumber({ maxDecimalPlaces: 2 }, OrderInputConstant.boxLength)
    boxLength!: number;

    @Field(OrderInputConstant.codAmount)
    @IsNumber({ maxDecimalPlaces: 2 }, OrderInputConstant.codAmount)
    codAmount!: number;

    @Field(OrderInputConstant.totalAmount)
    @IsNumber({ maxDecimalPlaces: 2 }, OrderInputConstant.totalAmount)
    totalAmount!: number;

    @Field(() => [ProductInput], OrderInputConstant.products)
    @ValidateNested({ each: true })
    @IsArray(OrderInputConstant.products)
    products!: ProductInput[];
}

@InputType()
export class PincodeServiceabilityInput {
    
    @Field(() => Int, ADDRESS_VALIDATION.pincode)
    @IsInt(ADDRESS_VALIDATION.pincode)
    @IsNotEmpty(ADDRESS_VALIDATION.pincode)
    sourcePincode: number;

    @Field(() => Int, ADDRESS_VALIDATION.pincode)
    @IsInt(ADDRESS_VALIDATION.pincode)
    @IsNotEmpty(ADDRESS_VALIDATION.pincode)
    destinationPincode: number;
}

@InputType()
export class RateCalculatorInput {
    @Field(() => Int, ADDRESS_VALIDATION.pincode)
    @IsInt(ADDRESS_VALIDATION.pincode)
    @IsNotEmpty(ADDRESS_VALIDATION.pincode)
    sourcePincode: number;

    @Field(() => Int, ADDRESS_VALIDATION.pincode)
    @IsInt(ADDRESS_VALIDATION.pincode)
    @IsNotEmpty(ADDRESS_VALIDATION.pincode)
    destinationPincode: number;

    @Field(() => PaymentMode)
    @IsEnum(PaymentMode)
    paymentMode!: PaymentMode;

    @Field(() => ShippingMode, OrderInputConstant.shippingMode)
    @IsEnum(ShippingMode, OrderInputConstant.shippingMode)
    shippingMode!: ShippingMode;

    @Field(OrderInputConstant.weight)
    @IsNumber({ maxDecimalPlaces: 2 }, OrderInputConstant.weight)
    weight!: number;

    @Field(OrderInputConstant.boxHeight)
    @IsNumber({ maxDecimalPlaces: 2 }, OrderInputConstant.boxHeight)
    boxHeight!: number;

    @Field(OrderInputConstant.boxWidth)
    @IsNumber({ maxDecimalPlaces: 2 }, OrderInputConstant.boxWidth)
    boxWidth!: number;

    @Field(OrderInputConstant.boxLength)
    @IsNumber({ maxDecimalPlaces: 2 }, OrderInputConstant.boxLength)
    boxLength!: number;

    @Field(OrderInputConstant.codAmount)
    @IsNumber({ maxDecimalPlaces: 2 }, OrderInputConstant.codAmount)
    codAmount!: number;
}
import { OrderInputConstant } from "@/constants";
import { PaymentMode, ShippingMode } from "@prisma/client";
import { IsArray, IsBoolean, IsEnum, IsMongoId, IsNumber, IsString, Matches, Min, ValidateNested } from "class-validator";
import { Field, InputType, registerEnumType } from "type-graphql";

// create a graphql input type for order -> use below field

@InputType()
class ProductInput {
    @Field()
    @IsString()
    @Matches(/^[a-zA-Z\s]+$/)
    name!: string;

    @Field()
    @IsString()
    @Matches(/^[0-9]+$/)
    quantity!: number;

    @Field()
    @IsString()
    @Matches(/^[a-zA-Z\s]+$/)
    category!: string;

    @Field()
    @IsNumber()
    @Min(0)
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
    @IsMongoId(OrderInputConstant.pickupId)
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

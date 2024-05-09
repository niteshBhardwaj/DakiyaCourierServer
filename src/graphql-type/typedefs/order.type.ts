import { Field, ObjectType } from "type-graphql";
import { PickupAddressType } from "./pickup-address.type";
import { DropAddressType } from "./drop-address.type";

@ObjectType() 
export class OrderType {
    @Field({ nullable: true })
    id: string;

    @Field()
    pickupAddress: PickupAddressType;

    @Field()
    dropAddress: DropAddressType;

    @Field()
    orderId: string;

    @Field()
    awb: string;

    @Field()
    paymentMode: string;

    @Field()
    shippingMode: string;

    @Field()
    weight: number;

    @Field()
    isFragile: boolean;

    @Field()
    boxHeight: number;

    @Field()
    boxWidth: number;

    @Field()
    boxLength: number;

    @Field()
    codAmount: number;

    @Field({ nullable: true })
    waybill: string | null;

    @Field({ nullable: true })
    invoiceNo: string | null;

    @Field()
    totalAmount: number;

    @Field({ nullable: true })
    expectedDeliveryDate: Date;

    @Field()
    reverseInTransit: boolean;

    @Field()
    status: string;

    @Field()
    userId: string;

    @Field({ nullable: true })
    courierId: string;

    @Field({ nullable: true })
    createdAt: string;
    // products: any[];
    // tracking: any[];
}
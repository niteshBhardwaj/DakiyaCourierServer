import { TicketConstant } from "~/constants/ticket.constant";
import { Ticket } from "@prisma/client";
import { IsMongoId, IsNotEmpty } from "class-validator";
import { InputType, Field } from "type-graphql";


@InputType()
export class TicketInput {

    @Field(TicketConstant.subject)
    @IsNotEmpty({message: TicketConstant.subject.message})
    subject: string;

    @Field(TicketConstant.description)
    @IsNotEmpty({message: TicketConstant.description.message})
    description: string;

    @Field(TicketConstant.orderId)
    @IsMongoId({message: TicketConstant.orderId.message})
    @IsNotEmpty({message: TicketConstant.orderId.message})
    orderId: string;
}


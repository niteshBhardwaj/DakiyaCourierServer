import { type UserContext } from '@/interfaces/auth.interface';
import { Inject, Service } from 'typedi';
import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { QUERY_DESC, REQUEST } from '@/constants';
import { MessageType } from '../typedefs/common.type';
import TicketService from '@/services/ticket.service';
import { TicketInput } from '../args/ticket.input';

@Service()
@Resolver()
export class TicketResolver {
  @Inject()
  ticketService: TicketService;

  @Query(() => MessageType, {
    description: QUERY_DESC.CREATE_ORDER,
  })
  async getAllTickets(
    @Ctx() { user: { userId } }: { user: UserContext },
    ): Promise<MessageType> {
    await this.ticketService.getTicketList({ userId });
    return { message: 'Order created successfully'};
  }

  @Mutation(() => MessageType, {
    description: QUERY_DESC.CREATE_ORDER,
  })
  async createTicket(
    @Arg(REQUEST) args: TicketInput,
    @Ctx() { user: { userId } }: { user: UserContext },
    ): Promise<MessageType> {
    await this.ticketService.createTicket({input: args, userId });
    return { message: 'Order created successfully'};
  }

}

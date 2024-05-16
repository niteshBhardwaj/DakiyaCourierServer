import LoggerInstance from '~/plugins/logger';
import { Service, Inject } from 'typedi';
import { EventDispatcher, EventDispatcherInterface } from '~/decorators/eventDispatcher';
import { PrismaClient } from '@prisma/client';
import { TicketInput } from '~/graphql-type/args/ticket.input';

@Service()
export default class TicketService {
  constructor(
    @Inject('prisma') private prisma: PrismaClient,
    @Inject('logger') private logger: typeof LoggerInstance,
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
  ) {}

  public async getTicketList({ userId } : { userId: string }) {
    return this.prisma.order.findMany({
      where: {
        userId,
      }
    })
  }

  public async createTicket({ input, userId} : { input: TicketInput; userId: string }) {
    return this.prisma.ticket.create({
      data: {
        userId,
        ...input,
      }
    })
  }

}

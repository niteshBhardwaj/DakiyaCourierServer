import { type UserContext } from '@/interfaces/auth.interface';
import { Inject, Service } from 'typedi';
import { Arg, Authorized, Ctx, Info, Mutation, type ParameterDecorator, Query, Resolver } from 'type-graphql';
import { QUERY_DESC, REQUEST } from '@/constants';
import { CreateOrderInput } from '../args/order.input';
import OrderService from '@/services/order.service';
import { MessageType } from '../typedefs/common.type';
import { OrderType } from '../typedefs/order.type';
import { OffsetInput } from '../args/common.input';

@Service()
@Resolver()
export class orderResolver {
  @Inject()
  orderService: OrderService;

  @Authorized()
  @Query(() => [OrderType], {
    description: QUERY_DESC.CREATE_ORDER,
  })
  async getOrderList(
    @Arg(REQUEST) args: OffsetInput,
    @Ctx() { user: { userId } }: { user: UserContext },
    @Info() info: ParameterDecorator,
    ): Promise<OrderType[]> {
    return this.orderService.getOrderList({input: args, userId }, info);
  }

  @Authorized()
  @Mutation(() => OrderType, {
    description: QUERY_DESC.CREATE_ORDER,
  })
  async editOrder(
    @Arg(REQUEST) args: CreateOrderInput,
    @Ctx() { user: { userId } }: { user: UserContext },
    @Info() info: ParameterDecorator,
    ): Promise<OrderType> {
    const order = await this.orderService.editOrder({input: args, userId });
    return order;
  }

  @Authorized()
  @Mutation(() => OrderType, {
    description: QUERY_DESC.CREATE_ORDER,
  })
  async createOrder(
    @Arg(REQUEST) args: CreateOrderInput,
    @Ctx() { user: { userId } }: { user: UserContext },
    @Info() info: ParameterDecorator,
    ): Promise<OrderType> {
    const order = await this.orderService.createOrder({input: args, userId }, info);
    return order;
  }
}

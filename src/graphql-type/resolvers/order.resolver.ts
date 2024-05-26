import { type UserContext } from '~/interfaces/auth.interface';
import { Inject, Service } from 'typedi';
import { Arg, Authorized, Ctx, Info, Mutation, Query, Resolver } from 'type-graphql';
import { QUERY_DESC, REQUEST } from '~/constants';
import { CreateOrderInput, OrderDetailInput } from '../args/order.input';
import OrderService from '~/services/order.service';
import { OrderType } from '../typedefs/order.type';
import { OffsetInput } from '../args/common.input';
import { type GraphQLResolveInfo } from 'graphql';
import { TrackingInput } from '../typedefs/tracking.input';

@Service()
@Resolver()
export class orderResolver {
  @Inject()
  orderService: OrderService;

  @Query(() => OrderType, {
    description: QUERY_DESC.CREATE_ORDER,
  })
  async getOrderDetails(
    @Arg(REQUEST) args: OrderDetailInput,
    @Ctx() { user: { userId } }: { user: UserContext },
    @Info() info: GraphQLResolveInfo,
    ): Promise<OrderType> {
    return this.orderService.getOrderDetail({input: args, userId }, info);
  }

  @Query(() => [TrackingInput], {
    description: QUERY_DESC.CREATE_ORDER,
  })
  async getTracking(
    @Arg(REQUEST) args: OrderDetailInput,
    @Ctx() { user: { userId } }: { user: UserContext },
    @Info() info: GraphQLResolveInfo,
    ): Promise<TrackingInput[]> {
    return this.orderService.getTracking({input: args, userId }, info);
  }

  @Authorized()
  @Query(() => [OrderType], {
    description: QUERY_DESC.CREATE_ORDER,
  })
  async getOrderList(
    @Arg(REQUEST) args: OffsetInput,
    @Ctx() { user: { userId } }: { user: UserContext },
    @Info() info: GraphQLResolveInfo,
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
    @Info() info: GraphQLResolveInfo,
    ): Promise<OrderType> {
    const order = await this.orderService.editOrder({input: args, userId }, info);
    return order;
  }

  @Authorized()
  @Mutation(() => OrderType, {
    description: QUERY_DESC.CREATE_ORDER,
  })
  async createOrder(
    @Arg(REQUEST) args: CreateOrderInput,
    @Ctx() { user: { userId } }: { user: UserContext },
    @Info() info: GraphQLResolveInfo,
    ): Promise<OrderType> {
    const order = await this.orderService.createOrder({input: args, userId }, info);
    return order;
  }
}

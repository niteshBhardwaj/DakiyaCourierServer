import { type UserContext } from '@/interfaces/auth.interface';
import { Inject, Service } from 'typedi';
import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { QUERY_DESC, REQUEST } from '@/constants';
import { CreateOrderInput, PincodeServiceabilityInput } from '../args/order.input';
import OrderService from '@/services/order.service';
import { MessageResp } from '../typedefs/common.type';

@Service()
@Resolver()
export class orderResolver {
  @Inject()
  orderService: OrderService;

  @Query(() => MessageResp, {
    description: QUERY_DESC.CREATE_ORDER,
  })
  async getOrderList(
    @Arg(REQUEST) args: CreateOrderInput,
    @Ctx() { user: { userId } }: { user: UserContext },
    ): Promise<MessageResp> {
    await this.orderService.createOrder({input: args, userId });
    return { message: 'Order created successfully'};
  }

  @Mutation(() => MessageResp, {
    description: QUERY_DESC.CREATE_ORDER,
  })
  async editOrder(
    @Arg(REQUEST) args: CreateOrderInput,
    @Ctx() { user: { userId } }: { user: UserContext },
    ): Promise<MessageResp> {
    await this.orderService.editOrder({input: args, userId });
    return { message: 'Order created successfully'};
  }

  @Mutation(() => MessageResp, {
    description: QUERY_DESC.CREATE_ORDER,
  })
  async createOrder(
    @Arg(REQUEST) args: CreateOrderInput,
    @Ctx() { user: { userId } }: { user: UserContext },
    ): Promise<MessageResp> {
    await this.orderService.createOrder({input: args, userId });
    return { message: 'Order created successfully'};
  }

  @Mutation(() => MessageResp, {
    description: QUERY_DESC.CREATE_ORDER,
  })
  async pincodeServiceability(
    @Arg(REQUEST) args: PincodeServiceabilityInput,
    ): Promise<MessageResp> {
    await this.orderService.pincodeServicebility(args); 
    return { message: 'Pincode serviceability checked successfully'};
  }
}

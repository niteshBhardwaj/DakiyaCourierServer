import { type UserContext } from '@/interfaces/auth.interface';
import UserService from '@/services/user.service';
import { Inject, Service } from 'typedi';
import { Arg, Ctx, Mutation, Resolver } from 'type-graphql';
import { QUERY_DESC, REQUEST } from '@/constants';
import OtpService from '@/services/otp.service';
import { CreateOrderInput, pincodeServiceabilityInput } from '../args/order.input';
import OrderService from '@/services/order.service';
import { MessageResp } from '../typedefs/common.type';

@Service()
@Resolver()
export class orderResolver {
  @Inject()
  orderService: OrderService;

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
    @Arg(REQUEST) args: pincodeServiceabilityInput,
    @Ctx() { user: { userId } }: { user: UserContext },
    ): Promise<MessageResp> {
    await this.orderService.pincodeServicebility({input: args, userId });
    return { message: 'Order created successfully'};
  }

  
}

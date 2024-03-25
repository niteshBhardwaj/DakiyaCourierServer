import { type UserContext } from '@/interfaces/auth.interface';
import { Inject, Service } from 'typedi';
import { Arg, Query, Resolver } from 'type-graphql';
import { QUERY_DESC, REQUEST } from '@/constants';
import { PincodeServiceabilityInput, RateCalculatorInput } from '../args/order.input';
import { MessageResp } from '../typedefs/common.type';
import PincodeService from '@/services/pincode.service';

@Service()
@Resolver()
export class orderResolver {
  @Inject()
  pincodeService: PincodeService;


  @Query(() => MessageResp, {
    description: QUERY_DESC.CREATE_ORDER,
  })
  async pincodeServiceability(
    @Arg(REQUEST) args: PincodeServiceabilityInput,
    ): Promise<MessageResp> {
    await this.pincodeService.pincodeServicebility(args); 
    return { message: 'Pincode serviceability checked successfully'};
  }

  @Query(() => MessageResp, {
    description: QUERY_DESC.CREATE_ORDER,
  })
  async rateCalculator(
    @Arg(REQUEST) args: RateCalculatorInput,
    ): Promise<MessageResp> {
    await this.pincodeService.rateCalculator(args); 
    return { 
      message: 'Pincode serviceability checked successfully',
    };
  }
}

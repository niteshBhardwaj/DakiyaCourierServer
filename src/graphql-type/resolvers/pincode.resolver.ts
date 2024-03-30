import { Inject, Service } from 'typedi';
import { Arg, Query, Resolver } from 'type-graphql';
import { QUERY_DESC, REQUEST } from '@/constants';
import { PincodeServiceabilityInput, RateCalculatorInput } from '../args/order.input';
import PincodeService from '@/services/pincode.service';
import { PincodeServiceabilityType, RateCalulatorType } from '../typedefs/pincode.type';

@Service()
@Resolver()
export class pincodeResolver {
  @Inject()
  pincodeService: PincodeService;


  @Query(() => PincodeServiceabilityType, {
    description: QUERY_DESC.PINCODE_SERVICEABILITY,
  })
  async pincodeServiceability(
    @Arg(REQUEST) args: PincodeServiceabilityInput,
    ): Promise<PincodeServiceabilityType> {
    const isServiceable = await this.pincodeService.pincodeServicebility(args); 
    return { isServiceable, message: isServiceable ? 'Pincode serviceable' : 'Pincode not serviceable' };
  }

  @Query(() => RateCalulatorType, {
    description: QUERY_DESC.CREATE_ORDER,
  })
  async rateCalculator(
    @Arg(REQUEST) args: RateCalculatorInput,
    ): Promise<RateCalulatorType> {
    const { amount } = await this.pincodeService.rateCalculator(args);
    return { message: amount > 0 ?`Total amount will be ${amount}` : 'Rate not found', amount };
  }
}

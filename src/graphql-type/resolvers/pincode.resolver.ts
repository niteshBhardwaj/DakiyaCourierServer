import { Inject, Service } from 'typedi';
import { Arg, Query, Resolver } from 'type-graphql';
import { QUERY_DESC, REQUEST } from '@/constants';
import { PincodeInfoInput, PincodeServiceabilityInput, RateCalculatorInput } from '../args/order.input';
import PincodeService from '@/services/pincode.service';
import { PincodeInfoType, PincodeServiceabilityType, RateCalculatorType } from '../typedefs/pincode.type';
import RateCalculatorService from '@/services/rate-calculator.service';

@Service()
@Resolver()
export class pincodeResolver {
  @Inject()
  pincodeService: PincodeService;
  @Inject()
  rateCalculatorService: RateCalculatorService

  @Query(() => PincodeInfoType, {
    description: QUERY_DESC.PINCODE_SERVICEABILITY,
  })
  async getPincodeInfo(
    @Arg(REQUEST) args: PincodeInfoInput,
    ) {
    return this.pincodeService.getPincodeInfo(args);
  }

  @Query(() => PincodeServiceabilityType, {
    description: QUERY_DESC.PINCODE_SERVICEABILITY,
  })
  async pincodeServiceability(
    @Arg(REQUEST) args: PincodeServiceabilityInput,
    ): Promise<PincodeServiceabilityType> {
    const { isServiceable } = await this.pincodeService.pincodeServiceability(args); 
    return { isServiceable, message: isServiceable ? 'Pincode serviceable' : 'Pincode not serviceable' };
  }

  @Query(() => RateCalculatorType, {
    description: QUERY_DESC.CREATE_ORDER,
  })
  async rateCalculator(
    @Arg(REQUEST) args: RateCalculatorInput,
    ) {
    const calculatedRate = await this.rateCalculatorService.rateCalculator(args);
    const amount = calculatedRate.totalAmountWithTax;
    return { ...calculatedRate, message: amount > 0 ?`Total amount will be ${amount}` : 'Rate not found', amount };
  }
}

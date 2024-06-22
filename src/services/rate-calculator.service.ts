import LoggerInstance from '~/plugins/logger';
import Container, { Service, Inject } from 'typedi';
import { EventDispatcher, EventDispatcherInterface } from '~/decorators/eventDispatcher';
import { AppConfig, PrismaClient, RateCard } from '@prisma/client';
import { RateCalculatorInput } from '~/graphql-type/args/order.input';
import { APP_CONFIG, LOGGER, PRISMA, RATE_CARDS } from '~/constants';
import { addTaxesCodCharges, findZoneAndAmount, getActualWeight } from '~/utils';
import { badUserInputException } from '~/utils/exceptions.util';
import PincodeService from './pincode.service';
import RateCardService from './rate-card-service';

@Service()
export default class RateCalculatorService {
  constructor(
    @Inject(PRISMA) private prisma: PrismaClient,
    @Inject(LOGGER) private logger: typeof LoggerInstance,
    private pincodeService: PincodeService,
    private rateCardService: RateCardService,
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
  ) {}

  public async rateCalculator(input : RateCalculatorInput) {
    const { sourcePincode, destinationPincode, paymentMode, shippingMode, weight, boxHeight, boxWidth, boxLength, codAmount } = input
    const { isServiceable, info } = await this.pincodeService.pincodeServiceability({ sourcePincode, destinationPincode });
    if(!isServiceable) {
      throw badUserInputException('Pincode not serviceable');
    }
    const pincodeInfo = await this.pincodeService.getPincodeInfoBySourceAndDestination({ sourcePincode, destinationPincode })
    const rateCard = await this.rateCardService.findRateCard({});
    if(!rateCard) {
      throw badUserInputException('Rate card not found');
    } 
    // check if dead weight or volumetric weight
    const chargedWeight = getActualWeight({ weight, boxHeight, boxWidth, boxLength });
    
    const source = pincodeInfo.find(item => item.pincode === sourcePincode);
    const destination = pincodeInfo.find(item => item.pincode === destinationPincode);
    
    if(!(source && destination)) {
      throw badUserInputException('Pincode is not available to service');
    }
    
    // find zone and amount
    const { amount, zone } = findZoneAndAmount({ weight: chargedWeight, source, destination, shippingMode, rateCard});
    const appConfig = Container.get(APP_CONFIG) as AppConfig[];

    // get actual price breakup
    const priceBreakup = addTaxesCodCharges({ amount, appConfig: appConfig[0], paymentMode, codAmount });
    return {
      rateCardId: rateCard.id,
      chargedWeight,
      zone,
      ...priceBreakup
    }
  }   
}

import LoggerInstance from '@/plugins/logger';
import { Service, Inject } from 'typedi';
import { EventDispatcher, EventDispatcherInterface } from '@/decorators/eventDispatcher';
import { PrismaClient } from '@prisma/client';
import { PincodeServiceabilityInput, RateCalculatorInput } from '@/graphql-type/args/order.input';

@Service()
export default class PincodeService {
  constructor(
    @Inject('prisma') private prisma: PrismaClient,
    @Inject('logger') private logger: typeof LoggerInstance,
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
  ) {}

  public async rateCalculator({ sourcePincode, destinationPincode } : RateCalculatorInput) {
    const isServiceable = await this.pincodeServicebility({ sourcePincode, destinationPincode });
    if(!isServiceable) {
      return {
        amount: 0,
      }
    }
    // TODO: calculate rate
    return {
      amount: 200,
    }
  }  

  public async pincodeServicebility({ sourcePincode, destinationPincode } : PincodeServiceabilityInput): Promise<boolean> {
    let matchCount = 2;
    const pincodeList = await this.prisma.pincodeAvailability.groupBy({
      by: ['courierId'],
      where: { 
        OR: [
          {
            pincode: sourcePincode,
          },
          {
            pincode: destinationPincode
          }
        ]
      },
      _count: {
        pincode: true
      }
    })
    // if source and destination are same
    if(sourcePincode === destinationPincode) {
      matchCount = 1;
    }


    return pincodeList.some(item => item._count.pincode >= matchCount);
  }  
}

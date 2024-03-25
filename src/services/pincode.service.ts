import LoggerInstance from '@/plugins/logger';
import { Service, Inject } from 'typedi';
import { EventDispatcher, EventDispatcherInterface } from '@/decorators/eventDispatcher';
import { PrismaClient } from '@prisma/client';
import { PincodeServiceabilityInput } from '@/graphql-type/args/order.input';

@Service()
export default class PincodeService {
  constructor(
    @Inject('prisma') private prisma: PrismaClient,
    @Inject('logger') private logger: typeof LoggerInstance,
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
  ) {}

  public async rateCalculator({ sourcePincode, destinationPincode } : PincodeServiceabilityInput) {
    return this.prisma.pincodeAvailability.findMany({ 
      where: { 
        AND: [
          {
            pincode: sourcePincode
          },
          {
            pincode: destinationPincode
          }
        ]
      }
    })
  }  

  public async pincodeServicebility({ sourcePincode, destinationPincode } : PincodeServiceabilityInput) {
    return this.prisma.pincodeAvailability.findMany({ 
      where: { 
        AND: [
          {
            pincode: sourcePincode
          },
          {
            pincode: destinationPincode
          }
        ]
      }
    })
  }  

}

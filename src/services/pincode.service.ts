import LoggerInstance from '~/plugins/logger';
import Container, { Service, Inject } from 'typedi';
import { EventDispatcher, EventDispatcherInterface } from '~/decorators/eventDispatcher';
import { PincodeAvailability, PrismaClient } from '@prisma/client';
import { PincodeServiceabilityInput, RateCalculatorInput } from '~/graphql-type/args/order.input';
import { LOGGER, PRISMA } from '~/constants';
import { badUserInputException } from '~/utils/exceptions.util';

@Service()
export default class PincodeService {
constructor(
    @Inject(PRISMA) private prisma: PrismaClient,
    @Inject(LOGGER) private logger: typeof LoggerInstance,
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
  ) {}

  public async getPincodeInfo({ pincode }: { pincode: number }) {
    const pincodeInfo = await this.prisma.pincode.findUnique({ where: { pincode }, include: { Admin2: true, Admin1: true } })
    if(!pincodeInfo) {
      throw badUserInputException('Pincode not found')
    }
    return pincodeInfo;
  }

  public async getPincodeInfoBySourceAndDestination({ sourcePincode, destinationPincode }: { sourcePincode: number, destinationPincode: number }) {
    const pincodeInfo = await this.prisma.pincode.findMany({
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
      select: {
        pincode: true,
        Admin2: {
          select: {
            name: true,
            code: true,
            tags: true,
            Admin1: {
              select: {
                name: true,
                code: true,
                tags: true
              }
            }
          }
        }
      }
    })
    return pincodeInfo;
  }

  public async pincodeServiceability({ sourcePincode, destinationPincode } : PincodeServiceabilityInput): Promise<{ info: { [key: string]: PincodeAvailability[] }, isServiceable: boolean}> {
    let matchCount = 2;
    const pincodeList = await this.prisma.pincodeAvailability.findMany({
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
      select: {
        isPrepaid: true,
        isCash: true,
        isCod: true,
        isOda: false,
        courierId: true,
        pincode: true
      }
    })
    // if source and destination are same
    if(sourcePincode === destinationPincode) {
      matchCount = 1;
    }

    // groupby courierId
    const infoItems = pincodeList.reduce((acc, item) => {
      if(!acc[item.courierId]) {
        acc[item.courierId] = []
      }
      acc[item.courierId].push(item as PincodeAvailability)
      return acc
    }, {} as { [key: string]: PincodeAvailability[] })

    return {
      info: infoItems,
      isServiceable: Object.values(infoItems).some(list => list.length >= matchCount),
    }
    
  }  

  public async loadPincode({ courierId, data }: { courierId: string; data: PincodeAvailability[] }) {
    if (data?.length) {
        await this.prisma.pincodeAvailability.deleteMany({
          where: {
            courierId
          }
        })
        await this.prisma.pincodeAvailability.createMany({
          data
        })
      }
  }
}

import LoggerInstance from '~/plugins/logger';
import Container, { Service, Inject } from 'typedi';
import { EventDispatcher, EventDispatcherInterface } from '~/decorators/eventDispatcher';
import { PrismaClient, RateCard } from '@prisma/client';
import { LOGGER, PRISMA, RATE_CARDS } from '~/constants';
import { badUserInputException } from '~/utils/exceptions.util';

@Service()
export default class RateCardService {
  constructor(
    @Inject(PRISMA) private prisma: PrismaClient,
    @Inject(LOGGER) private logger: typeof LoggerInstance,
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
  ) {}


  public async findRateCard({ id }: { id?: string }) {
    const rateCards = Container.get(RATE_CARDS) as RateCard[];
    const rateCard = rateCards.find((card) => card.id === id);
    if(id && !rateCard) {
      throw badUserInputException('Rate card not found');
    }
    // get default rate card
    return rateCards.find(card => card.tags.includes('default'));
  }

  public async getUserRateCard({ userId }: { userId: string }) {
    const user = await this.prisma.user.findFirst({ where: { id: userId }, select: { rateCardId: true }});
    return this.findRateCard({ id: user?.rateCardId });
  }

  public async getDefaultRateCard() {
    return this.findRateCard({});
  }

}

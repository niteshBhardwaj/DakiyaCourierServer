import './events';
import LoggerInstance from '~/plugins/logger';
import apolloLoader from './apollo';
import Container from 'typedi';
import prisma from './prisma';
import mailer from './mailer';
import { APP_CONFIG, COURIER_PARTNER, LOGGER, PRISMA, RATE_CARDS } from '~/constants';
import { HonoBase } from 'hono/hono-base';
Container.set(PRISMA, prisma);
Container.set(LOGGER, LoggerInstance);
Container.set('mailer', mailer())
export default async ({ app }: { app: HonoBase }) => {
  //* initialize apollo
  await apolloLoader(app);

};

export const loadAppData = async () => {
  try {
    Container.set(APP_CONFIG, await prisma.appConfig.findMany());
    Container.set(COURIER_PARTNER, await prisma.courierPartner.findMany());
    Container.set(RATE_CARDS, await prisma.rateCard.findMany());
  } catch(e) {
    console.log(e)
  }
}

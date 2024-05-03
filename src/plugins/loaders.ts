import LoggerInstance from '@/plugins/logger';
import apolloLoader from './apollo';
import fastifyLoader from './fastify';
import './events';
import { FastifyInstance } from 'fastify';
import Container from 'typedi';
import prisma from './prisma';
import mailer from './mailer';
import { APP_CONFIG, COURIER_PARTNER, LOGGER, PRISMA, RATE_CARDS } from '@/constants';
// Initializes the fastify, apollo server and load dependency.
Container.set(PRISMA, prisma);
Container.set(LOGGER, LoggerInstance);
Container.set('mailer', mailer())
export default async ({ app }: { app: FastifyInstance }) => {
  //* load fastify routes and other configuration
  await fastifyLoader({ app });
  //* initialize apollo
  await apolloLoader(app);

  // cache records
  Container.set(APP_CONFIG, await prisma.appConfig.findMany());
  Container.set(COURIER_PARTNER, await prisma.courierPartner.findMany());
  Container.set(RATE_CARDS, await prisma.rateCard.findMany());
};

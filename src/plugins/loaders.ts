import LoggerInstance from '@/plugins/logger';
import apolloLoader from './apollo';
import fastifyLoader from './fastify';
import './events';
import { FastifyInstance } from 'fastify';
import Container from 'typedi';
import prisma from './prisma';
import mailer from './mailer';
// Initializes the fastify, apollo server and load dependency.
Container.set('prisma', prisma);
Container.set('logger', LoggerInstance);
Container.set('mailer', mailer())
export default async ({ app }: { app: FastifyInstance }) => {
  //* load fastify routes and other configuration
  await fastifyLoader({ app });
  //* initialize apollo
  await apolloLoader(app);

  // cache records
  Container.set('courierPartners', await prisma.courierPartner.findMany());
  Container.set('rateCards', await prisma.rateCard.findMany());
};

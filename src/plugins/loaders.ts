import apolloLoader from './apollo';
import fastifyLoader from './fastify';
import './events';
import { FastifyInstance } from 'fastify';
// Initializes the fastify, apollo server and load dependency.
export default async ({ app }: { app: FastifyInstance }) => {
  //* load fastify routes and other configuration
  await fastifyLoader({ app });
  
  //* initialize apollo
  await apolloLoader(app);
};

import LoggerInstance from '~/plugins/logger';
import { FastifyInstance, FastifyRequest } from 'fastify';
import { buildSchema } from 'type-graphql';
import resolvers from '~/graphql-type/resolvers';
import { authChecker } from '~/middlewares/auth.middleware';
import Container from 'typedi';
import { MSG_SERVER_STARTUP } from '~/constants';
import { formatError } from '~/middlewares/error.middleware';
import { apolloContext } from '~/middlewares/user.middleware';
import fastifyApollo, { fastifyApolloDrainPlugin } from '@as-integrations/fastify';
import { ApolloServer } from '@apollo/server';
import GraphQLJSON from 'graphql-type-json';

export default async (app: FastifyInstance) => { 
  const schema = await buildSchema({
    resolvers,
    authChecker,
    // register the 3rd party IOC container
    container: Container,
    validate: true,
    scalarsMap: [{ type: Object, scalar: GraphQLJSON }],
  });

  // Start a GraphQL server.
  const apollo = new ApolloServer({
    schema,
    formatError,
    plugins: [
      fastifyApolloDrainPlugin(app),
      {
        async serverWillStart() {
          LoggerInstance.info(MSG_SERVER_STARTUP);
        },
      },
    ],
    introspection: true, //config.NODE_ENV !== 'production'
    //csrfPrevention: true,
  });
  // Starts the server.
  await apollo.start();
  await app.register(fastifyApollo(apollo), {
    //@ts-ignore
    context: apolloContext,
  });
  return apollo;
};

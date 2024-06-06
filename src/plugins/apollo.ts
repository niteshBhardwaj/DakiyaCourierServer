import LoggerInstance from '~/plugins/logger';
import { buildSchema } from 'type-graphql';
import resolvers from '~/graphql-type/resolvers';
import { authChecker } from '~/middlewares/auth.middleware';
import Container from 'typedi';
import { MSG_SERVER_STARTUP } from '~/constants';
import { formatError } from '~/middlewares/error.middleware';
import { apolloContext } from '~/middlewares/user.middleware';
import { ApolloServer } from '@apollo/server';
import GraphQLJSON from 'graphql-type-json';
import { HonoBase } from 'hono/hono-base';
import { honoApollo } from './hono-apollo';

export default async (app: HonoBase) => { 
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
  app.route(
    '/graphql',
    honoApollo(apollo, async ctx => apolloContext(ctx)),
  );
  return apollo;
};

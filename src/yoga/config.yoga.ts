import {
  createEnvelopQueryValidationPlugin,
  constraintDirectiveTypeDefs,
} from "graphql-constraint-directive";
import { createSchema } from "graphql-yoga";
const { mergeTypeDefs, mergeResolvers } = require("@graphql-tools/merge");
import { loadFiles } from "@graphql-tools/load-files";
import { resolvers } from "schema/resolvers.generated";
import { useJWT } from '@graphql-yoga/plugin-jwt'

const signingKey = Bun.env.JWT_SECRET as string;

export default async () => {
  const types = await loadFiles("src/schema/graphql/**/*.graphql");
  // const resolvers = await loadFiles("src/graphql/resolvers/**/*.resolver.ts");
  return {
    graphqlEndpoint: "/",
    schema: createSchema({
      typeDefs: mergeTypeDefs([constraintDirectiveTypeDefs, types]),
      // resolvers: mergeResolvers(resolvers),
      resolvers
    }),
    plugins: [
      createEnvelopQueryValidationPlugin(),
      useJWT({
      issuer: 'http://dakiay.com',
      signingKey
    })
    ],
  };
};

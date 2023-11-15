import {
  createEnvelopQueryValidationPlugin,
  constraintDirectiveTypeDefs,
} from "graphql-constraint-directive";
import { createSchema } from "graphql-yoga";
const { mergeTypeDefs, mergeResolvers } = require("@graphql-tools/merge");
import { loadFiles } from "@graphql-tools/load-files";

export default async () => {
  const types = await loadFiles("src/graphql/typeDefs/**/*.graphql");
  const resolvers = await loadFiles("src/graphql/resolvers/**/*.resolver.ts");
  return {
    graphqlEndpoint: "/",
    schema: createSchema({
      typeDefs: mergeTypeDefs([constraintDirectiveTypeDefs, types]),
      resolvers: mergeResolvers(resolvers),
    }),
    plugins: [createEnvelopQueryValidationPlugin()],
  };
};

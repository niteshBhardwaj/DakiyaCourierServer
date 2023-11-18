import {
  createEnvelopQueryValidationPlugin,
  constraintDirectiveTypeDefs,
} from "graphql-constraint-directive";
import { createSchema } from "graphql-yoga";
const { mergeTypeDefs, mergeResolvers } = require("@graphql-tools/merge");
import { loadFiles } from "@graphql-tools/load-files";
import { resolvers } from "schema/resolvers.generated";
import { authDirectiveTransformer, authDirectiveTypeDefs } from "schema/directives/auth.directive";
import { authMiddleware } from "middlewares/auth.middleware";
export default async () => {
  const types = await loadFiles("src/schema/graphql/**/*.graphql");
  let schema = createSchema({
      typeDefs: mergeTypeDefs([
        authDirectiveTypeDefs,
        constraintDirectiveTypeDefs,
        types,
      ]),
      // resolvers: mergeResolvers(resolvers),
      resolvers,
    })
    schema = authDirectiveTransformer(schema);
  // const resolvers = await loadFiles("src/graphql/resolvers/**/*.resolver.ts");
  return {
    graphqlEndpoint: "/",
    schema,
    context: async ({request}: { request: Request}) => {
      console.log(request.headers);
      const response = await authMiddleware(request)
      return response;
    },
    plugins: [
      createEnvelopQueryValidationPlugin(),
    ],
  };
};

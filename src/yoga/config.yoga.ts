import { createSchema } from "graphql-yoga"
import { loadFiles } from "@graphql-tools/load-files";
import { queryResolvers } from "../graphql/resolvers/main.resolver";
export default async () => ({
  graphqlEndpoint: "/",
  schema: createSchema({
    typeDefs: await loadFiles("src/graphql/typeDefs/**/*.graphql"),
    resolvers: {
      Query: queryResolvers,
    },
  }),
});
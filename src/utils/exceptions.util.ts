import { GraphQLError } from "graphql";

// Creates a new instance of the HttpException class
export const httpException = function httpException(
  code: number,
  message: string
) {
  return new GraphQLError(message, {
    extensions: {
      http: {
        code,
      },
    },
  });
};

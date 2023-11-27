import { GraphQLError } from "graphql";
import { ApolloServerErrorCode } from '@apollo/server/errors';

export const badUserInputException = (message: string) => {
    return new GraphQLError(message, {
      extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
    });
};
export const badRequestException = (message: string, code?: string) => {
    return new GraphQLError(message, {
    extensions: { code: code || ApolloServerErrorCode.BAD_REQUEST },
  });
};


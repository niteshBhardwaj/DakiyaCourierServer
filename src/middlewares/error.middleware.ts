import { GraphQLFormattedError } from 'graphql';
import { unwrapResolverError } from '@apollo/server/errors';

import { GraphQLResponse } from '@apollo/server';

export const formatError = (formattedError: GraphQLFormattedError, error: unknown) => {
  // Don't give the specific errors to the client.
  console.log(error);
  // Don't give the specific errors to the client.

  // if (unwrapResolverError(error)) {
  //   return { message: 'Internal server error' };
  // }

  // Strip `Validation: ` prefix and use `extensions.code` instead
  if (formattedError.message.startsWith('Validation:')) {
    return {
      ...formattedError,
      message: formattedError.message.replace(/^Validation: /, ''),
      extensions: { ...formattedError?.extensions, code: 'VALIDATION' },
    };
  }

  // Otherwise, return the original error. The error can also
  // be manipulated in other ways, as long as it's returned.
  return formattedError;
};

export const willSendResponse = async ({ response }: { response: any }) => {
  if (response?.errors?.[0]) {
    const code = response?.errors?.[0].extensions?.code;
    const http = response.http as NonNullable<GraphQLResponse['http']>;
    if(!isNaN(code)) {
      http.status = code;
    }
  }
}
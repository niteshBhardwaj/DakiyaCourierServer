import { GraphQLError } from 'graphql';

// Creates a new instance of the HttpException class
export class HttpException extends GraphQLError {
  constructor(code: number, message: string) {
    super(message, {
      extensions: {
        http: {
          code,
        },
      },
    });

    Object.defineProperty(this, 'HttpException', { value: message });
  }
}

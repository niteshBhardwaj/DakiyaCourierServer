import { NowRequestHandler } from 'fastify-now';
import { Type } from '@sinclair/typebox';

export const GET: NowRequestHandler = async function () {
  return { hello: 'world1' };
};

GET.opts = {
  schema: {
    response: {
      200: Type.Object({
        hello: Type.String(),
      }),
    },
  },
};

import { NowRequestHandler } from 'fastify-now';
import { Type } from '@sinclair/typebox';

export const GET: NowRequestHandler = async function () {
  return { PING: 'PONG' };
};

GET.opts = {
  schema: {
    response: {
      200: Type.Object({
        PING: Type.String(),
      }),
    },
  },
};

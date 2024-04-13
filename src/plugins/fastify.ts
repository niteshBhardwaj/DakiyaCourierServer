import path from 'node:path';
import now from 'fastify-now';
import { FastifyInstance } from 'fastify';
import config from '@/plugins/config';

// Register Fastify routes.
export default async ({ app }: { app: FastifyInstance; }) => {
  await app.register(config);
  await app.register(now, {
    routesFolder: path.join(__dirname, '../routes'),
  });
  // app.register(cookie, {
  //   secret: 'my-secret', // TODO: - for cookies signature
  //   parseOptions: {}, // TODO: - options for parsing cookies
  // });
};

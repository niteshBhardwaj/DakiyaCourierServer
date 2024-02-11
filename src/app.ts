import "reflect-metadata";
import fastify, { FastifyInstance } from 'fastify';
import { config } from '@plugins/config';
import loaders from "@plugins/loaders";

const fastifyOption: any = {
  ajv: {
    customOptions: {
      removeAdditional: "all",
      coerceTypes: true,
      useDefaults: true,
    }
  },
  // logger: {
  //   level: process.env.LOG_LEVEL,
  // },
};

const startApp = async () => {
  const app = fastify(fastifyOption) as unknown as FastifyInstance;
  await loaders({ app });
  await app.ready();

  if (process.env.NODE_ENV !== 'test') {
    process.on('unhandledRejection', (err) => {
      console.error(err);
      process.exit(1);
    });

    void app.listen(
      { port: app.config.API_PORT ?? 5050, host: app?.config?.API_HOST },
      (_err, address) => {
        console.log(`Server started at: ${address}`);
      },
    );

    for (const signal of ['SIGINT', 'SIGTERM']) {
      process.on(signal, () =>
        app.close().then((err) => {
          console.log(`close application on ${signal}`);
          process.exit(err ? 1 : 0);
        }),
      );
    }
  }
  return app;
}
export default startApp();
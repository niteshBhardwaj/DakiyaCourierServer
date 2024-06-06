import "reflect-metadata";
import loaders, { loadAppData } from "./plugins/loaders";
import hono from "./plugins/hono";

const startApp = async () => {
  const app = await hono();
  await loaders({ app });

  if (process.env.NODE_ENV !== 'test') {
    process.on('unhandledRejection', (err) => {
      console.error(err);
      process.exit(1);
    });

    // void app.listen(
    //   { port: app.config.PORT ?? 5050, host: app?.config?.HOST },
    //   (_err, address) => {
    //     loadAppData();
    //     console.log(`Server started at: ${address}`);
    //   },
    // );

    // for (const signal of ['SIGINT', 'SIGTERM']) {
    //   process.on(signal, () =>
    //     app.close().then((err) => {
    //       console.log(`close application on ${signal}`);
    //       process.exit(err ? 1 : 0);
    //     }),
    //   );
    // }
  }
  return {
    PORT: 8080,
    fetch: app.fetch
  }
}
export default await startApp();
import yogaInit from "yoga";

async function main() {
  const yoga = await yogaInit();
  const server = Bun.serve({
    fetch: yoga,
    port: Bun.env.PORT,
  });
  console.info(
    `Server is running on ${new URL(
      yoga.graphqlEndpoint,
      `http://${server.hostname}:${server.port}`
    )}`
  );
}

main()
.catch((e) => {
  console.log(e);
  process.exit();
})

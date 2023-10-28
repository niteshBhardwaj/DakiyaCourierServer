import { createYoga } from "graphql-yoga";
import configYoga from "./config.yoga";

export default async () => {
    return createYoga(await configYoga());
}

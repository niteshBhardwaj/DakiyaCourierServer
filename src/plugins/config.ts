import { CONFIG_ERRORS } from './../constants/errors.constant';
import "dotenv/config";
import { Static, Type } from "@sinclair/typebox";
import Ajv from "ajv";

export enum NodeEnv {
  development = "development",
  test = "test",
  production = "production",
}

const ConfigSchema = Type.Strict(
  Type.Object({
    NODE_ENV: Type.Enum(NodeEnv),
    LOG_LEVEL: Type.String(),
    HOST: Type.Optional(Type.String()),
    PORT: Type.Optional(Type.Number()),
    DATABASE_URL: Type.String(),
  })
);

const ajv = new Ajv({
  allErrors: true,
  removeAdditional: true,
  useDefaults: true,
  coerceTypes: true,
  allowUnionTypes: true,
});

export type Config = Static<typeof ConfigSchema>;

// Validate the config
const configPlugin = async (server) => {
  const validate = ajv.compile(ConfigSchema);
  const valid = validate(process.env);
  if (!valid) {
    throw new Error(CONFIG_ERRORS.ENV_VALIDATION + JSON.stringify(validate.errors, null, 2));
  }
  server.decorate("config", process.env as any);
};

export const env = process.env;
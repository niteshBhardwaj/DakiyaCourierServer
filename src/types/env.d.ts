import { NodeEnv } from "@/plugins/config";

declare namespace NodeJS {
    export interface ProcessEnv {
      NODE_ENV: NodeEnv;
      HOST: string;
      JWT_SECRET: string;
      REDIS_HOST: string;
      REDIS_PORT: number;
      REDIS_USER: string;
      REDIS_PASSWORD: string;
      API_HOST: string;
      API_PORT: number;
      DATABASE_URL: string;
      SMS_API_KEY: string;
      LOG_LEVEL: string;
    }
  }
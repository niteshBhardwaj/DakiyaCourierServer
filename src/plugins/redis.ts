// import Redis from 'ioredis';
// import { config } from './config';
// import Logger from './logger';

// export const createRedisClient = () => {
//   return new Redis(
//     `redis://${config.REDIS_USER}:${config.REDIS_PASSWORD}@${config.REDIS_HOST}:${config.REDIS_PORT}`,
//   );
// }
// export const redis = createRedisClient();

// redis.on('ready', () => {
//   Logger.info('Redis client is ready');
// });
// redis.on('error', (error) => {
//   Logger.error(`Redis client error: ${error}`);
// });


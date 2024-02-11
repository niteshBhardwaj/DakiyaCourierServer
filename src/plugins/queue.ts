// import Logger from '@/plugins/logger';
// import { EVENTS } from '@/constants';
// import Queue from 'bull';
// import { EventDispatcher } from 'event-dispatch';
// import { config } from './config';
// // Create a new queue with the given name and the existing Redis instance
// export const workQueue = new Queue(
//   'orders',
//   `redis://${config.REDIS_USER}:${config.REDIS_PASSWORD}@${config.REDIS_HOST}:${config.REDIS_PORT}`,
// );
// const eventEmiter = new EventDispatcher();

// // Process jobs from the queue
// export const setQueueProcess = () => {
//   workQueue.process(async (job, done) => {
//     Logger.info(`Processing job:' Id: ${job.id}, attempsMade: ${job.attemptsMade}`);
//     job
//     eventEmiter.dispatch(EVENTS.QUEUE.PROCESS, {
//       job,
//       done,
//     });
//   });
// };

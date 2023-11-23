import mongoose from 'mongoose';
import { Container } from 'typedi';
import LoggerInstance from './logger';
import { MSG_DEP_LOADED, CONFIG_ERROR_KEYS } from '@/constants';

export default ({ models }: { models: Record<string, any>[] }) => {
  try {
    models.forEach(m => {
      const [name, model] = Object.entries(m) as unknown as [string, mongoose.Document];
      Container.set(name, model);
    });

    Container.set('logger', LoggerInstance);

    LoggerInstance.info(MSG_DEP_LOADED);

  } catch (e) {
    LoggerInstance.error(CONFIG_ERROR_KEYS.DEPENDENCY_FAILED, e);
    throw e;
  }
};

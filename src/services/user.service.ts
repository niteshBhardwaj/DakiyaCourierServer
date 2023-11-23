import { User } from '@graphql/typedefs/users.type';
import LoggerInstance from '@/plugins/logger';
import { Service, Inject } from 'typedi';
import { EventDispatcher, EventDispatcherInterface } from '@/decorators/eventDispatcher';
import UploadService from './upload.service';

@Service()
export default class UserService {
  constructor(
    @Inject('logger') private logger: typeof LoggerInstance,
    private uploadService: UploadService,
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
  ) {}

  public async getAllUser(_query: unknown) {
    const userRecord = (await userModel.find({})) as [User];
    return userRecord as [User];
  }
}

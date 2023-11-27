import { User } from '@graphql/typedefs/users.type';
import LoggerInstance from '@/plugins/logger';
import { Service, Inject } from 'typedi';
import { EventDispatcher, EventDispatcherInterface } from '@/decorators/eventDispatcher';
import { createHashPaswordAndSalt } from '@/utils/password.util';
import { CreateAccountInput } from '@/graphql/args/auth.input';
import { PrismaClient } from '@prisma/client';

@Service()
export default class UserService {
  constructor(
    @Inject('prisma') private prisma: PrismaClient,
    @Inject('logger') private logger: typeof LoggerInstance,
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
  ) {}

  public async createAccount(input: CreateAccountInput) {
    const { passwordHash, passwordSalt } = await createHashPaswordAndSalt(input.password);
    const userRecord = await this.prisma.user.create({
      data: {
        fullname: input.fullname,
        email: input.email,
        phone: input.phone,
        phoneCountry: '+91',
        passwordHash,
        passwordSalt,
      },
    });

    return userRecord;
  }

  public async getAllUser(_query: unknown) {
    const userRecord = (await userModel.find({})) as [User];
    return userRecord as [User];
  }
}

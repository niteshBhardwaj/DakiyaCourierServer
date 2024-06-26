import LoggerInstance from '~/plugins/logger';
import { Service, Inject } from 'typedi';
import { EventDispatcher, EventDispatcherInterface } from '~/decorators/eventDispatcher';
import { PrismaClient } from '@prisma/client';
import { GraphQLResolveInfo } from 'graphql';
import { PrismaSelect } from '@paljs/plugins';
import { LabelInput } from '~/graphql-type/args/label.input';

@Service()
export default class LabelService {
    constructor(
        @Inject('prisma') private prisma: PrismaClient,
        @Inject('logger') private logger: typeof LoggerInstance,
        @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
    ) { }

    public async findLabelInfoByUserId({ userId }: { userId: string }, info: GraphQLResolveInfo) {
        const select = new PrismaSelect(info as any).value
        const config = await this.prisma.labelConfig.findFirst({
            where: {
                userId
            },
            ...select
        })
        return config
    }


    public async addOrUpdateLabel({ input, userId }: { input: LabelInput; userId: string }, info: GraphQLResolveInfo) {
        const select = new PrismaSelect(info as any).value
        return this.prisma.labelConfig.upsert({
            where: {
                userId
            },
            create: {
                ...input,
                userId
            },
            update: {
                ...input
            },
            ...select
        })
    }

}

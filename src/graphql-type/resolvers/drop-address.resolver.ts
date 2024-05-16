import { Resolver, Query, Mutation, Arg, Ctx, Authorized } from 'type-graphql';
import { REQUEST } from '~/constants';
import { DropAddressInput, DropDeleteInput, DropUpdatedInput } from '../args/drop-address.input';
import DropAddressService from '~/services/drop-address.service';
import { UserContext } from '~/interfaces/auth.interface';
import { Inject, Service } from 'typedi';
import { DropAddressType, DropAddressUpdateType } from '../typedefs/drop-address.type';
import { MessageType } from '../typedefs/common.type';

@Service()
@Resolver()
export class dropAddressResolver {
  @Inject()
  dropAddressService: DropAddressService;

  @Authorized()
  @Query(() => [DropAddressType], {
    description: 'Get all drop addresses',
  })
  async getDropAddresses(@Ctx() { user: { userId } }: { user: UserContext }): Promise<DropAddressType[]> {
    return this.dropAddressService.getDropAddresses({ userId });
  }

  @Mutation(() => DropAddressType, {
    description: 'Add drop address',
  })
  async addDropAddress(
    @Arg(REQUEST) input: DropAddressInput,
    @Ctx() { user: { userId } }: { user: UserContext },
  ): Promise<DropAddressType> {
    return this.dropAddressService.addDropAddress({ input, userId });
  }

  @Mutation(() => MessageType, {
    description: 'Delete drop address',
  })
  async deleteDropAddress(
    @Arg(REQUEST) { id }: DropDeleteInput,
    @Ctx() { user: { userId } }: { user: UserContext },
  ): Promise<MessageType> {
    await this.dropAddressService.deleteDropAddress({ id, userId });
    return { message: 'Deleted successfully' };
  }

  @Mutation(() => DropAddressUpdateType, {
    description: 'Edit drop address',
  })
  async editDropAddress(
    @Arg(REQUEST) input: DropUpdatedInput,
    @Ctx() { user: { userId } }: { user: UserContext },
  ): Promise<DropAddressUpdateType> {
    return this.dropAddressService.editDropAddress({ input, userId });
  }
}
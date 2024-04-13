import { Resolver, Query, Mutation, Arg, Ctx, Authorized } from 'type-graphql';
import { REQUEST } from '@/constants';
import { PickupAddressInput, PickupDeleteInput, PickupUpdatedInput } from '../args/pickup-address.input';
import PickupAddressService from '@/services/pickup-address.service';
import { UserContext } from '@/interfaces/auth.interface';
import { Inject, Service } from 'typedi';
import { PickupAddressType, PickupAddressUpdateType } from '../typedefs/pickup-address.type';
import { MessageType } from '../typedefs/common.type';

@Service()
@Resolver()
export class pickupAddressResolver {
  @Inject()
  pickupAddressService: PickupAddressService;

  @Authorized()
  @Query(() => [PickupAddressType], {
    description: 'Get all pickup addresses',
  })
  async getPickupAddresses(@Ctx() { user: { userId } }: { user: UserContext }): Promise<PickupAddressType[]> {
    return this.pickupAddressService.getPickupAddresses({ userId });
  }

  @Mutation(() => PickupAddressType, {
    description: 'Add pickup address',
  })
  async addPickupAddress(
    @Arg(REQUEST) input: PickupAddressInput,
    @Ctx() { user: { userId } }: { user: UserContext },
  ): Promise<PickupAddressType> {
    return this.pickupAddressService.addPickupAddress({ input, userId });
  }

  @Mutation(() => MessageType, {
    description: 'Delete pickup address',
  })
  async deletePickupAddress(
    @Arg(REQUEST) { id }: PickupDeleteInput,
    @Ctx() { user: { userId } }: { user: UserContext },
  ): Promise<MessageType> {
    await this.pickupAddressService.deletePickupAddress({ id, userId });
    return { message: 'Deleted successfully' };
  }

  @Mutation(() => PickupAddressUpdateType, {
    description: 'Edit pickup address',
  })
  async editPickupAddress(
    @Arg(REQUEST) input: PickupUpdatedInput,
    @Ctx() { user: { userId } }: { user: UserContext },
  ): Promise<PickupAddressUpdateType> {
    return this.pickupAddressService.editPickupAddress({ input, userId });
  }
}
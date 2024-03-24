import { Resolver, Query, Mutation, Arg, Ctx } from 'type-graphql';
import { REQUEST } from '@/constants';
import { PickupAddress } from '@prisma/client';
import { PickupAddressInput } from '../args/pickup-address.input';
import PickupAddressService from '@/services/pickup-address.service';
import { UserContext } from '@/interfaces/auth.interface';

@Resolver(PickupAddressInput)
export class PickupAddressResolver {
  constructor(private readonly pickupAddressService: PickupAddressService) {}

  @Query(() => [PickupAddressInput])
  async getPickupAddresses(@Ctx() { user: { userId } }: { user: UserContext }): Promise<PickupAddress[]> {
    return this.pickupAddressService.getPickupAddresses({ userId });
  }

  @Mutation(() => PickupAddressInput)
  async addPickupAddress(
    @Arg(REQUEST) input: PickupAddressInput,
    @Ctx() { user: { userId } }: { user: UserContext },
  ): Promise<PickupAddress> {
    return this.pickupAddressService.addPickupAddress({ input, userId });
  }

  @Mutation(() => PickupAddressInput)
  async deletePickupAddress(
    @Arg('id') id: string,
    @Ctx() { user: { userId } }: { user: UserContext },
  ): Promise<PickupAddress> {
    return this.pickupAddressService.deletePickupAddress({ id, userId });
  }

  @Mutation(() => PickupAddressInput)
  async editPickupAddress(
    @Arg(REQUEST) input: PickupAddressInput,
    @Arg('id') id: string,
    @Ctx() { user: { userId } }: { user: UserContext },
  ): Promise<PickupAddress> {
    return this.pickupAddressService.editPickupAddress({ input, id, userId });
  }
}
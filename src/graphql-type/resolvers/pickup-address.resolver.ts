import { Resolver, Query, Mutation, Arg, Ctx, Authorized } from 'type-graphql';
import { REQUEST } from '@/constants';
import { PickupAddress } from '@prisma/client';
import { PickupAddressInput } from '../args/pickup-address.input';
import PickupAddressService from '@/services/pickup-address.service';
import { UserContext } from '@/interfaces/auth.interface';
import { Inject, Service } from 'typedi';
import { PickupAddressType } from '../typedefs/pickup-address.type';

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

  @Mutation(() => PickupAddressType)
  async addPickupAddress(
    @Arg(REQUEST) input: PickupAddressInput,
    @Ctx() { user: { userId } }: { user: UserContext },
  ): Promise<PickupAddressType> {
    return this.pickupAddressService.addPickupAddress({ input, userId });
  }

  // @Mutation(() => PickupAddressInput)
  // async deletePickupAddress(
  //   @Arg('id') id: string,
  //   @Ctx() { user: { userId } }: { user: UserContext },
  // ): Promise<PickupAddress> {
  //   return this.pickupAddressService.deletePickupAddress({ id, userId });
  // }

  // @Mutation(() => PickupAddressInput)
  // async editPickupAddress(
  //   @Arg(REQUEST) input: PickupAddressInput,
  //   @Arg('id') id: string,
  //   @Ctx() { user: { userId } }: { user: UserContext },
  // ): Promise<PickupAddress> {
  //   return this.pickupAddressService.editPickupAddress({ input, id, userId });
  // }
}
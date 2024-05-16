import { Inject, Service } from 'typedi';
import { Arg, Authorized, Ctx, Mutation, Resolver } from 'type-graphql';
import { QUERY_DESC, REQUEST } from '~/constants';
import { CourierIdInput } from '../args/courier-partner.input';
import { MessageType } from '../typedefs/common.type';
import CourierPartnerService from '~/services/courier-partners.service';

@Service()
@Resolver()
export class CourierPartnerResolver {
  @Inject()
  courierPartnerService: CourierPartnerService
  /* login */
  @Mutation(() => MessageType, {
    description: QUERY_DESC.INIT_AUTH,
  })
  async loadPincode(@Arg(REQUEST) args: CourierIdInput): Promise<MessageType> {
    await this.courierPartnerService.loadPincode(args);
    return { message: 'Pincode loaded successfully' };
  }
}

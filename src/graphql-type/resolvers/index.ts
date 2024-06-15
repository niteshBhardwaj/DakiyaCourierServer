import { userResolver } from './users.resolver';
import { authResolver } from './auth.resolver';
import { adminResolver } from './admin.resolver';
import { CourierPartnerResolver as courierPartnerResolver } from './courier-parnters.resolver';
import { orderResolver } from './order.resolver';
import { pincodeResolver } from './pincode.resolver'
import { BuildSchemaOptions } from 'type-graphql';
import { pickupAddressResolver } from './pickup-address.resolver';
import { dropAddressResolver } from './drop-address.resolver';
import { rateCardResolver } from './rate-card.resolver';
// import { walletResolver } from './wallet.resolver';

export default [
    userResolver,
    authResolver,
    adminResolver,
    courierPartnerResolver,
    orderResolver,
    pincodeResolver,
    pickupAddressResolver,
    dropAddressResolver,
    rateCardResolver
    // walletResolver
] as BuildSchemaOptions['resolvers'];
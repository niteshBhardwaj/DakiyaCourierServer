import { userResolver } from './users.resolver';
import { authResolver } from './auth.resolver';
import { adminResolver } from './admin.resolver';
import { CourierPartnerResolver as courierPartnerResolver } from './courier-parnters.resolver';
// import { walletResolver } from './wallet.resolver';

export default [
    userResolver,
    authResolver,
    adminResolver,
    courierPartnerResolver
    // walletResolver
];
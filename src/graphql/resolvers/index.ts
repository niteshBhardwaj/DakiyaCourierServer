import { userResolver } from './users.resolver';
import { authResolver } from './auth.resolver';
import { adminResolver } from './admin.resolver';
import { walletResolver } from './wallet.resolver';

export default [
    userResolver,
    authResolver,
    adminResolver,
    walletResolver
];
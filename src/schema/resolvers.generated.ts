/* This file was automatically generated. DO NOT UPDATE MANUALLY. */
    import type   { Resolvers } from './types.generated';
    import    { AuthPayload } from './graphql/resolvers/AuthPayload';
import    { signup as Mutation_signup } from './graphql/resolvers/Mutation/signup';
import    { getCurrentUser as Query_getCurrentUser } from './graphql/resolvers/Query/getCurrentUser';
import    { login as Query_login } from './graphql/resolvers/Query/login';
import    { User } from './graphql/resolvers/User';
    export const resolvers: Resolvers = {
      Query: { getCurrentUser: Query_getCurrentUser,login: Query_login },
      Mutation: { signup: Mutation_signup },
      
      AuthPayload: AuthPayload,
User: User
    }
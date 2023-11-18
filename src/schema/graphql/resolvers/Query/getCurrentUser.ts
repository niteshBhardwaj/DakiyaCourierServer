import type { QueryResolvers } from "./../../../types.generated";
export const getCurrentUser: NonNullable<QueryResolvers['getCurrentUser']> = async (_parent, _arg, _ctx) => {
        return {
                token: '2323dd'
        }
};

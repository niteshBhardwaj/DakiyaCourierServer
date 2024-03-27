import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class Transaction {
    
}
  
  // Create a Wallet model.
@ObjectType()
export class WalletResponse {
    @Field()    
    balance: number;
}
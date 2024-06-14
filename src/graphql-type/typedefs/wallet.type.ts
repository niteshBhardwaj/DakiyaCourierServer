import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class Transaction {
    
}
  
  // Create a Wallet model.
@ObjectType()
export class WalletType {
    @Field({ defaultValue: 0, nullable: true })    
    balance: number;
}
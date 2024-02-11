import { Field, ObjectType } from 'type-graphql';

@ObjectType()
class Transaction {
    @Field({ nullable: true })    
    type: string;
  
    @Field({ nullable: true })    
    public earnType: string;
  
    @Field({ nullable: true })    
    public amount: number;
  
    @Field({ nullable: true })    
    public created: Date;
  }
  
  // Create a Wallet model.
@ObjectType()
export class WalletResponse {
    @Field({ nullable: true })    
    totalEarn: number;
    @Field(_ => [Transaction], { nullable: true })    
    transaction: Transaction[];
  }
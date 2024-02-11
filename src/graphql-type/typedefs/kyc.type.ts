import { ObjectType, Field } from "type-graphql";

@ObjectType()
class KycDocumentType {
  @Field({ nullable: true})
  type?: string;
  @Field({ nullable: true})
  file?: string;
  @Field({ nullable: true})
  status?: string;
}

@ObjectType()
export class UserKycType {
  @Field({ nullable: true})
  status?: string;

  @Field(type => [KycDocumentType], {nullable: true})
  kycDocuments: KycDocumentType[] | null;

  @Field({ nullable: true})
  kycType?: string;

  @Field({ nullable: true})
  selfiePhoto?: string;

}
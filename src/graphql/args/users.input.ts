import {
  VALIDATION_MSG,
  PhoneLocalAlias,
} from '@/constants';
import { IsMobilePhone, MaxLength } from 'class-validator';
import { InputType, Field } from 'type-graphql';

@InputType()
export class AdminUploadDocsInput {

  @Field()
  userId: string;

  @Field()
  docType: string;

  @Field()
  state: string;

  @Field()
  @MaxLength(100)
  message: string;
}
@InputType()
export class AdminLoginInput {
  @Field()
  @IsMobilePhone(PhoneLocalAlias.IN, undefined, {
    message: VALIDATION_MSG.PHONE_NO,
  })
  phone: string;

  @Field()
  password: string;
}

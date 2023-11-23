import { OtpType } from '@/models/otp.model';
/* eslint-disable @typescript-eslint/no-namespace */
import { UserType } from '@/models/user.model';
import { Document, Model } from 'mongoose';
declare global {
  namespace Models {
    export type UserModel = Model<UserType & Document>;
    export type OtpModel = Model<OtpType & Document>;
  }
}





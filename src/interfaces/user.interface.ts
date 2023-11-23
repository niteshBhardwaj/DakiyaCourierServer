export interface IUser {
  _id: string;
  phone: string;
  firstname: string;
  lastname: string;
  email: string;
  photo: string;
  city: string;
}

export type PartnerStore = {
  socketId: string;
  userId: string;
  connected: boolean;
  lastActivity: string;
  activeOrders: string[] | [];
  location: any;
  state: string;
  isAvailable: boolean;
  isOnDuty: boolean;
}

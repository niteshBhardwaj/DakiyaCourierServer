import { Service } from 'typedi';

@Service()
export default class UserService {
  constructor(
  ) {}

  public async getAllUser() {
    return {
      token: 'from user service'
    }
  }
}

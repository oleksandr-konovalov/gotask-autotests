import { IUser } from '@gt-types/user.ts';

export class User {
  public email: string;
  public password: string;

  public constructor(user: IUser) {
    this.email = user.email;
    this.password = user.password;
  }
}

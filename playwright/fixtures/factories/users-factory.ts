import { IUser } from '@gt-types/user.ts';
import { User } from '@gt-models/user.ts';
import { faker } from '@faker-js/faker';
import usersObj from '../jsons/users.json';

export class UsersFactory {
  public static customer(index: number): User {
    return new User(usersObj.customer[index] as IUser);
  }

  public static randomUser(): User {
    return {
      email: faker.internet.email(),
      password: faker.internet.password(),
    };
  }
}

import { CreateOrder } from '@gt-pages/customer/createOrder.page.ts';
import { Landing } from '@gt-pages/nli/landing.page.ts';
import { Login } from '@gt-pages/nli/login.page.ts';
import { PageHolder } from '@gt-app/abstractClass.ts';
import { SignUp } from '@gt-pages/nli/signUp.page.ts';

export class NLI extends PageHolder {
  public landing: Landing = new Landing(this.page, this.context);
  public singUp: SignUp = new SignUp(this.page, this.context);
  public login: Login = new Login(this.page, this.context);
}

export class Customer extends PageHolder {
  public createOrder: CreateOrder = new CreateOrder(this.page, this.context);
}

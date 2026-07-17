import { RoleEnum } from "../../../shared/enums/role.enum";
import { IBaseEntity } from "./base-entity.interface";
import { IOrder } from "./order.interface";

export interface IUser extends IBaseEntity {
  name: string;
  email: string;
  password: string;
  role: RoleEnum;

  orders: IOrder[];
}
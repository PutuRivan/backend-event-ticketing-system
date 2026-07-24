import {
  Column, Entity,
  OneToMany,
  BeforeInsert,
  BeforeUpdate,
} from "typeorm";
import { Orders } from "./orders.entity";
import { BaseEntity } from "./base.entity";
import { IUser } from "../interfaces/user.interface";
import { RoleEnum } from "../../../shared/enums/role.enum";
import { IUserToken } from "../interfaces/user-token.interface";
import { UserToken } from "./user-token.entity";
import { HashUtil } from "../../../shared/utils/hash.util";

@Entity('users')
export class Users extends BaseEntity implements IUser {
  @Column()
  name!: string;

  @Column({
    unique: true,
  })
  email!: string;

  @Column()
  password!: string;

  @Column({
    type: 'enum',
    enum: RoleEnum,
    default: RoleEnum.USER,
  })
  role!: RoleEnum;

  @OneToMany(() => Orders, (order) => order.user)
  orders!: Orders[];

  @OneToMany(() => UserToken, (userToken) => userToken.user)
  userTokens?: IUserToken[];
}
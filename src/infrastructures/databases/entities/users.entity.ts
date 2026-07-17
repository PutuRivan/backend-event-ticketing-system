import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Orders } from "./orders.entity";
import { BaseEntity } from "./base.entity";
import { IUser } from "../interfaces/user.interface";
import { RoleEnum } from "../../../shared/enums/role.enum";

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
}
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Users } from "./users.entity";
import { BaseEntity } from "./base.entity";
import { IOrder } from "../interfaces/order.interface";
import { OrderStatusEnum } from "../../../shared/enums/order-status.enum";
import { Tickets } from "./tickets.entity";
import { Events } from "./events.entity";

@Entity("orders")
export class Orders extends BaseEntity implements IOrder {

  @Column()
  userId!: string;

  @Column()
  eventId!: string;

  @ManyToOne(() => Users, (user) => user.orders)
  @JoinColumn({
    name: 'user_id',
  })
  user!: Users;

  @ManyToOne(() => Events, (event) => event.orders)
  @JoinColumn({
    name: 'event_id',
  })
  event!: Events;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
  })
  totalPrice!: number;

  @Column({
    type: 'enum',
    enum: OrderStatusEnum,
    default: OrderStatusEnum.PENDING,
  })
  status!: OrderStatusEnum;

  @Column({
    nullable: true,
  })
  expiredAt!: Date;

  @Column({
    nullable: true,
  })
  paidAt!: Date;

  @OneToMany(() => Tickets, (ticket) => ticket.order)
  tickets!: Tickets[];
}

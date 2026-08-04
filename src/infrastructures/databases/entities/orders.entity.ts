import {
  Column,
  Entity,
  Index,
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
import { Reminders } from "./reminder.entity";

@Entity("orders")
@Index(["eventId", "status"])
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

  @Column()
  quantity!: number;

  @Column({
    type: 'enum',
    enum: OrderStatusEnum,
    default: OrderStatusEnum.PENDING,
  })
  status!: OrderStatusEnum;

  @Column({
    name: 'ticket_email_sent',
    type: 'boolean',
    default: false,
  })
  ticketEmailSent!: boolean;

  @Column({
    type: "timestamp",
    nullable: true,
  })
  expiredAt!: Date | null;

  @Column({
    type: "timestamp",
    nullable: true,
  })
  paidAt!: Date | null;

  @OneToMany(() => Tickets, (ticket) => ticket.order)
  tickets!: Tickets[];

  @OneToMany(
    () => Reminders,
    reminder => reminder.order
  )
  reminders!: Reminders[];
}

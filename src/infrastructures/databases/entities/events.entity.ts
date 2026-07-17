import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { EventCategories } from "./event-categories.entity";
import { Orders } from "./orders.entity";
import { BaseEntity } from "./base.entity";
import { IEvent } from "../interfaces/event.interface";

@Entity("events", { schema: "public" })
export class Events extends BaseEntity implements IEvent {
  @Column()
  categoryId!: string;

  @ManyToOne(() => EventCategories, (category) => category.events)
  @JoinColumn({
    name: 'category_id',
  })
  category!: EventCategories;

  @Column()
  title!: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  description!: string;

  @Column({
    nullable: true,
  })
  location!: string;

  @Column()
  eventDate!: Date;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
  })
  ticketPrice!: number;

  @Column()
  quota!: number;

  @Column({
    default: false,
  })
  published!: boolean;

  @OneToMany(() => Orders, (order) => order.event)
  orders!: Orders[];
}

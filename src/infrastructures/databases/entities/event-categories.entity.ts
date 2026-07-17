import { Column, Entity, Index, OneToMany } from "typeorm";
import { Events } from "./events.entity";
import { BaseEntity } from "./base.entity";
import { IEventCategories } from "../interfaces/event-categories.interface";

@Entity("event_categories")

export class EventCategories extends BaseEntity implements IEventCategories {
  @Column()
  name!: string;

  @Column({
    nullable: true,
  })
  description!: string;

  @OneToMany(() => Events, (events) => events.category)
  events!: Events[];
}

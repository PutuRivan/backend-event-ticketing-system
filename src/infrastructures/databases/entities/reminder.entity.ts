import { IReminders } from './../interfaces/reminders.interface';
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Orders } from './orders.entity';
import { ReminderTypeEnum } from '../../../shared/enums/reminder-type.enum';
import { BaseEntity } from './base.entity';

@Entity('reminders')
export class Reminders extends BaseEntity implements IReminders {
  @Column({
    name: 'order_id',
    type: 'uuid'
  })
  orderId!: string;


  @ManyToOne(
    () => Orders,
    order => order.reminders,
    {
      onDelete: 'CASCADE'
    }
  )
  @JoinColumn({
    name: 'order_id'
  })
  order!: Orders;



  @Column({
    type: 'enum',
    enum: ReminderTypeEnum,
  })
  type!: ReminderTypeEnum;



  @Column({
    name: 'scheduled_at',
    type: 'timestamp'
  })
  scheduledAt!: Date;



  @Column({
    name: 'sent_at',
    type: 'timestamp',
    nullable: true,
  })
  sentAt!: Date | null;
}
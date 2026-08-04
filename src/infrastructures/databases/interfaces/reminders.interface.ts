import { ReminderTypeEnum } from "../../../shared/enums/reminder-type.enum";
import { IBaseEntity } from "./base-entity.interface";
import { IOrder } from "./order.interface";

export interface IReminders extends IBaseEntity {
  orderId: string;
  order: IOrder;
  type: ReminderTypeEnum;
  scheduledAt: Date;
  sentAt: Date | null;
}